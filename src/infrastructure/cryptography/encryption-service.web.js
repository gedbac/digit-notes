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

import { getRandomValues } from "amber-notes/infrastructure/util";

export default class EncryptionService {

  constructor(objectSerializer, options) {
    this._objectSerializer = objectSerializer;
    if (!this._objectSerializer) {
      throw new Error("Object serializer is null");
    }
    this._options = options;
    if (!this._options) {
      throw new Error("Options is null");
    }
    this._textEncoder = new TextEncoder("utf-8");
    this._textDecoder = new TextDecoder("utf-8");
  }

  async encrypt(obj) {
    if (!obj) {
      throw new Error("Object is null");
    }
    if (!this._options.privateKey) {
      throw new Error("Private key is null");
    }
    var plainText = this._objectSerializer.serialize(obj);
    var encodedText = this._textEncoder.encode(plainText);
    var iv = getRandomValues(16);
    var algorithm = {
      name: "AES-CBC",
      iv: iv
    };
    var privateKey = await this._toCryptoKey(this._options.privateKey);
    var chippertext = await crypto.subtle.encrypt(algorithm, privateKey, encodedText);
    return {
      chippertext: this._toBase64(chippertext),
      iv: this._toBase64(iv)
    };
  }

  async decrypt(chippertext, iv) {
    if (!chippertext) {
      throw new Error("Chippertext is null");
    }
    if (!iv) {
      throw new Error("Initialization vector is null");
    }
    if (!this._options.privateKey) {
      throw new Error("Private key is null");
    }
    iv = this._fromBase64(iv);
    chippertext = this._fromBase64(chippertext);
    var privateKey = await this._toCryptoKey(this._options.privateKey);
    var algorithm = {
      name: "AES-CBC",
      iv: iv
    };
    var encodedText = await crypto.subtle.decrypt(algorithm, privateKey, chippertext);
    var plainText = this._textDecoder.decode(encodedText);
    return this._objectSerializer.deserialize(plainText);
  }

  async _toCryptoKey(privateKey) {
    return await crypto.subtle.importKey(
      "jwk",
      {
        kty: "oct",
        k: this._base64ToBase64Url(privateKey),
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

  _base64ToBase64Url(base64) {
    return base64
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
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

}