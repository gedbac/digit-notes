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

import { Event } from "infrastructure-events";
import Entity from "./entity";

export default class EventSourcedEntity extends Entity {

  constructor(id, aggregateRoot) {
    super(id);
    if (new.target === EventSourcedEntity) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._aggregateRoot = aggregateRoot;
    if (!this._aggregateRoot) {
      throw new Error("Aggregate root is null");
    }
  }

  get aggregateRoot() {
    return this._aggregateRoot;
  }

  apply(event) {
    if (!event) {
      throw new Error("Event is null");
    }
    if (!(event instanceof Event)) {
      throw new Error("Type of event is invalid");
    }
    var eventHandlerName = `_on${event.name}`;
    if (eventHandlerName in this) {
      this[eventHandlerName](event);
    } else {
      throw new Error(`Method '${eventHandlerName}' not found in class '${this.constructor.name}'`);
    }
  }

  raise(event) {
    if (!this._aggregateRoot) {
      throw new Error("Aggregate root is null");
    }
    this._aggregateRoot.raise(event);
  }

}