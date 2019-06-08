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

import * as os from "os";
import * as path from "path";
import { directoryExists, createDirectory, fileExists, readFile, writeFile, appendFile } from "d8s/infrastructure/util";
import Event from "./event";
import EventStream from "./event-stream";

export default class FileEventStream extends EventStream {

  constructor(name, objectSerializer, path) {
    super(name);
    this._objectSerializer = objectSerializer;
    if (!this._objectSerializer) {
      throw new Error("Object serializer is null");
    }
    this._path = path;
    this._events = [];
  }

  get length() {
    return this._events.length;
  }

  get path() {
    return this._path;
  }

  async open() {
    if (this.closed) {
      var pathToFile = this._getPathToStream();
      if (await fileExists(pathToFile)) {
        var content = await readFile(pathToFile, { flag: "r", encoding: "utf8" });
        if (content) {
          var lines = content.split(/\r?\n/);
          if (lines) {
            for(var line of lines) {
              this._events.push(this._objectSerializer.deserialize(line));
            }
          }
        }
      } else {
        var pathToDirectory = path.dirname(pathToFile);
        if (!await directoryExists(pathToDirectory)) {
          await createDirectory(pathToDirectory);
        }
        await writeFile(pathToFile, { flag: "w" , encoding: "utf8" }, "");
      }
      await super.open();
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
    var pathToFile = this._getPathToStream();
    var content = "";
    if (this._events.length > 1) {
      content += os.EOL;
    }
    content += this._objectSerializer.serialize(event);
    await appendFile(pathToFile, { encoding: "utf8" }, content);
  }

  _getPathToStream() {
    if (this.path) {
      return path.resolve(this.path, this.name);
    }
    return this.name;
  }

}