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

import Entity from "./entity";
import { timestamp } from "infrastructure-util";

export default class AggregateRoot extends Entity {

  constructor(props) {
    super(props);
    if (new.target === AggregateRoot) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._createdOn = timestamp();
    if (props && "createdOn" in props) {
      this._createdOn = props.createOn;
    }
    this._modifiedOn = null;
    if (props && "modifiedOn" in props) {
      this._modifiedOn = props.modifiedOn;
    }
    this._deleted = false;
    if (props && "deleted" in props) {
      this._deleted = props._deleted;
    }
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

  toJSON() {
    var json = super.toJSON();
    json.createOn = this.createOn;
    if (this.modifiedOn) {
      json.modifiedOn = this.modifiedOn;
    }
    if (this.deleted) {
      json.deleted = this.deleted;
    }
    return json;
  }

}