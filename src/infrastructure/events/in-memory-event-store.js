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

import EventStore from "./event-store";
import InMemoryEventStreamFactory from "./in-memory-event-stream-factory";

export default class InMemoryEventStore extends EventStore {

  constructor(logger) {
    super(logger);
    this._eventStreamFactory = new InMemoryEventStreamFactory();
    this._streams = new Map();
    this._snapshots = new Map();
  }

  async hasStream(name) {
    var exists = false;
    try {
      if (!name) {
        throw new Error("Stream's name is null");
      }
      if (this.closed) {
        throw new Error("Event store is closed");
      }
      exists = this._streams.has(name);
      this.logger.logDebug(`Stream existance has been checked [streamName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to check if stream exists [streamName=${name}]\n${error}`);
      throw error;
    }
    return exists;
  }

  async createStream(name) {
    var stream = null;
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      if (this.closed) {
        throw new Error("Event store is closed");
      }
      if (await this.hasStream(name)) {
        throw new Error(`Stream with name '${name}' already exists`);
      }
      stream = this._eventStreamFactory.create(name);
      this._streams.set(name, stream);
      this.logger.logDebug(`Stream has been created [streamName=${name}]`);
    } catch (error) {
      this.logger.logError(`Failed to created stream [streamName=${name}]\n${error}`);
      throw error;
    }
    return stream;
  }

  async getStream(name) {
    var stream = null;
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      if (this.closed) {
        throw new Error("Event store is closed");
      }
      stream = this._streams.get(name) || null;
      this.logger.logDebug(`Stream has been fetched [snapshotName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to get stream [streamName=${name}]\n${error}`);
      throw error;
    }
    return stream;
  }

  async deleteStream(name) {
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      if (this.closed) {
        throw new Error("Event store is closed");
      }
      this._streams.delete(name);
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
      if (this.closed) {
        throw new Error("Event store is closed");
      }
      this._snapshots.set(name, snapshot);
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
      if (this.closed) {
        throw new Error("Event store is closed");
      }
      snapshot = this._snapshots.get(name);
      this.logger.logDebug(`Snapshot has been fetched [snapshotName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to get snapshot [snapshotName=${name}]\n${error}`);
      throw error;
    }
    return snapshot;
  }

}