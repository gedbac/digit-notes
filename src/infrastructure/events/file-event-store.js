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
import { directoryExists, createDirectory, fileExists, readFile, writeFile, deleteFile } from "infrastructure-util";
import EventStore from "./event-store";
import FileEventStreamFactory from "./file-event-stream-factory";

export default class FileEventStore extends EventStore {

  constructor(supportedEventTypes, path) {
    super();
    this._path = path;
    this._eventStreamFactory = new FileEventStreamFactory(supportedEventTypes, this._getPathToStreams());
  }

  get path() {
    return this._path;
  }

  async hasStream(streamName) {
    if (!streamName) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    var pathToFile = this._getPathToStream(streamName);
    if (pathToFile) {
      return await fileExists(pathToFile);
    }
    return false;
  }

  async createStream(streamName) {
    if (!streamName) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    if (await this.hasStream(streamName)) {
      throw new Error("Stream with same name can't be created");
    }
    return this._eventStreamFactory.create(streamName);
  }

  async getStream(streamName) {
    if (!streamName) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    if (await this.hasStream(streamName)) {
      return this._eventStreamFactory.create(streamName);
    }
    return null;
  }

  async deleteStream(streamName) {
    if (!streamName) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    if (await this.hasStream(streamName)) {
      var pathToFile = this._getPathToStream(streamName);
      if (pathToFile) {
        await deleteFile(pathToFile);
      }
    }
  }

  async addSnapshot(streamName, snapshop) {
    if (!streamName) {
      throw new Error("Stream name is null");
    }
    if (!snapshop) {
      throw new Error("Snapshop is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    var pathToFile = this._getPathToSnapshot(streamName);
    var pathToDirectory = path.dirname(pathToFile);
    if (!await directoryExists(pathToDirectory)) {
      await createDirectory(pathToDirectory);
    }
    var content = JSON.stringify(snapshop);
    await writeFile(pathToFile, { flag: "w" , encoding: "utf8" }, content);
  }

  async getLatestSnapshot(streamName) {
    if (!streamName) {
      throw new Error("Stream name is null");
    }
    if (this.closed) {
      throw new Error("Event store is closed");
    }
    var snapshop = null;
    var pathToFile = this._getPathToSnapshot(streamName);
    if (await fileExists(pathToFile)) {
      var content = await readFile(pathToFile, { flag: "r", encoding: "utf8" });
      if (content) {
        snapshop = JSON.parse(content);
      }
    }
    return snapshop;
  }

  _getPathToStreams() {
    if (this.path) {
      return path.resolve(this.path, "./streams");
    }
    return "./streams";
  }

  _getPathToStream(streamName) {
    if (this.path) {
      return path.resolve(this.path, "./streams", streamName);
    }
    return path.resolve("./streams", streamName);
  }

  _getPathToSnapshot(streamName) {
    if (this.path) {
      return path.resolve(this.path, "./snapshots", streamName);
    }
    return path.resolve("./snapshots", streamName);
  }

}