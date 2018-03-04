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

export default class OutlineDocumentTitleChanged extends OutlineDocumentEvent {

  constructor(props) {
    super(props);
    this._outlineDocumentTitle = null;
    if (props && "outlineDocumentTitle" in props) {
      this._outlineDocumentTitle = props.outlineDocumentTitle;
    }
  }

  get outlineDocumentTitle() {
    return this._outlineDocumentTitle;
  }

  set OutlineDocumentTitleChanged(value) {
    this._outlineDocumentTitle = value;
  }

  toJSON() {
    var json = super.toJSON();
    json.outlineDocumentTitle = this._outlineDocumentTitle;
    return json;
  }

}