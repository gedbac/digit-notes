/*
 *  Digit Notes
 *
 *  Copyright (C) 2016 - 2019 The Digit Notes Authors
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

import { Event } from "d8s/infrastructure/events";

export default class EncryptedEvent extends Event {

  constructor({ id, createdOn, chippertext, iv } = {}) {
    super(id, createdOn);
    this._chippertext = chippertext;
    if (!this._chippertext) {
      throw new Error("Ciphertext is null");
    }
    this._iv = iv;
    if (!this._iv) {
      throw new Error("Initialization vector is null");
    }
  }

  get chippertext() {
    return this._chippertext;
  }

  get iv() {
    return this._iv;
  }

}