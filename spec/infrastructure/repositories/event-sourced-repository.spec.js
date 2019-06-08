import { expect } from "chai";
import { Logger } from "d8s/infrastructure/logging";
import { EventSourcedAggregate } from "d8s/infrastructure/model";
import { EventSourcedRepository } from "d8s/infrastructure/repositories";
import { Event, InMemoryEventStore } from "d8s/infrastructure/events";

class FooCreated extends Event {

  constructor({ id, createdOn } = {}) {
    super({ id, createdOn });
  }

}

class FooTextChanged extends Event {

  constructor({ id, createdOn, text = null } = {}) {
    super({ id, createdOn });
    this._text = text;
  }

  get text() {
    return this._text;
  }

}

class Foo extends EventSourcedAggregate {

  constructor({ id, createdOn, modifiedOn, deleted, version, uncommittedEvents, text = null } = {}) {
    super({ id, createdOn, modifiedOn, deleted, version, uncommittedEvents });
    this._text = text;
  }

  get text() {
    return this._text;
  }

  _onFooTextChanged(event) {
    this._text = event.text;
  }

}

class FooRepository extends EventSourcedRepository {

  constructor(eventStore, aggregateType, logger) {
    super(eventStore, aggregateType, logger);
  }

}

describe("Event Sourced Repository", () => {

  it("should get document from snapshot", async () => {
    var id = "9cb9f65c-2904-4180-8e38-dde3c14a5fd1";
    var eventStore = new InMemoryEventStore(
      new Logger("InMemoryEventStore")
    );
    await eventStore.open();
    var stream = await eventStore.createStream(`Foo::${id}`);
    await stream.open();
    await stream.write(new FooCreated({ createdOn: 1000 }));
    await stream.write(new FooTextChanged({ text: "#TEXT" }));
    await stream.close();
    var snapshot = new Foo({
      id: id,
      createdOn: 1000,
      version: 1
    });
    await eventStore.addSnapshot(`Foo::${id}`, snapshot);
    var repository = new FooRepository(
      eventStore,
      Foo,
      new Logger("FooRepository")
    );
    var aggregate = await repository.findBy(id);
    await eventStore.close();
    expect(aggregate).to.be.not.null;
    expect(aggregate.text).to.be.equal("#TEXT");
  });

});
