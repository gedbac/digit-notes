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

import { timestamp, uuid } from "infrastructure-util";

export default class Event {

  constructor(props) {
    if (new.target === Event) {
      throw {
        message: "Can't construct abstract instances directly"
      };
    }
    this._id = uuid();
    if (props && "id" in props) {
      this._id = props.id;
    }
    this._name = new.target.name;
    if (props && "name" in props) {
      this._name = props.name;
    }
    this._timestamp = timestamp();
    if (props && "timestamp" in props) {
      this._timestamp = props.timestamp;
    }
    this._nonce = null;
    if (props && "nonce" in props) {
      this._nonce = props.nonce;
    }
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get timestamp() {
    return this._timestamp;
  }

  get nonce() {
    return this._nonce;
  }

  set nonce(value) {
    this._nonce = value;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      timestamp: this.timestamp,
      nonce: this._nonce
    };
  }

}