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

import { uuid, getTimestamp, getRandomValues } from "infrastructure-util";
import OutlineEvent from "./outline-event";

export default class OutlineAdded extends OutlineEvent {

  constructor(id, name, timestamp, nonce, outlineDocumentId, outlineId, parentOutlineId, outlineText) {
    super(id, name, timestamp, nonce, outlineDocumentId, outlineId);
    this._parentOutlineId = parentOutlineId;
    this._outlineText = outlineText;
  }

  get parentOutlineId() {
    return this._parentOutlineId;
  }

  get outlineText() {
    return this._outlineText;
  }

  toJSON() {
    var json = super.toJSON();
    json.parentOutlineId = this._parentOutlineId;
    json.outlineText = this._outlineText;
    return json;
  }

  static createFrom({ id = uuid(), name = "OutlineAdded", timestamp = getTimestamp(), nonce = getRandomValues(16),
    outlineDocumentId = null, outlineId = null, parentOutlineId = null, outlineText = null } = {}) {
    return new OutlineAdded(id, name, timestamp, nonce, outlineDocumentId, outlineId, parentOutlineId, outlineText);
  }

}