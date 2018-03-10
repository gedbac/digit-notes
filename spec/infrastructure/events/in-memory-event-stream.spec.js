import { expect } from "chai";
import { Event, InMemoryEventStream } from "infrastructure-events";

class FooEvent extends Event {

  constructor(props) {
    super(props);
  }

}

describe("In Memory Event Stream", () => {

  it("should write and read event from stream", async () => {
    var stream = new InMemoryEventStream({
      name: "foo",
      supportedEventTypes: [[ "FooEvent", FooEvent ]]
    });
    await stream.open();
    await stream.write(new FooEvent({ id: 1, name: "FooEvent", timestamp: 1000 }));
    stream.position = 0;
    var event = await stream.read();
    await stream.close();
    expect(event).to.not.be.null;
    expect(stream.length).to.be.equal(1);
    expect(stream.position).to.be.equal(1);
  });

  it("should iterate over stream", async () => {
    var stream = new InMemoryEventStream({
      name: "foo",
      events: [
        new FooEvent({ id: 1, name: "FooEvent", timestamp: 1000 }),
        new FooEvent({ id: 2, name: "FooEvent", timestamp: 1001 }),
        new FooEvent({ id: 3, name: "FooEvent", timestamp: 1002 })
      ]
    });
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