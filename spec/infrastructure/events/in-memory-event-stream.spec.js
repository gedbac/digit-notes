import { expect } from "chai";
import { Event, InMemoryEventStream } from "amber-notes/infrastructure/events";

class Foo extends Event {

  constructor({ id, createdOn } = {}) {
    super({ id, createdOn });
  }

}

describe("In Memory Event Stream", () => {

  it("should write and read event from stream", async () => {
    var stream = new InMemoryEventStream("stream1");
    await stream.open();
    await stream.write(new Foo({ id: 1, createdOn: 1000 }));
    await stream.write(new Foo({ id: 2, createdOn: 1001 }));
    await stream.write(new Foo({ id: 3, createdOn: 1002 }));
    stream.position = 0;
    var index = 1;
    var event = await stream.read();
    while (event) {
      expect(event.id).to.be.equal(index);
      index++;
      event = await stream.read();
    }
    await stream.close();
    expect(index).to.be.equal(4);
    expect(stream.length).to.be.equal(3);
    expect(stream.position).to.be.equal(3);
  });

});