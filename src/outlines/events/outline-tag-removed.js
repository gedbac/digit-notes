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

import OutlineEvent from "./outline-event";

export default class OutlineTagRemoved extends OutlineEvent {

  constructor({ id, createdOn, outlineDocumentId, outlineId, outlineTag } = {}) {
    super({ id, createdOn, outlineDocumentId, outlineId });
    this._outlineTag = outlineTag;
    if (!this._outlineTag) {
      throw new Error("Outline tag is null");
    }
  }

  get outlineTag() {
    return this._outlineTag;
  }

}