import { expect } from "chai";
import {
  Event,
  EventComparer,
  InMemoryEventStreamFactory,
  InMemoryEventStream,
  EventStreamMerger
} from "amber-notes/infrastructure/events";

class Foo extends Event {

  constructor({ id, createdOn } = {}) {
    super({ id, createdOn });
  }

}

describe("Event Stream Merger", () => {

  it("should merge to streams", async () => {
    var eventStreamMerger = new EventStreamMerger(
      new InMemoryEventStreamFactory(),
      new EventComparer()
    );
    var stream1 = new InMemoryEventStream("stream1");
    await stream1.open();
    await stream1.write(new Foo({ id: 1, createdOn: 1001 }));
    await stream1.write(new Foo({ id: 3,  createdOn: 1003 }));
    var stream2 = new InMemoryEventStream("stream2");
    stream2.open();
    await stream2.write(new Foo({ id: 1, createdOn: 1001 }));
    await stream2.write(new Foo({ id: 2, createdOn: 1002 }));
    var outputStream = await eventStreamMerger.merge(stream1, stream2);
    expect(outputStream).to.be.not.null;
    expect(outputStream.length).to.be.equal(3);
    var index = 1;
    var event = await outputStream.read();
    while(event) {
      expect(event.id).to.be.equal(index);
      index++;
      event = await outputStream.read();
    }
  });

});