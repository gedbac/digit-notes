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

import crypto from "crypto";
import { Event, EventStream } from "amber-notes-infrastructure-events";

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

  async open() {

    await this._stream.open();
  }

  async close() {
    await this._stream.close();
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
    var nonce = crypto.randomBytes(16);
    event.nonce = nonce.toString("base64");
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
    var nonce = Buffer.from(event.nonce, "base64");
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
      var privateKey = this._getPrivateKey();
      var chipher = crypto.createCipheriv("AES-256-CBC", privateKey, nonce);
      encryptedText = chipher.update(text, "utf8", "base64") + chipher.final("base64");
    }
    return encryptedText;
  }

  async _decryptText(encryptedText, nonce) {
    if (!this.options || !this.options.privateKey) {
      throw {
        message: "Private key is not set"
      };
    }
    var text = null;
    if (encryptedText && typeof encryptedText === "string") {
      var privateKey = this._getPrivateKey();
      var decipher = crypto.createDecipheriv("AES-256-CBC", privateKey, nonce);
      text = decipher.update(encryptedText, "base64", "utf8") + decipher.final("utf8");
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

  _getPrivateKey() {
    if (!this._privateKey) {
      this._privateKey = Buffer.from(this.options.privateKey, "base64");
    }
    return this._privateKey;
  }

}