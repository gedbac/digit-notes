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

import crypto from "crypto";
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
  }

  async encrypt(obj) {
    if (!obj) {
      throw new Error("Object is null");
    }
    if (!this._options.privateKey) {
      throw new Error("Private key is null");
    }
    var plainText = this._objectSerializer.serialize(obj);
    var iv = getRandomValues(16);
    var privateKey = Buffer.from(this._options.privateKey, "base64");
    var chipher = crypto.createCipheriv("AES-256-CBC", privateKey, iv);
    var chippertext = chipher.update(plainText, "utf8", "base64") + chipher.final("base64");
    return {
      chippertext: chippertext,
      iv: iv.toString("base64")
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
    iv = Buffer.from(iv, "base64");
    var privateKey = Buffer.from(this._options.privateKey, "base64");
    var decipher = crypto.createDecipheriv("AES-256-CBC", privateKey, iv);
    var plainText = decipher.update(chippertext, "base64", "utf8") + decipher.final("utf8");
    return this._objectSerializer.deserialize(plainText);
  }

}