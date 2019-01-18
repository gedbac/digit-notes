/*
 *  Amber Notes
 *
 *  Copyright (C) 2016 - 2019 The Amber Notes Authors
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { Event, EventStream } from "infrastructure-events";

export default class EventStreamEncryptor extends EventStream {

  constructor(name, supportedEventTypes, stream, options) {
    super(name, supportedEventTypes);
    this._stream = stream;
    if (!this._stream) {
      throw new Error("Event stream is null");
    }
    this._options = options;
    if (!this._options) {
      throw new Error("Event stream encryptor options is null");
    }
    this._privateKey = null;
    this._textEncoder = new TextEncoder("utf-8");
    this._textDecoder = new TextDecoder("utf-8");
  }

  get stream() {
    return this._stream;
  }

  get options() {
    return this._options;
  }

  get name() {
    return this._stream.name;
  }

  get position() {
    return this._stream.position;
  }

  set position(value) {
    this._stream.position = value;
  }

  get length() {
    return this._stream.length;
  }

  get closed() {
    return this._stream.closed;
  }

  async read() {
    var event = null;
    var encryptedEvent = await this._stream.read();
    if (encryptedEvent) {
      event = await this.decrypt(encryptedEvent);
    }
    return event;
  }

  async write(event) {
    if (!event) {
      throw new Error("Event is null");
    }
    if (!(event instanceof Event)) {
      throw new Error("Type of event is invalid");
    }
    if (!event.name) {
      throw new Error("Event's name is not set");
    }
    var encryptedEvent = await this.encrypt(event);
    await this._stream.write(encryptedEvent);
  }

  async open() {
    await this._stream.open();
  }

  async close() {
    await this._stream.close();
  }

  async encrypt(event) {
    if (!event) {
      throw new Error("Event is null");
    }
    if (!this.options || !this.options.privateKey) {
      throw new Error("Private key is not set");
    }
    var props = event.toJSON();
    var propertyNames = this._getPropertyNames(event);
    if (propertyNames) {
      for (var propertyName of propertyNames) {
        var propertyValue = event[propertyName];
        if (propertyName === "nonce") {
          props[propertyName] = this._toBase64(propertyValue);
        } else if (propertyValue && typeof propertyValue === "string") {
          props[propertyName] = await this._encryptText(propertyValue, event.nonce);
        }
      }
    }
    return this._createEvent(props);
  }

  async decrypt(event) {
    if (!event) {
      throw new Error("Event is null");
    }
    if (!this.options || !this.options.privateKey) {
      throw new Error("Private key is not set");
    }
    var props = event.toJSON();
    var propertyNames = this._getPropertyNames(event);
    if (propertyNames) {
      for (var propertyName of propertyNames) {
        var propertyValue = event[propertyName];
        if (propertyName === "nonce") {
          props[propertyName] = this._fromBase64(propertyValue);
        } else if (propertyValue && typeof propertyValue === "string") {
          props[propertyName] = await this._decryptText(propertyValue, event.nonce);
        }
      }
    }
    return this._createEvent(props);
  }

  async _encryptText(text, nonce) {
    var encryptedText = null;
    if (text && typeof text === "string") {
      var algorithm = {
        name: "AES-CBC",
        iv: nonce
      };
      var privateKey = await this._getPrivateKey();
      var data = this._textEncoder.encode(text);
      var encryptedData = await crypto.subtle.encrypt(algorithm, privateKey, data);
      encryptedText = btoa(
        new Uint8Array(encryptedData)
          .reduce((result, byte) => result + String.fromCharCode(byte), "")
      );
    }
    return encryptedText;
  }

  async _decryptText(encryptedText, nonce) {
    var text = null;
    if (encryptedText && typeof encryptedText === "string") {
      var algorithm = {
        name: "AES-CBC",
        iv: nonce
      };
      var privateKey = await this._getPrivateKey();
      var encryptedData = this._fromBase64(encryptedText);
      var data = await crypto.subtle.decrypt(algorithm, privateKey, encryptedData);
      text = this._textDecoder.decode(data);
    }
    return text;
  }

  _getPropertyNames(instance) {
    var propertyNames = [];
    while (instance && instance !== Object.prototype) {
      instance = Object.getPrototypeOf(instance);
      if (instance && instance !== Object.prototype) {
        var ownPropertyNames = Object.getOwnPropertyNames(instance);
        for (var propertyName of ownPropertyNames) {
          var propertyDescriptor = Object.getOwnPropertyDescriptor(instance, propertyName);
          if (propertyDescriptor.get && propertyDescriptor.set) {
            propertyNames.push(propertyName);
          }
        }
      }
    }
    return propertyNames;
  }

  _toBase64(data) {
    return btoa(
      new Uint8Array(data)
        .reduce((base64, byte) => base64 + String.fromCharCode(byte), "")
    );
  }

  _fromBase64(base64) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  }

  _base64Tobase64Url(base64) {
    return base64
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  async _getPrivateKey() {
    if (!this._privateKey) {
      this._privateKey = await crypto.subtle.importKey(
        "jwk",
        {
          kty: "oct",
          k: this._base64Tobase64Url(this.options.privateKey),
          alg: "A256CBC",
          ext: true
        },
        {
          name: "AES-CBC"
        },
        false,
        [ "encrypt", "decrypt" ]
      );
    }
    return this._privateKey;
  }

  _createEvent(props) {
    var event = null;
    if ("name" in props) {
      if (this.supportedEventTypes.has(props.name)) {
        var eventType = this.supportedEventTypes.get(props.name);
        if (!("createFrom" in eventType)) {
          throw new Error(`Static method 'createFrom' not found in class '${eventType.name}'`);
        }
        event = eventType.createFrom(props);
      } else {
        throw new Error(`Event '${props.name}' is not supported`);
      }
    } else {
      throw new Error("Event's name is missing");
    }
    return event;
  }

}