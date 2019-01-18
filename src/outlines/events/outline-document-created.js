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

export default class OutlineDocumentCreated extends OutlineDocumentEvent {

  constructor(id, name, timestamp, nonce, outlineDocumentId) {
    super(id, name, timestamp, nonce, outlineDocumentId);
  }

  static createFrom({id = uuid(), name = "OutlineDocumentCreated", timestamp = getTimestamp(),
    nonce = getRandomValues(16), outlineDocumentId = null } = {}) {
    return new OutlineDocumentCreated(id, name, timestamp, nonce, outlineDocumentId);
  }

}