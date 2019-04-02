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

import Event from "./event";
import EventStream from "./event-stream";

export default class WebEventStream extends EventStream {

  constructor(name, objectSerializer) {
    super(name);
    this._objectSerializer = objectSerializer;
    if (!this._objectSerializer) {
      throw new Error("Object serializer is null");
    }
    this._database = null;
    this._events = [];
  }

  get length() {
    return this._events.length;
  }

  async open() {
    if (this.closed) {
      await this._openDB("event-store", 1, database => {
        if (database.version === 1) {
          if (!database.objectStoreNames.contains("events")) {
            var objectStore = database.createObjectStore("events", { autoIncrement : true });
            objectStore.createIndex("streamName", "streamName", { unique: false });
          }
        }
      });
      await this._forEach("events", value => {
        if (value.data) {
          this._events.push(this._objectSerializer.deserialize(value.data));
        }
      });
      await super.open();
    }
  }

  async close() {
    if (!this.closed) {
      await this._closeDB();
      await super.close();
    }
  }

  async read() {
    if (this.closed) {
      throw new Error("Stream is closed");
    }
    var event = null;
    if (this._position >= 0 && this._position < this._events.length) {
      event = this._events[this._position++];
    }
    return event;
  }

  async write(event) {
    if (!event) {
      throw new Error("Event is null");
    }
    if (!(event instanceof Event)) {
      throw new Error("Event type is invalid");
    }
    if (this.closed) {
      throw new Error("Stream is closed");
    }
    this._events.push(event);
    await this._add("events", {
      streamName: this.name,
      data: this._objectSerializer.serialize(event)
    });
  }

  async _openDB(name, version, onupgrade) {
    await new Promise((resolve, reject) => {
      var request = indexedDB.open(name, version);
      request.onerror += () => {
        reject(request.error);
      };
      request.onupgradeneeded = e => {
        if (onupgrade) {
          onupgrade(e.target.result);
        }
      };
      request.onsuccess = e => {
        this._database = e.target.result;
        resolve();
      };
    });
  }

  async _closeDB() {
    if (this._database) {
      this._database.close();
    }
    this._database = null;
    return Promise.resolve(null);
  }

  async _forEach(objectStoreName, callback) {
    return await new Promise((resolve, reject) => {
      var objectStore = this._database
        .transaction(objectStoreName, "readwrite")
        .objectStore(objectStoreName);
      var index = objectStore.index("streamName");
      var request = index.openCursor(IDBKeyRange.only(this.name));
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = e => {
        var cursor = e.target.result;
        if (cursor) {
          if (callback) {
            callback(cursor.value);
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  async _add(objectStoreName, value) {
    await new Promise((resolve, reject) => {
      var objectStore = this._database
        .transaction(objectStoreName, "readwrite")
        .objectStore(objectStoreName);
      var request = objectStore.add(value);
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve();
      };
    });
  }

}