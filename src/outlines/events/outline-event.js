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

import OutlineDocumentEvent from "./outline-document-event";

export default class OutlineEvent extends OutlineDocumentEvent {

  constructor(props) {
    super(props);
    if (new.target === OutlineEvent) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._outlineId = null;
    if (props && "outlineId" in props) {
      this._outlineId = props.outlineId;
    }
  }

  get outlineId() {
    return this._outlineId;
  }

  set outlineId(value) {
    this._outlineId = value;
  }

  toJSON() {
    var json = super.toJSON();
    json.outlineId = this._outlineId;
    return json;
  }

}