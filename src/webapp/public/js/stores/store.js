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

import { Event } from "d8s/infrastructure/util";

export default class Store {

  constructor(dispatcher, serviceProvider) {
    Event.attach(this);
    this._dispatcher = dispatcher;
    this._serviceProvider = serviceProvider;
    if (!this._dispatcher) {
      throw new Error("Dispatcher is null");
    }
    if (!this._serviceProvider) {
      throw new Error("Service provider is null");
    }
    this._dispatchToken = this.dispatcher.register(payload => this._onAction(payload));
  }

  get dispatcher() {
    return this._dispatcher;
  }

  get serviceProvider() {
    return this._serviceProvider;
  }

  get dispatchToken() {
    return this._dispatchToken;
  }

  _onAction(payload) {}

}