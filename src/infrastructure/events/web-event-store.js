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

import EventStore from "./event-store";
import WebEventStreamFactory from "./web-event-stream-factory";
import WebEventDatabase from "./web-event-database";

export default class WebEventStore extends EventStore {

  constructor(objectSerializer, databaseName, logger) {
    super(logger);
    this._objectSerializer = objectSerializer;
    if (!this._objectSerializer) {
      throw new Error("Object serialize is null");
    }
    this._database = new WebEventDatabase(databaseName);
    this._eventStreamFactory = new WebEventStreamFactory(objectSerializer);
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
      exists = await this._database.exists("event-streams", null, name);
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
        throw new Error(`Stream with name '${name}' already exists`);
      }
      stream = this._eventStreamFactory.create(name);
      await this._database.add("event-streams", {
        name: name
      });
      this.logger.logDebug(`Stream has been created [streamName=${name}]`);
    } catch (error) {
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
      stream = await this._database.get("event-streams", null, name) || null;
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
      // TODO: implement delete operation
      //this._streams.delete(name);
      this.logger.logDebug(`Stream has been deleted [streamName=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to delete stream [streamName=${name}]\n${error}`);
      throw error;
    }
  }

}