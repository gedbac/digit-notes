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

import AggregateRoot from "./aggregate-root";
import { Event } from "amber-notes/infrastructure/events";

export default class EventSourcedAggregate extends AggregateRoot {

  constructor({ id, createdOn, modifiedOn, deleted, version = 0 } = {}) {
    super({ id, createdOn, modifiedOn, deleted });
    if (new.target === EventSourcedAggregate) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._version = version;
    this._uncommittedEvents = [];
  }

  get version() {
    return this._version;
  }

  get uncommittedEvents() {
    return this._uncommittedEvents.slice();
  }

  apply(event) {
    if (!event) {
      throw new Error("Event is null");
    }
    if (!(event instanceof Event)) {
      throw new Error("Type of event is invalid");
    }
    var eventName = event.constructor.name;
    var eventHandlerName = `_on${eventName}`;
    if (eventHandlerName in this) {
      this[eventHandlerName](event);
    } else {
      throw new Error(`Method '${eventHandlerName}' not found in class '${this.constructor.name}'`);
    }
    this._version++;
    this._modifiedOn = event.timestamp;
  }

  raise(event) {
    if (!event) {
      throw new Error("Event is null");
    }
    if (!(event instanceof Event)) {
      throw new Error("Type of event is invalid");
    }
    this._uncommittedEvents.push(event);
    this.apply(event);
  }

  commit() {
    this._uncommittedEvents = [];
  }

}