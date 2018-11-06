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

export default class OutlineDocumentEvent extends Event {

  constructor(props) {
    super(props);
    if (new.target === OutlineDocumentEvent) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._outlineDocumentId = null;
    if (props && "outlineDocumentId" in props) {
      this._outlineDocumentId = props.outlineDocumentId;
    }
  }

  get outlineDocumentId() {
    return this._outlineDocumentId;
  }

  set outlineDocumentId(value) {
    this._outlineDocumentId = value;
  }

  toJSON() {
    var json = super.toJSON();
    json.outlineDocumentId = this._outlineDocumentId;
    return json;
  }

}