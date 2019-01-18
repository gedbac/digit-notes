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
import OutlineDocumentEvent from "./outline-document-event";

export default class OutlineDocumentTitleChanged extends OutlineDocumentEvent {

  constructor(id, name, timestamp, nonce, outlineDocumentId, outlineDocumentTitle) {
    super(id, name, timestamp, nonce, outlineDocumentId);
    this._outlineDocumentTitle = outlineDocumentTitle;
  }

  get outlineDocumentTitle() {
    return this._outlineDocumentTitle;
  }

  toJSON() {
    var json = super.toJSON();
    json.outlineDocumentTitle = this._outlineDocumentTitle;
    return json;
  }

  static createFrom({ id = uuid(), name = "OutlineDocumentTitleChanged", timestamp = getTimestamp(),
    nonce = getRandomValues(16), outlineDocumentId = null, outlineDocumentTitle = null } = {}) {
    return new OutlineDocumentTitleChanged(id, name, timestamp, nonce, outlineDocumentId, outlineDocumentTitle);
  }

}