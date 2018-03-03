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

import Event from "./event";
import EventStream from "./event-stream";

export default class InMemoryEventStream extends EventStream {

  constructor(props) {
    super(props);
    this._events = [];
    if (props && "events" in props) {
      this._events = props.events;
    }
  }

  get length() {
    return this._events.length;
  }

  async read() {
    if (this.closed) {
      throw {
        message: "Stream is closed"
      };
    }
    var event = null;
    if (this._position >= 0 && this._position < this._events.length) {
      event = this._events[this._position++];
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
    if (!this.supportedEventTypes.has(event.name)) {
      throw {
        message: `Event '${event.name}' is not supported`
      };
    }
    if (this.closed) {
      throw {
        message: "Stream is closed"
      };
    }
    this._events.push(event);
  }

  [Symbol.iterator]() {
    return {
      next: () => ({
        value: this._events[this._position++],
        done: this._position < 0 || this._position > this._events.length
      })
    };
  }

}