import { expect } from "chai";
import { InMemoryEventStream, InMemoryEventStore } from "infrastructure-events";

describe("In Memory Event Store", () => {

  it("should create stream", async () => {
    var eventStore = new InMemoryEventStore();
    await eventStore.open();
    var stream = await eventStore.createStream("foo");
    await eventStore.close();
    expect(stream).to.be.not.null;
    expect(stream.name).to.be.equal("foo");
  });

  it("should get stream", async () => {
    var eventStore = new InMemoryEventStore({
      streams: [
        [ "foo", new InMemoryEventStream({ name: "foo" }) ]
      ]
    });
    await eventStore.open();
    var stream = await eventStore.getStream("foo");
    await eventStore.close();
    expect(stream).to.be.not.null;
  });

  it("should delete stream", async () => {
    var eventStore = new InMemoryEventStore({
      streams: [
        [ "foo", new InMemoryEventStream({ name: "foo" })]
      ]
    });
    await eventStore.open();
    await eventStore.deleteStream("foo");
    var stream = await eventStore.getStream("foo");
    await eventStore.close();
    expect(stream).to.be.null;
  });

});