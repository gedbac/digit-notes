/*
 *  Amber Notes
 *
 *  Copyright (C) 2016 - 2018 The Amber Notes Authors
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

  constructor(props) {
    super(props);
    if (props && "stream" in props) {
      this._stream = props.stream;
    } else {
      throw {
        message: "Event stream is null"
      };
    }
    if (props && "options" in props) {
      this._options = props.options;
    } else {
      throw {
        message: "Event stream encryptor options is null"
      };
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
      throw {
        message: "Event is null"
      };
    }
    if (!(event instanceof Event)) {
      throw {
        message: "Type of event is invalid"
      };
    }
    if (!event.name) {
      throw {
        message: "Event's name is not set"
      };
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
      throw {
        message: "Event is null"
      };
    }
    if (!this.options || !this.options.privateKey) {
      throw {
        message: "Private key is not set"
      };
    }
    var nonce = crypto.getRandomValues(new Uint8Array(16));
    event.nonce = this._toBase64(nonce);
    var propertyNames = this._getPropertyNames(event);
    if (propertyNames) {
      for (var propertyName of propertyNames) {
        if (propertyName !== "nonce") {
          var propertyValue = event[propertyName];
          if (propertyValue && typeof propertyValue === "string") {
            event[propertyName] = await this._encryptText(propertyValue, nonce);
          }
        }
      }
    }
    return event;
  }

  async decrypt(event) {
    if (!event) {
      throw {
        message: "Event is null"
      };
    }
    if (!this.options || !this.options.privateKey) {
      throw {
        message: "Private key is not set"
      };
    }
    var nonce = this._fromBase64(event.nonce);
    var propertyNames = this._getPropertyNames(event);
    if (propertyNames) {
      for (var propertyName of propertyNames) {
        if (propertyName !== "nonce") {
          var propertyValue = event[propertyName];
          if (propertyValue && typeof propertyValue === "string") {
            event[propertyName] = await this._decryptText(propertyValue, nonce);
          }
        }
      }
    }
    return event;
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

}