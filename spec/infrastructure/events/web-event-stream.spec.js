import { expect } from "chai";
import { uuid, ObjectSerializer } from "amber-notes/infrastructure/util";
import { Event, WebEventStream } from "amber-notes/infrastructure/events";

class Foo extends Event {

  constructor({ id, createdOn } = {}) {
    super({ id, createdOn });
  }

}

describe("Web Event Stream", () => {

  it("should write and read event from stream", async () => {
    var streamName = uuid();
    var stream1 = new WebEventStream(
      streamName,
      new ObjectSerializer([[ "Foo", Foo ]])
    );
    await stream1.open();
    await stream1.write(new Foo({ id: 1, createdOn: 1000 }));
    await stream1.write(new Foo({ id: 2, createdOn: 1001 }));
    await stream1.write(new Foo({ id: 3, createdOn: 1002 }));
    await stream1.close();
    var stream2 = new WebEventStream(
      streamName,
      new ObjectSerializer([[ "Foo", Foo ]])
    );
    await stream2.open();
    var index = 1;
    var event = await stream2.read();
    while (event) {
      expect(event.id).to.be.equal(index);
      index++;
      event = await stream2.read();
    }
    await stream2.close();
    expect(index).to.be.equal(4);
    expect(stream2.length).to.be.equal(3);
    expect(stream2.position).to.be.equal(3);
  });

});