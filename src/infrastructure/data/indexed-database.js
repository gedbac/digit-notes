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

export default class IndexedDatabase {

  constructor(name, version, onupgrade) {
    this._name = name;
    if (!this._name) {
      throw new Error("Name is null");
    }
    this._version = version;
    this._onupgrade = onupgrade;
    this._database = null;
    this._closed = true;
  }

  get closed() {
    return this._closed;
  }

  async open() {
    if (this._closed) {
      await new Promise((resolve, reject) => {
        var request = indexedDB.open(this._name, this._version);
        request.onerror += () => {
          reject(request.error);
        };
        request.onupgradeneeded = e => {
          if (this._onupgrade) {
            this._onupgrade(e.target.result);
          }
        };
        request.onsuccess = e => {
          this._database = e.target.result;
          resolve();
        };
      });
      this._closed = false;
    }
  }

  async close() {
    if (!this._closed) {
      if (this._database) {
        this._database.close();
      }
      this._database = null;
      this._closed = true;
    }
    await Promise.resolve(null);
  }

  async forEach(objectStoreName, indexName, keyRange, func) {
    if (!objectStoreName) {
      throw new Error("Object store name is null");
    }
    await new Promise((resolve, reject) => {
      var objectStore = this._database
        .transaction(objectStoreName, "readwrite")
        .objectStore(objectStoreName);
      var request = null;
      if (indexName) {
        request = objectStore
          .index(indexName)
          .openCursor(keyRange);
      } else {
        request = objectStore.openCursor(keyRange);
      }
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = e => {
        var cursor = e.target.result;
        if (cursor) {
          if (func) {
            func(cursor.value);
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  async add(objectStoreName, value) {
    if (this.closed) {
      throw new Error("Database is closed");
    }
    if (!objectStoreName) {
      throw new Error("Object store name is null");
    }
    if (!value) {
      throw new Error("Object is null");
    }
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

  async exists(objectStoreName, indexName, key) {
    if (this.closed) {
      throw new Error("Database is closed");
    }
    if (!objectStoreName) {
      throw new Error("Object store name is null");
    }
    if (!key) {
      throw new Error("Key is null");
    }
    await new Promise((resolve, reject) => {
      var objectStore = this._database
        .transaction(objectStoreName, "readwrite")
        .objectStore(objectStoreName);
      var request = null;
      if (indexName) {
        request = objectStore
          .index(indexName)
          .getKey(key);
      } else {
        request = objectStore.getKey(key);
      }
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = e => {
        resolve(!!e.result);
      };
    });
  }

  async get(objectStoreName, indexName, key) {
    if (this.closed) {
      throw new Error("Database is closed");
    }
    if (!objectStoreName) {
      throw new Error("Object store name is null");
    }
    if (!key) {
      throw new Error("Key is null");
    }
    await new Promise((resolve, reject) => {
      var objectStore = this._database
        .transaction(objectStoreName, "readwrite")
        .objectStore(objectStoreName);
      var request = null;
      if (indexName) {
        request = objectStore
          .index(indexName)
          .getKey(key);
      } else {
        request = objectStore.getKey(key);
      }
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = e => {
        resolve(e.result);
      };
    });
  }

  static async deleteDatabase(databaseName) {
    if (!databaseName) {
      throw new Error("Database name is null");
    }
    await new Promise((resolve, reject) => {
      var request = indexedDB.deleteDatabase(databaseName);
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve();
      };
    });
  }

}