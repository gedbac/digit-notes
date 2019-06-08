import { expect } from "chai";
import { writeFile, fileExists, deleteFile, ObjectSerializer } from "d8s/infrastructure/util";
import { Logger } from "d8s/infrastructure/logging";
import { FileEventStore } from "d8s/infrastructure/events";

describe("File Event Store", () => {

  after(async () => {
    await deleteFile("./streams/foo4");
    await deleteFile("./snapshots/foo");
    await deleteFile("./snapshots/foo1");
  });

  it("should create stream", async () => {
    var eventStore = new FileEventStore(
      "./",
      new ObjectSerializer(),
      new Logger("FileEventStore")
    );
    await eventStore.open();
    var stream = await eventStore.createStream("foo3");
    await eventStore.close();
    expect(stream).to.be.not.null;
    expect(stream.name).to.be.equal("foo3");
  });

  it("should get stream", async () => {
    await writeFile("./streams/foo4", { flag: "w", encoding: "utf8" }, null);
    var eventStore = new FileEventStore(
      "./",
      new ObjectSerializer(),
      new Logger("FileEventStore")
    );
    await eventStore.open();
    var stream = await eventStore.getStream("foo4");
    await eventStore.close();
    expect(stream).to.be.not.null;
  });

  it("should delete stream", async () => {
    await writeFile("./streams/foo5", { flag: "w", encoding: "utf8" }, null);
    var eventStore = new FileEventStore(
      "./",
      new ObjectSerializer(),
      new Logger("FileEventStore")
    );
    await eventStore.open();
    await eventStore.deleteStream("foo5");
    var stream = await eventStore.getStream("foo5");
    await eventStore.close();
    expect(stream).to.be.null;
  });

  it("should save snapshot", async () => {
    var snapshot = {
      id: "3672ab14-b531-4563-9d77-e0b0ab4e5745",
      createdOn: 1000
    };
    var eventStore = new FileEventStore(
      "./",
      new ObjectSerializer(),
      new Logger("FileEventStore")
    );
    await eventStore.open();
    await eventStore.addSnapshot("foo", snapshot);
    await eventStore.close();
    expect(await fileExists("./snapshots/foo")).to.be.true;
  });

  it("should get latest snapshot", async () => {
    await writeFile("./snapshots/foo1", { flag: "w", encoding: "utf8" }, "{\"id\":\"a8a13d34-fcab-4cfb-b4d2-ddda1a91e648\",\"createdOn\":1000}");
    var eventStore = new FileEventStore(
      "./",
      new ObjectSerializer(),
      new Logger("FileEventStore")
    );
    await eventStore.open();
    var snapshot = await eventStore.getLatestSnapshot("foo1");
    await eventStore.close();
    expect(snapshot).to.be.not.null;
  });

});