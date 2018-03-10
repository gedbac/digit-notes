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

import { Event } from "infrastructure-events";
import Entity from "./entity";

export default class EventSourcedEntity extends Entity {

  constructor(props) {
    super(props);
    if (new.target === EventSourcedEntity) {
      throw {
        message: "Can't construct abstract instances directly"
      };
    }
    this._aggregateRoot = null;
    if (props && "aggregateRoot" in props) {
      this._aggregateRoot = props.aggregateRoot;
    }
  }

  get aggregateRoot() {
    return this._aggregateRoot;
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
  }

  raise(event) {
    if (!this._aggregateRoot) {
      throw {
        message: "Aggregate root is null"
      };
    }
    this._aggregateRoot.raise(event);
  }

}