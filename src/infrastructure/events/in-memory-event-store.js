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

import EventStore from "./event-store";
import InMemoryEventStreamFactory from "./in-memory-event-stream-factory";

export default class InMemoryEventStore extends EventStore {

  constructor() {
    super();
    this._eventStreamFactory = new InMemoryEventStreamFactory();
    this._streams = new Map();
    this._snapshots = new Map();
  }

  async hasStream(streamName) {
    if (!streamName) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    return this._streams.has(streamName);
  }

  async createStream(streamName) {
    if (!streamName) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    if (await this.hasStream(streamName)) {
      throw new Error(`Stream with name '${streamName}' already exists`);
    }
    var stream = this._eventStreamFactory.create(streamName);
    this._streams.set(streamName, stream);
    stream.open();
    return stream;
  }

  async getStream(streamName) {
    if (!streamName) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    var stream = this._streams.get(streamName);
    if (stream) {
      return stream;
    }
    return null;
  }

  async deleteStream(streamName) {
    if (!streamName) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    this._streams.delete(streamName);
  }

  async addSnapshot(streamName, snapshop) {
    if (!streamName) {
      throw new Error("Stream name is null");
    }
    if (!snapshop) {
      throw new Error("Snapshop is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    this._snapshots.set(streamName, snapshop);
  }

  async getLatestSnapshot(streamName) {
    if (!streamName) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    return this._snapshots.get(streamName);
  }

}