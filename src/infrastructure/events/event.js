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

export default class Event {

  constructor(id, name, timestamp) {
    if (new.target === Event) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._id = id;
    if (!this._id) {
      throw new Error("Id is null");
    }
    this._name = name;
    if (!this._name) {
      throw new Error("Name is null");
    }
    this._timestamp = timestamp;
    if (!this._timestamp) {
      throw new Error("Timestamp is null");
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

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      timestamp: this.timestamp
    };
  }

}