/*
 *  Digit Notes
 *
 *  Copyright (C) 2016 - 2019 The Digit Notes Authors
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

import { uuid, timestamp } from "d8s/infrastructure/util";
import Entity from "./entity";

export default class AggregateRoot extends Entity {

  constructor({ id = uuid(), createdOn = timestamp(), modifiedOn = null, deleted = false } = {}) {
    super({ id });
    if (new.target === AggregateRoot) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._createdOn = createdOn;
    this._modifiedOn = modifiedOn;
    this._deleted = deleted;
  }

  get createdOn() {
    return this._createdOn;
  }

  get modifiedOn() {
    return this._modifiedOn;
  }

  get deleted() {
    return this._deleted;
  }

}