import { expect } from "chai";
import { fileExists, writeFile, deleteFile } from "infrastructure-util";
import { Event, FileEventStream } from "infrastructure-events";

class Foo extends Event {

  constructor(id, name, timestamp) {
    super(id, name, timestamp);
  }

  static createFrom({ id, name, timestamp } = {}) {
    return new Foo(id, name, timestamp);
  }

}

describe("File Event Stream", () => {

  after(async () => {
    await deleteFile("./streams/foo");
    await deleteFile("./streams/foo1");
    await deleteFile("./streams/foo2");
  });

  it("should write to file stream", async () => {
    var stream = new FileEventStream("foo", [[ "Foo", Foo ]], "./streams");
    await stream.open();
    await stream.write(new Foo(1, "Foo", 1001));
    await stream.write(new Foo(2, "Foo", 1002));
    await stream.write(new Foo(3, "Foo", 1003));
    await stream.close();
    expect(await fileExists("./streams/foo")).to.be.true;
  });

  it("should read event from file stream", async () => {
    await writeFile("./streams/foo1", { flag: "w", encoding: "utf8" },
      "{\"id\":1,\"name\":\"Foo\",\"timestamp\":1001}");
    var stream = new FileEventStream("foo1", [ [ "Foo", Foo ] ], "./streams");
    await stream.open();
    var event = await stream.read();
    await stream.close();
    expect(event).to.be.not.null;
  });

  it("should iterate over stream", async () => {
    var stream = new FileEventStream("foo2", [[ "Foo", Foo ]], "./streams");
    await stream.open();
    await stream.write(new Foo(1, "Foo", 1001));
    await stream.write(new Foo(2, "Foo", 1002));
    await stream.write(new Foo(3, "Foo", 1003));
    stream.position = 0;
    var index = 1;
    for (var event of stream) {
      expect(event.id).to.be.equal(index);
      index++;
    }
    await stream.close();
    expect(index).to.be.equal(4);
  });

});