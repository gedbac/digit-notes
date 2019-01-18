import { expect } from "chai";
import { getRandomValues } from "infrastructure-util";
import { InMemoryEventStream } from "infrastructure-events";
import { EncryptedEvent, EventStreamEncryptor, EventStreamEncryptorOptions } from "infrastructure-cryptography";

class Foo extends EncryptedEvent {

  constructor(id, name, timestamp, nonce, text) {
    super(id, name, timestamp, nonce);
    this._text = text;
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this._text = value;
  }

  toJSON() {
    var json = super.toJSON();
    if (this.text) {
      json.text = this.text;
    }
    return json;
  }

  static createFrom({ id, name, timestamp, nonce, text } = {}) {
    return new Foo(id, name, timestamp, nonce, text);
  }

}

describe("Event Stream Encryptor", () => {

  it ("should encrypt and decrypt message", async () => {
    var supportedEventTypes = [[ "Foo", Foo ]];
    var encryptedStream = new EventStreamEncryptor(
      "EncryptedStream",
      supportedEventTypes,
      new InMemoryEventStream("foo", supportedEventTypes),
      new EventStreamEncryptorOptions("fwtyt/x+HBAie1oHzUZ1zLId8EdCuLnoGeS+lj4bplM=")
    );
    await encryptedStream.open();
    await encryptedStream.write(new Foo(1, "Foo", 1001, getRandomValues(16), "#text"));
    var decryptedEvent = await encryptedStream.read();
    await encryptedStream.close();
    expect(decryptedEvent).to.not.be.null;
    expect(decryptedEvent.text).to.be.equal("#text");
  });

});