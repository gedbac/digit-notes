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

import AggregateRoot from "./aggregate-root";
import { Event } from "infrastructure-events";

export default class EventSourcedAggregate extends AggregateRoot {

  constructor(props) {
    super(props);
    if (new.target === EventSourcedAggregate) {
      throw {
        message: "Can't construct abstract instances directly"
      };
    }
    this._version = 0;
    if (props && "verion" in props) {
      this._version = props.version;
    }
    this._uncommittedEvents = [];
    if (props && "uncommittedEvents" in props) {
      this._uncommittedEvents = props.uncommittedEvents;
    }
  }

  get version() {
    return this._version;
  }

  get uncommittedEvents() {
    return this._uncommittedEvents.slice();
  }

  apply(event) {
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
    var eventHandlerName = `_on${event.name}`;
    if (eventHandlerName in this) {
      this[eventHandlerName](event);
    } else {
      throw {
        message: `Method '${eventHandlerName}' not found in class '${this.constructor.name}'`
      };
    }
    this._version++;
    this._modifiedOn = event.timestamp;
  }

  raise(event) {
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
    this._uncommittedEvents.push(event);
    this.apply(event);
  }

  commit() {
    this._uncommittedEvents = [];
  }

  toJSON() {
    var json = super.toJSON();
    json.version = this.version;
    json.uncommittedEvents = this.uncommittedEvents.map(x => x.toJSON());
    return json;
  }

}