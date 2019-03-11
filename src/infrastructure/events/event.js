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

import { uuid, timestamp } from "amber-notes/infrastructure/util";

export default class Event {

  constructor({ id = uuid(), createdOn = timestamp() } = {}) {
    if (new.target === Event) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._id = id;
    if (!this._id) {
      throw new Error("Id is null");
    }
    this._createdOn = createdOn;
    if (!this._createdOn) {
      throw new Error("Created on is null");
    }
  }

  get id() {
    return this._id;
  }

  get createdOn() {
    return this._createdOn;
  }

}