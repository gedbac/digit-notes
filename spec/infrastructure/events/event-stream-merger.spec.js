import { expect } from "chai";
import {
  Event,
  EventComparer,
  InMemoryEventStreamFactory,
  InMemoryEventStream,
  EventStreamMerger
} from "amber-notes-infrastructure-events";

class FooEvent extends Event {

  constructor(props) {
    super(props);
  }

}

describe("Event Stream Merger", () => {

  it("should merge to streams", async () => {
    var supportedEventTypes = [[ "FooEvent", FooEvent ]];
    var eventStreamMerger = new EventStreamMerger({
      streamFactory: new InMemoryEventStreamFactory({
        supportedEventTypes: supportedEventTypes
      }),
      eventComparer: new EventComparer()
    });
    var stream1 = new InMemoryEventStream({
      name: "stream1",
      supportedEventTypes: supportedEventTypes
    });
    await stream1.open();
    await stream1.write(new FooEvent({ id: 1, name: "FooEvent", timestamp: 1001 }));
    await stream1.write(new FooEvent({ id: 3, name: "FooEvent", timestamp: 1003 }));
    var stream2 = new InMemoryEventStream({
      name: "stream2",
      supportedEventTypes: supportedEventTypes
    });
    stream2.open();
    await stream2.write(new FooEvent({ id: 1, name: "FooEvent", timestamp: 1001 }));
    await stream2.write(new FooEvent({ id: 2, name: "FooEvent", timestamp: 1002 }));
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