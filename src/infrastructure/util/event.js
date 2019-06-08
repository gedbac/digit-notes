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

export default class Event {

  static attach(target) {
    if (!target) {
      throw new Error("Event's target is null");
    }
    target.on = Event.on.bind(target);
    target.off = Event.off.bind(target);
    target.once = Event.once.bind(target);
    target.raise = Event.raise.bind(target);
    return target;
  }

  static on(eventName, callback) {
    if (this === Event) {
      throw new Error("Event's target is not set");
    }
    if (!eventName) {
      throw new Error("Event's target is null");
    }
    if (!callback) {
      throw new Error("Callback is null");
    }
    if (typeof callback !== "function") {
      throw new Error("Callback is not function");
    }
    var events = this._events || (this._events = {});
    var callbacks = events[eventName] || (events[eventName] = []);
    callbacks.push(callback);
    return this;
  }

  static off(eventName, callback) {
    if (this === Event) {
      throw new Error("Event's target is not set");
    }
    if (!eventName) {
      this._events = {};
    } else {
      if (!callback) {
        this._events[eventName] = [];
      } else if (this._events[eventName]) {
        var index = this._events[eventName].indexOf(callback);
        if (index !== -1) {
          this._events[eventName].splice(index, 1);
        }
      }
    }
    return this;
  }

  static once(eventName, callback) {
    var func = (args) => {
      this.off(eventName, func);
      if (callback) {
        callback(args);
      }
    };
    this.on(eventName, func);
    return this;
  }

  static raise(eventName, ...args) {
    if (this === Event) {
      throw new Error("Event's target is not set");
    }
    if (!eventName) {
      throw new Error("Event's name is null");
    }
    if (this._events && this._events[eventName]) {
      this._events[eventName].forEach(callback => {
        callback(...args);
      });
    }
    return this;
  }

}