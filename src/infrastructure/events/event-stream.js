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

export default class EventStream {

  constructor(props) {
    if (new.target === EventStream) {
      throw {
        message: "Can't construct abstract instances directly"
      };
    }
    this._name = new.target.name;
    if (props && "name" in props) {
      this._name = props.name;
    }
    this._position = 0;
    if (props && "position" in props) {
      this._position = props.position;
    }
    this._supportedEventTypes = new Map();
    if (props && "supportedEventTypes" in props) {
      this._supportedEventTypes = new Map(props.supportedEventTypes);
    }
    this._closed = true;
  }

  get name() {
    return this._name;
  }

  get position() {
    return this._position;
  }

  set position(value) {
    this._position = value;
  }

  get length() {
    throw {
      message: "Property 'length' is not implemented"
    };
  }

  get supportedEventTypes() {
    return this._supportedEventTypes;
  }

  get closed() {
    return this._closed;
  }

  async read() {
    throw {
      message: "Method 'read' is not implemented"
    };
  }

  async write(event) {
    throw {
      message: "Method 'read' is not implemented"
    };
  }

  async open() {
    this._closed = false;
  }

  async close() {
    this._closed = true;
  }

  toJSON() {
    return {
      name: this.name
    };
  }
}