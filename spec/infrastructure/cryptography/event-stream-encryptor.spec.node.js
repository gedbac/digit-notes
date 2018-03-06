import { expect } from "chai";
import { Event, InMemoryEventStream } from "amber-notes-infrastructure-events";
import { EventStreamEncryptor, EventStreamEncryptorOptions } from "amber-notes-infrastructure-cryptography";

class FooEvent extends Event {

  constructor(props) {
    super(props);
    this._text = null;
    if (props && "text" in props) {
      this._text = props.text;
    }
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

}

describe("Event Stream Encryptor", () => {

  it ("should encrypt and decrypt message", async () => {
    var supportedEventTypes = [[ "FooEvent", FooEvent ]];
    var encryptedStream = new EventStreamEncryptor({
      stream: new InMemoryEventStream({
        name: "foo",
        text: "foo",
        supportedEventTypes: supportedEventTypes
      }),
      options: new EventStreamEncryptorOptions({
        privateKey: "fwtyt/x+HBAie1oHzUZ1zLId8EdCuLnoGeS+lj4bplM="
      })
    });
    await encryptedStream.open();
    await encryptedStream.write(new FooEvent({
      text: "#text"
    }));
    var decryptedEvent = await encryptedStream.read();
    await encryptedStream.close();
    expect(decryptedEvent).to.not.be.null;
    expect(decryptedEvent.text).to.be.equal("#text");
  });

});