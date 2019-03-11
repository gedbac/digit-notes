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

import Store from "./store";
import OutlinerActionTypes from "../actions/outliner-action-types";

export default class OutlinerStore extends Store {

  static get CHANGED() { return "CHANGED"; }

  constructor(dispatcher, serviceProvider) {
    super(dispatcher, serviceProvider);
    this._document = null;
  }

  get document() {
    return this._document;
  }

  _onAction(payload) {
    switch(payload.actionType) {
      case OutlinerActionTypes.LOAD_OUTLINE_DOCUMENT:
        this._onLoadOutlinesDocument(payload);
        break;
      default:
        break;
    }
  }

  _onLoadOutlinesDocument(payload) {
    this._document = {
      children: [{
        uid: "b8b6dc54-f69b-46e2-b2f0-8baca6d4bf31",
        text: "Buy milk",
        notes: "You should by some milk or you will have to drink coffee without milk"
      }, {
        uid: "bfcd62da-2407-4927-8547-9d81f1a950d5",
        text: "Buy coffee",
        notes: "Notes goes here"
      }]
    };
    this.raise(OutlinerStore.CHANGED);
  }

}