import { expect } from "chai";
import { writeFile, deleteFile } from "infrastructure-util";
import { FileEventStore } from "infrastructure-events";

describe("File Event Store", () => {

  after(async () => {
    await deleteFile("./streams/foo4");
  });

  it("should create stream", async () => {
    var eventStore = new FileEventStore({
      path: "./streams"
    });
    await eventStore.open();
    var stream = await eventStore.createStream("foo3");
    await eventStore.close();
    expect(stream).to.be.not.null;
    expect(stream.name).to.be.equal("foo3");
  });

  it("should get stream", async () => {
    await writeFile("./streams/foo4", { flag: "w", encoding: "utf8" }, null);
    var eventStore = new FileEventStore({
      path: "./streams"
    });
    await eventStore.open();
    var stream = await eventStore.getStream("foo4");
    await eventStore.close();
    expect(stream).to.be.not.null;
  });

  it("should delete stream", async () => {
    await writeFile("./streams/foo5", { flag: "w", encoding: "utf8" }, null);
    var eventStore = new FileEventStore({
      path: "./streams"
    });
    await eventStore.open();
    await eventStore.deleteStream("foo5");
    var stream = await eventStore.getStream("foo5");
    await eventStore.close();
    expect(stream).to.be.null;
  });

});