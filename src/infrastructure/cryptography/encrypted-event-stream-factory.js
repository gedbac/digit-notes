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

import { EventStreamFactory } from "amber-notes/infrastructure/events";
import { EncryptedEventStream } from "amber-notes/infrastructure/cryptography";

export default class EncryptedStreamFactory extends EventStreamFactory {

  constructor(eventStreamFactory, privateKey, encryptionService) {
    super();
    this._eventStreamFactory = eventStreamFactory;
    if (!this._eventStreamFactory) {
      throw new Error("Event stream factory is null");
    }
    this._privateKey = privateKey;
    if (!this._privateKey) {
      throw new Error("Private key is null");
    }
    this._encryptionService = encryptionService;
    if (!this._encryptionService) {
      throw new Error("Encryption service is null");
    }
  }

  create(name) {
    return new EncryptedEventStream(
      this._eventStreamFactory.create(name),
      this._privateKey,
      this._encryptionService
    );
  }

}