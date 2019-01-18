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

import { uuid } from "infrastructure-util";

export default class Dispatcher {

  constructor(logger) {
    this._callbacks = new Map();
    this._dispatching = false;
    this._pending = new Map();
    this._handled = new Map();
    this._payload = null;
    this._logger = logger;
    if (!this._logger) {
      throw new Error("Logger is null");
    }
  }

  get logger() {
    return this._logger;
  }

  register(callback) {
    var dispatcherToken = null;
    if (callback) {
      dispatcherToken = uuid();
      this._callbacks.set(dispatcherToken, callback);
    }
    return dispatcherToken;
  }

  unregister(dispatcherToken) {
    if (dispatcherToken) {
      this._callbacks.delete(dispatcherToken);
    }
  }

  dispatch(payload) {
    try  {
      if (this.isDispatching()) {
        throw new Error("Cannot dispatch in the middle of a dispatch");
      }
      try {
        this._dispatching = true;
        this._payload = payload;
        this._pending.clear();
        this._handled.clear();
        for (var dispatcherToken of this._callbacks.keys()) {
          if (this._pending.has(dispatcherToken)) {
            continue;
          }
          this._invokeCallback(dispatcherToken);
        }
      } finally {
        this._payload = null;
        this._dispatching = false;
      }
    } catch (error) {
      this.logger.logError(`An error occured while dispatching.\n${error}`);
    }
  }

  waitFor(dispatcherTokens) {
    try {
      if (!this.isDispatching()) {
        throw new Error("Method 'waitFor' must be invoked while dispatching");
      }
      if (dispatcherTokens) {
        for (var i = 0; i < dispatcherTokens.length; i++) {
          var dispatcherToken = dispatcherTokens[i];
          if (this._pending.has(dispatcherToken)) {
            if (this._handled.has(dispatcherToken)) {
              throw new Error(`Circular dependency detected while waiting for '${dispatcherToken}'`);
            }
          }
          this._invokeCallback(dispatcherToken, payload);
        }
      }
    } catch (error) {
      this.logger.logError(`An error occured while waiting.\n${error}`);
    }
  }

  isDispatching() {
    return this._dispatching;
  }

  _invokeCallback(dispatcherToken) {
    this._pending.set(dispatcherToken, true);
    this._callbacks.get(dispatcherToken)(this._payload);
    this._handled.set(dispatcherToken, true);
  }

}