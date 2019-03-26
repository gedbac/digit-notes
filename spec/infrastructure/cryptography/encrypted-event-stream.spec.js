import { expect } from "chai";
import { ObjectSerializer } from "amber-notes/infrastructure/util";
import { Event, InMemoryEventStream } from "amber-notes/infrastructure/events";
import { EncryptedEventStream, EncryptionService } from "amber-notes/infrastructure/cryptography";

class Foo extends Event {

  constructor({ id, timestamp, text, tags } = {}) {
    super({ id, timestamp });
    this._text = text;
    this._tags = tags;
  }

  get text() {
    return this._text;
  }

  get tags() {
    return this._tags;
  }

}

describe("Encrypted Event Stream", () => {

  it ("should encrypt and decrypt message", async () => {
    var encryptedStream = new EncryptedEventStream(
      new InMemoryEventStream("foo"),
      "fwtyt/x+HBAie1oHzUZ1zLId8EdCuLnoGeS+lj4bplM=",
      new EncryptionService(
        new ObjectSerializer([[ "Foo", Foo ]])
      )
    );
    await encryptedStream.open();
    await encryptedStream.write(new Foo({
      id: 1,
      createdOn: 1001,
      text: "#text",
      tags: [ "#tag" ]
    }));
    var decryptedEvent = await encryptedStream.read();
    await encryptedStream.close();
    expect(decryptedEvent).to.not.be.null;
    expect(decryptedEvent.text).to.be.equal("#text");
    expect(decryptedEvent.tags[0]).to.be.equal("#tag");
  });

});