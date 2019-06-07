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

export default class EventStream {

  constructor(name) {
    if (new.target === EventStream) {
      throw new Error("Can't construct abstract instances directly");
    }
    if (name) {
      this._name = name;
    } else {
      this._name = new.target.name;
    }
    this._position = 0;
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
    throw new Error("Property 'length' is not implemented");
  }

  get closed() {
    return this._closed;
  }

  async read() {
    throw new Error("Method 'read' is not implemented");
  }

  async write(event) {
    throw new Error("Method 'read' is not implemented");
  }

  async open() {
    this._closed = false;
  }

  async close() {
    this._closed = true;
  }

}