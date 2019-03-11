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

import { Event } from "amber-notes/infrastructure/events";

export default class OutlineEvent extends Event {

  constructor({ id, createdOn, outlineDocumentId, outlineId } = {}) {
    super({ id, createdOn });
    if (new.target === OutlineEvent) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._outlineDocumentId = outlineDocumentId;
    if (!this._outlineDocumentId) {
      throw new Error("Outline document id is null");
    }
    this._outlineId = outlineId;
    if (!this._outlineId) {
      throw new Error("Outline id is null");
    }
  }

  get outlineDocumentId() {
    return this._outlineDocumentId;
  }

  get outlineId() {
    return this._outlineId;
  }

}