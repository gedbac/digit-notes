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

import Event from "./event";
import EventStream from "./event-stream";
import WebEventDatabase from "./web-event-database";

export default class WebEventStream extends EventStream {

  constructor(name, databaseName, objectSerializer) {
    super(name);
    this._objectSerializer = objectSerializer;
    if (!this._objectSerializer) {
      throw new Error("Object serializer is null");
    }
    this._database = new WebEventDatabase(databaseName);
    this._events = [];
  }

  get length() {
    return this._events.length;
  }

  async open() {
    if (this.closed) {
      await this._database.open();
      await this._database.forEach("events", "streamName", IDBKeyRange.only(this.name), value => {
        if (value.data) {
          this._events.push(this._objectSerializer.deserialize(value.data));
        }
      });
      await super.open();
    }
  }

  async close() {
    if (!this.closed) {
      await this._database.close();
      await super.close();
    }
  }

  async read() {
    if (this.closed) {
      throw new Error("Stream is closed");
    }
    var event = null;
    if (this._position >= 0 && this._position < this._events.length) {
      event = this._events[this._position++];
    }
    return event;
  }

  async write(event) {
    if (!event) {
      throw new Error("Event is null");
    }
    if (!(event instanceof Event)) {
      throw new Error("Event type is invalid");
    }
    if (this.closed) {
      throw new Error("Stream is closed");
    }
    this._events.push(event);
    await this._database.add("events", {
      id: event.id,
      streamName: this.name,
      data: this._objectSerializer.serialize(event)
    });
  }

}