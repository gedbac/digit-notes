import { expect } from "chai";
import {
  Event,
  EventComparer,
  InMemoryEventStreamFactory,
  InMemoryEventStream,
  EventStreamMerger
} from "infrastructure-events";

class Foo extends Event {

  constructor(id, name, timestamp) {
    super(id, name, timestamp);
  }

}

describe("Event Stream Merger", () => {

  it("should merge to streams", async () => {
    var supportedEventTypes = [[ "Foo", Foo ]];
    var eventStreamMerger = new EventStreamMerger(
      new InMemoryEventStreamFactory(supportedEventTypes),
      new EventComparer()
    );
    var stream1 = new InMemoryEventStream("stream1", supportedEventTypes,);
    await stream1.open();
    await stream1.write(new Foo(1, "Foo", 1001));
    await stream1.write(new Foo(3, "Foo", 1003));
    var stream2 = new InMemoryEventStream("stream2", supportedEventTypes);
    stream2.open();
    await stream2.write(new Foo(1, "Foo", 1001));
    await stream2.write(new Foo(2, "Foo", 1002));
    var outputStream = await eventStreamMerger.merge(stream1, stream2);
    expect(outputStream).to.be.not.null;
    expect(outputStream.length).to.be.equal(3);
    var index = 1;
    for (var event of outputStream) {
      expect(event.id).to.be.equal(index);
      index++;
    }
  });

});