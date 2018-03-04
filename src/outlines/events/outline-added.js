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

import OutlineEvent from "./outline-event";

export default class OutlineAdded extends OutlineEvent {

  constructor(props) {
    super(props);
    this._parentOutlineId = null;
    if (props && "parentOutlineId" in props) {
      this._parentOutlineId = props.parentOutlineId;
    }
    this._outlineText = null;
    if (props && "outlineText" in props) {
      this._outlineText = props.outlineText;
    }
  }

  get parentOutlineId() {
    return this._parentOutlineId;
  }

  set parentOutlineId(value) {
    this._parentOutlineId = value;
  }

  get outlineText() {
    return this._outlineText;
  }

  set outlineText(value) {
    this._outlineText = value;
  }

  toJSON() {
    var json = super.toJSON();
    json.parentOutlineId = this._parentOutlineId;
    json.outlineText = this._outlineText;
    return json;
  }

}