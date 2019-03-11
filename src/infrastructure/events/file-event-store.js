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
import { directoryExists, createDirectory, fileExists, readFile, writeFile, deleteFile } from "amber-notes/infrastructure/util";
import EventStore from "./event-store";
import FileEventStreamFactory from "./file-event-stream-factory";

export default class FileEventStore extends EventStore {

  constructor(rootPath, objectSerializer, logger) {
    super(logger);
    this._rootPath = rootPath;
    this._objectSerializer = objectSerializer;
    if (!this._objectSerializer) {
      throw new Error("Object serialize is null");
    }
    this._eventStreamFactory = new FileEventStreamFactory(objectSerializer, this._getPathToStreams());
  }

  get rootPath() {
    return this._rootPath;
  }

  async hasStream(name) {
    var exists = false;
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      if (this.closed) {
        throw new Error("Event store is closed");
      }
      var pathToFile = this._getPathToStream(name);
      if (pathToFile) {
        exists = await fileExists(pathToFile);
      }
      this.logger.logDebug(`Stream existance has been checked [streamName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to check if stream exists [streamName=${name}]\n${error}`);
      throw error;
    }
    return exists;
  }

  async createStream(name) {
    var stream = null;
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      if (this.closed) {
        throw new Error("Event store is closed");
      }
      if (await this.hasStream(name)) {
        throw new Error("Stream with same name can't be created");
      }
      stream = this._eventStreamFactory.create(name);
      this.logger.logDebug(`Stream has been created [streamName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to created stream [streamName=${name}]\n${error}`);
      throw error;
    }
    return stream;
  }

  async getStream(name) {
    var stream = null;
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      if (this.closed) {
        throw new Error("Event store is closed");
      }
      if (await this.hasStream(name)) {
        stream = this._eventStreamFactory.create(name);
      }
      this.logger.logDebug(`Stream has been fetched [snapshotName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to get stream [streamName=${name}]\n${error}`);
      throw error;
    }
    return stream;
  }

  async deleteStream(name) {
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      if (this.closed) {
        throw new Error("Event store is closed");
      }
      if (await this.hasStream(name)) {
        var pathToFile = this._getPathToStream(name);
        if (pathToFile) {
          await deleteFile(pathToFile);
        }
      }
      this.logger.logDebug(`Stream has been deleted [streamName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to delete stream [streamName=${name}]\n${error}`);
      throw error;
    }
  }

  async addSnapshot(name, snapshot) {
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      if (!snapshot) {
        throw new Error("Snapshot is null");
      }
      if (this.closed) {
        throw new Error("Event store is closed");
      }
      var pathToFile = this._getPathToSnapshot(name);
      var pathToDirectory = path.dirname(pathToFile);
      if (!await directoryExists(pathToDirectory)) {
        await createDirectory(pathToDirectory);
      }
      var content = this._objectSerializer.serialize(snapshot);
      await writeFile(pathToFile, { flag: "w" , encoding: "utf8" }, content);
      this.logger.logDebug(`Snapshot has been added [snapshotName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to add snapshot [snapshotName=${name}]\n${error}`);
      throw error;
    }
  }

  async getLatestSnapshot(name) {
    var snapshot = null;
    try {
      if (!name) {
        throw new Error("Stream name is null");
      }
      if (this.closed) {
        throw new Error("Event store is closed");
      }
      var pathToFile = this._getPathToSnapshot(name);
      if (await fileExists(pathToFile)) {
        var content = await readFile(pathToFile, { flag: "r", encoding: "utf8" });
        if (content) {
          snapshot = this._objectSerializer.deserialize(content);
        }
      }
      this.logger.logDebug(`Snapshot has been fetched [snapshotName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to get snapshot [snapshotName=${name}]\n${error}`);
      throw error;
    }
    return snapshot;
  }

  _getPathToStreams() {
    if (this.rootPath) {
      return path.resolve(this.rootPath, "./streams");
    }
    return "./streams";
  }

  _getPathToStream(name) {
    if (this.rootPath) {
      return path.resolve(this.rootPath, "./streams", name);
    }
    return path.resolve("./streams", name);
  }

  _getPathToSnapshot(name) {
    if (this.rootPath) {
      return path.resolve(this.rootPath, "./snapshots", name);
    }
    return path.resolve("./snapshots", name);
  }

}