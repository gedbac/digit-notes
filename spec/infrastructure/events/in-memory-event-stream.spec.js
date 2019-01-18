import { expect } from "chai";
import { Event, InMemoryEventStream } from "infrastructure-events";

class Foo extends Event {

  constructor(id, name, timestamp) {
    super(id, name, timestamp);
  }

}

describe("In Memory Event Stream", () => {

  it("should write and read event from stream", async () => {
    var stream = new InMemoryEventStream("stream1", [[ "Foo", Foo ]]);
    await stream.open();
    await stream.write(new Foo(1, "Foo", 1000));
    stream.position = 0;
    var event = await stream.read();
    await stream.close();
    expect(event).to.not.be.null;
    expect(stream.length).to.be.equal(1);
    expect(stream.position).to.be.equal(1);
  });

  it("should iterate over stream", async () => {
    var stream = new InMemoryEventStream("stream1", null, [
      new Foo(1, "Foo", 1000),
      new Foo(2, "Foo", 1001),
      new Foo(3, "Foo", 1002)
    ]);
    stream.open();
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