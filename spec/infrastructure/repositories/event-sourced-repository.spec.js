import { expect } from "chai";
import { uuid, getTimestamp } from "infrastructure-util";
import { EventSourcedAggregate } from "infrastructure-model";
import { EventSourcedRepository } from "infrastructure-repositories";
import { Event, InMemoryEventStore } from "infrastructure-events";

class FooCreated extends Event {

  constructor(id, name, timestamp) {
    super(id, name, timestamp);
  }

  static createFrom({id = uuid(), name = "FooCreated", timestamp = getTimestamp()} = {}) {
    return new FooCreated(id, name, timestamp);
  }

}

class FooTextChanged extends Event {

  constructor(id, name, timestamp, text) {
    super(id, name, timestamp);
    this._text = text;
  }

  get text() {
    return this._text;
  }

  static createFrom({id = uuid(), name = "FooTextChanged", timestamp = getTimestamp(), text = null} = {}) {
    return new FooTextChanged(id, name, timestamp, text);
  }

}

class Foo extends EventSourcedAggregate {

  constructor(id, createdOn, modifiedOn, deleted, version, uncommittedEvents, text) {
    super(id, createdOn, modifiedOn, deleted, version, uncommittedEvents);
    this._text = text;
  }

  get text() {
    return this._text;
  }

  _onFooTextChanged(event) {
    this._text = event.text;
  }

  static createFrom({ id = uuid(), createdOn = getTimestamp(), modifiedOn = null, deleted = false, version = 0,
    uncommittedEvents = [], text = null} = {}) {
    return new Foo(id, createdOn, modifiedOn, deleted, version, uncommittedEvents, text);
  }

}

class FooRepository extends EventSourcedRepository {

  constructor(eventStore, aggregateType) {
    super(eventStore, aggregateType);
  }

}

describe("Event Sourced Repository", () => {

  it("should get document from snapshot", async () => {
    var id = "9cb9f65c-2904-4180-8e38-dde3c14a5fd1";
    var eventStore = new InMemoryEventStore([
      [ "FooCreated", FooCreated ],
      [ "FooTextChanged", FooTextChanged ]
    ]);
    await eventStore.open();
    var stream = await eventStore.createStream(`Foo::${id}`);
    await stream.open();
    await stream.write(FooCreated.createFrom({ createdOn: 1000 }));
    await stream.write(FooTextChanged.createFrom({ text: "#TEXT" }));
    await stream.close();
    await eventStore.addSnapshot(`Foo::${id}`, { id: id, createdOn: 1000, version: 1 });
    var repository = new FooRepository(eventStore, Foo);
    var aggregate = await repository.findBy(id);
    await eventStore.close();
    expect(aggregate).to.be.not.null;
    expect(aggregate.text).to.be.equal("#TEXT");
  });

});
