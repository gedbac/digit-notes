import { expect } from "chai";
import { Logger } from "amber-notes/infrastructure/logging";
import { InMemoryEventStore } from "amber-notes/infrastructure/events";

describe("In Memory Event Store", () => {

  it("should create stream", async () => {
    var eventStore = new InMemoryEventStore(
      new Logger("InMemoryEventStore")
    );
    await eventStore.open();
    var stream = await eventStore.createStream("foo");
    await eventStore.close();
    expect(stream).to.be.not.null;
    expect(stream.name).to.be.equal("foo");
  });

  it("should get stream", async () => {
    var eventStore = new InMemoryEventStore(
      new Logger("InMemoryEventStore")
    );
    await eventStore.open();
    await eventStore.createStream("foo");
    var stream = await eventStore.getStream("foo");
    await eventStore.close();
    expect(stream).to.be.not.null;
  });

  it("should delete stream", async () => {
    var eventStore = new InMemoryEventStore(
      new Logger("InMemoryEventStore")
    );
    await eventStore.open();
    await eventStore.createStream("foo");
    await eventStore.deleteStream("foo");
    var stream = await eventStore.getStream("foo");
    await eventStore.close();
    expect(stream).to.be.null;
  });

  it("should save and get latest snapshot", async () => {
    var snapshot = {
      id: "3672ab14-b531-4563-9d77-e0b0ab4e5745",
      createdOn: 1000
    };
    var eventStore = new InMemoryEventStore(
      new Logger("InMemoryEventStore")
    );
    await eventStore.open();
    await eventStore.addSnapshot("foo", snapshot);
    var latestSnapshot = await eventStore.getLatestSnapshot("foo");
    await eventStore.close();
    expect(snapshot).to.be.equal(latestSnapshot);
  });

});