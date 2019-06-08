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

import { IndexedDatabase } from "d8s/infrastructure/data";

export default class WebEventDatabase extends IndexedDatabase {

  constructor(databaseName) {
    super(databaseName, 1, db => {
      if (db.version === 1) {
        if (!db.objectStoreNames.contains("event-streams")) {
          db.createObjectStore("event-streams", {
            keyPath: "name"
          });
        }
        if (!db.objectStoreNames.contains("events")) {
          db
            .createObjectStore("events", {
              keyPath: "id"
            })
            .createIndex("streamName", "streamName", {
              unique: false
            });
        }
        if (!db.objectStoreNames.contains("snapshots")) {
          db
            .createObjectStore("snapshots", {
              keyPath: "id"
            })
            .createIndex("streamName", "streamName", {
              unique: false
            });
        }
      }
    });
  }

}