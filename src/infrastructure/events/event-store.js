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

import EventStream from "./event-stream";

export default class EventStore {

  constructor(props) {
    if (new.target === EventStream) {
      throw {
        message: "Can't construct abstract instances directly"
      };
    }
    this._supportedEventTypes = new Map();
    if (props && "supportedEventTypes" in props) {
      this._supportedEventTypes = props.supportedEventTypes;
    }
    this._closed = true;
  }

  get supportedEventTypes() {
    return this._supportedEventTypes;
  }

  get closed() {
    return this._closed;
  }

  async open() {
    this._closed = false;
  }

  async close() {
    this._closed = true;
  }

  async hasStream(name) {
    throw {
      message: "Method 'hasStream' is not implemented"
    };
  }

  async getStream(name) {
    throw {
      message: "Method 'getStream' is not implemented"
    };
  }

  async createStream(name) {
    throw {
      message: "Method 'createStream' is not implemented"
    };
  }

  async deleteStream(name) {
    throw {
      message: "Method 'deleteStream' is not implemented"
    };
  }

}