/*
 *  Amber Notes
 *
 *  Copyright (C) 2016 - 2018 The Amber Notes Authors
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

import { Repository } from "infrastructure-repositories";
import { OutlineDocument } from "outlines-model";

export default class OutlineDocumentRepository extends Repository {

  constructor(eventStore) {
    super();
    this._eventStore = eventStore;
    if (!eventStore) {
      throw new Error("Event store is null");
    }
  }

  async findBy(id) {
    if (!id) {
      throw new Error("id is null");
    }
    var streamName = this.streamNameFor(id);
    var stream = await this._eventStore.getStream(streamName);
    if (stream) {
      var document = new OutlineDocument();
      await stream.open();
      for (var event of stream) {
        document.apply(event);
      }
      await stream.close();
    } else {
      throw new Error(`Stream '${streamName}' not found`);
    }
    return document;
  }

  async save(outlineDocument) {
    if (!outlineDocument) {
      throw new Error("Outline document is null");
    }
    var streamName = this.streamNameFor(outlineDocument.id);
    var stream = await this._eventStore.createStream(streamName);
    if (stream) {
      var uncommittedEvents = outlineDocument.uncommittedEvents;
      if (uncommittedEvents && uncommittedEvents.length > 0) {
        await stream.open();
        for (var event of uncommittedEvents) {
          await stream.write(event);
        }
        await stream.close();
      }
    } else {
      throw new Error(`Failed to create stream '${streamName}'`);
    }
  }

  async update(outlineDocument) {
    if (!outlineDocument) {
      throw new Error("Outline document is null");
    }
    var streamName = this.streamNameFor(outlineDocument.id);
    var stream = await this._eventStore.getStream(streamName);
    if (stream) {
      var uncommittedEvents = outlineDocument.uncommittedEvents;
      if (uncommittedEvents && uncommittedEvents.length > 0) {
        await stream.open();
        for (var event of uncommittedEvents) {
          await stream.write(event);
        }
        await stream.close();
      }
    } else {
      throw new Error(`Failed to get stream '${streamName}'`);
    }
  }

  async delete(id) {
    if (!id) {
      throw new Error("id is null");
    }
    var streamName = this.streamNameFor(id);
    await this._eventStore.deleteStream(streamName);
  }

  streamNameFor(id) {
    return `${OutlineDocument.name}::${id}`;
  }

}