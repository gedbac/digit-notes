import { expect } from "chai";
import { fileExists, writeFile, deleteFile } from "infrastructure-util";
import { Event, FileEventStream } from "infrastructure-events";

class FooEvent extends Event {

  constructor(props) {
    super(props);
  }

}

describe("File Event Stream", () => {

  after(async () => {
    await deleteFile("./streams/foo");
    await deleteFile("./streams/foo1");
    await deleteFile("./streams/foo2");
  });

  it("should write to file stream", async () => {
    var stream = new FileEventStream({
      name: "foo",
      path: "./streams",
      supportedEventTypes: [[ "FooEvent", FooEvent ]]
    });
    await stream.open();
    await stream.write(new FooEvent({ id: 1, name: "FooEvent", timestamp: 1001 }));
    await stream.write(new FooEvent({ id: 2, name: "FooEvent", timestamp: 1002 }));
    await stream.write(new FooEvent({ id: 3, name: "FooEvent", timestamp: 1003 }));
    await stream.close();
    expect(await fileExists("./streams/foo")).to.be.true;
  });

  it("should read event from file stream", async () => {
    await writeFile("./streams/foo1", { flag: "w", encoding: "utf8" },
      "{\"id\":1,\"name\":\"FooEvent\",\"timestamp\":1001}");
    var stream = new FileEventStream({
      name: "foo1",
      path: "./streams",
      supportedEventTypes: new Map([ [ 'FooEvent', FooEvent ] ])
    });
    await stream.open();
    var event = await stream.read();
    await stream.close();
    expect(event).to.be.not.null;
  });

  it("should iterate over stream", async () => {
    var stream = new FileEventStream({
      name: "foo2",
      path: "./streams",
      supportedEventTypes: [[ "FooEvent", FooEvent ]]
    });
    await stream.open();
    await stream.write(new FooEvent({ id: 1, name: "FooEvent", timestamp: 1001 }));
    await stream.write(new FooEvent({ id: 2, name: "FooEvent", timestamp: 1002 }));
    await stream.write(new FooEvent({ id: 3, name: "FooEvent", timestamp: 1003 }));
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