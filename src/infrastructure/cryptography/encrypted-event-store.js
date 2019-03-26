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

import { EventStore } from "amber-notes/infrastructure/events";
import EncryptedEventStream from "./encrypted-event-stream";
import EncryptedAggregate from "./encrypted-aggregate";

export default class EncryptedEventStore extends EventStore {

  constructor(eventStore, privateKey, encryptionService, logger) {
    super(logger);
    this._eventStore = eventStore;
    if (!this._eventStore) {
      throw new Error("Event store is null");
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

  get closed() {
    return this._eventStore.closed;
  }

  async open() {
    try {
      await this._eventStore.open();
      this.logger.logDebug("Event store has been opened");
    } catch(error) {
      this.logger.logError(`Failed to open event store\n${error}`);
      throw error;
    }
  }

  async close() {
    try {
      await this._eventStore.close();
      this.logger.logDebug("Event store has been closed");
    } catch(error) {
      this.logger.logError(`Failed to close event store\n${error}`);
      throw error;
    }
  }

  async hasStream(name) {
    var exists = false;
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      exists = await this._eventStore.hasStream(name);
      this.logger.logDebug(`Stream existance has been checked [streamName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to check if stream exists [streamName=${name}]\n${error}`);
      throw error;
    }
    return exists;
  }

  async getStream(name) {
    var stream = null;
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      stream = await this._eventStore.getStream(name);
      if (stream) {
        stream = new EncryptedEventStream(stream, this._privateKey, this._objectEncryptor);
      }
      this.logger.logDebug(`Stream has been fetched [snapshotName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to get stream [streamName=${name}]\n${error}`);
      throw error;
    }
    return stream;
  }

  async createStream(name) {
    var stream = null;
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      stream = await this._eventStore.createStream(name);
      if (stream) {
        stream = new EncryptedEventStream(stream, this._privateKey, this._encryptionService);
      }
      this.logger.logDebug(`Stream has been created [streamName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to created stream [streamName=${name}]\n${error}`);
      throw error;
    }
    return stream;
  }

  async deleteStream(name) {
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      await this._eventStore.deleteStream(name);
      this.logger.logDebug(`Stream has been deleted [streamName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to delete stream [streamName=${name}]\n${error}`);
      throw error;
    }
  }

  async addSnapshot(name, snapshot) {
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      if (!snapshot) {
        throw new Error("Snapshot is null");
      }
      var { chippertext, iv } = await this._encryptionService.encrypt(
        snapshot,
        this._privateKey
      );
      var encryptedSnapshot = new EncryptedAggregate({
        id: snapshot.id,
        createdOn: snapshot.createdOn,
        modifiedOn: snapshot.modifiedOn,
        deleted: snapshot.deleted,
        chippertext: chippertext,
        iv: iv
      });
      await this._eventStore.addSnapshot(name, encryptedSnapshot);
      this.logger.logDebug(`Snapshot has been added [snapshotName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to add snapshot [snapshotName=${name}]\n${error}`);
      throw error;
    }
  }

  async getLatestSnapshot(name) {
    var snapshot = null;
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      var props = await this._eventStore.getLatestSnapshot(name);
      if (props) {
        var enryptedSnapshot = new EncryptedAggregate(props);
        if (enryptedSnapshot) {
          snapshot = await this._encryptionService.decrypt(
            enryptedSnapshot.chippertext,
            enryptedSnapshot.iv,
            this._privateKey
          );
        }
      }
      this.logger.logDebug(`Snapshot has been fetched [snapshotName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to get snapshot [snapshotName=${name}]\n${error}`);
      throw error;
    }
    return snapshot;
  }

}