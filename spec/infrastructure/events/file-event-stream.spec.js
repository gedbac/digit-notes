import { expect } from "chai";
import { fileExists, writeFile, deleteFile, ObjectSerializer } from "amber-notes/infrastructure/util";
import { Event, FileEventStream } from "amber-notes/infrastructure/events";

class Foo extends Event {

  constructor({ id, createdOn } = {}) {
    super({ id, createdOn });
  }

}

describe("File Event Stream", () => {

  after(async () => {
    await deleteFile("./streams/foo");
    await deleteFile("./streams/foo1");
  });

  it("should write stream to file", async () => {
    var stream = new FileEventStream(
      "foo",
      new ObjectSerializer([[ "Foo", Foo ]]),
      "./streams"
    );
    await stream.open();
    await stream.write(new Foo({ id: 1, cretedOn: 1001 }));
    await stream.write(new Foo({ id: 2, cretedOn: 1002 }));
    await stream.write(new Foo({ id: 3, cretedOn: 1003 }));
    await stream.close();
    expect(await fileExists("./streams/foo")).to.be.true;
  });

  it("should read stream from file", async () => {
    await writeFile("./streams/foo1", { flag: "w", encoding: "utf8" }, "{\"id\":1,\"createdOn\":1001,\"_t\":\"Foo\"}");
    var stream = new FileEventStream(
      "foo1",
      new ObjectSerializer([[ "Foo", Foo ]]),
      "./streams"
    );
    await stream.open();
    var event = await stream.read();
    await stream.close();
    expect(event).to.be.not.null;
  });

});