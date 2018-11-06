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

import InMemoryEventStream from "./in-memory-event-stream";
import EventStore from "./event-store";

export default class InMemoryEventStore extends EventStore {

  constructor(props) {
    super(props);
    this._streams = new Map();
    if (props && "streams" in props) {
      this._streams = new Map(props.streams);
    }
  }

  async hasStream(name) {
    if (!name) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    return this._streams.has(name);
  }

  async createStream(name) {
    if (!name) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    if (await this.hasStream(name)) {
      throw new Error(`Stream with name '${name}' already exists`);
    }
    var stream = new InMemoryEventStream({
      name: name,
      supportedEventTypes: this.supportedEventTypes
    });
    this._streams.set(name, stream);
    stream.open();
    return stream;
  }

  async getStream(name) {
    if (!name) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    var stream = this._streams.get(name);
    if (stream) {
      return stream;
    }
    return null;
  }

  async deleteStream(name) {
    if (!name) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    this._streams.delete(name);
  }

}