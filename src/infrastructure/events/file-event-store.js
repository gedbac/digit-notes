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

import * as path from "path";
import { fileExists, deleteFile } from "infrastructure-util";
import EventStore from "./event-store";

export default class FileEventStore extends EventStore {

  constructor(eventStreamFactory) {
    super(eventStreamFactory);
  }

  async hasStream(name) {
    if (!name) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    var pathToFile = this.getPathToStream(name);
    if (pathToFile) {
      return await fileExists(pathToFile);
    }
    return false;
  }

  async createStream(name) {
    if (!name) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    if (await this.hasStream(name)) {
      throw new Error("Stream with same name can't be created");
    }
    return this.eventStreamFactory.create(name);
  }

  async getStream(name) {
    if (!name) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    if (await this.hasStream(name)) {
      return this.eventStreamFactory.create(name);
    }
    return null;
  }

  async deleteStream(name) {
    if (!name) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    if (await this.hasStream(name)) {
      var pathToFile = this.getPathToStream(name);
      if (pathToFile) {
        await deleteFile(pathToFile);
      }
    }
  }

  getPathToStream(name) {
    if (this.eventStreamFactory.path) {
      return path.resolve(this.eventStreamFactory.path, name);
    }
    return name;
  }

}