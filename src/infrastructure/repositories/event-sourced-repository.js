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

import Repository from "./repository";

export default class EventSourcedRepository extends Repository {

  constructor(eventStore, aggregateType) {
    super();
    if (new.target === EventSourcedRepository) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._eventStore = eventStore;
    if (!eventStore) {
      throw new Error("Event store is null");
    }
    this._aggregateType = aggregateType;
    if (!aggregateType) {
      throw new Error("Aggregate type is null");
    }
  }

  get eventStore() {
    return this._eventStore;
  }

  get aggregateType() {
    return this._aggregateType;
  }

  streamNameFor(id) {
    return `${this.aggregateType.name}::${id}`;
  }

  async findBy(id) {
    if (!id) {
      throw new Error("Aggregate id is null");
    }
    var aggregate = null;
    var streamName = this.streamNameFor(id);
    var snapshot = await this.eventStore.getLatestSnapshot(streamName);
    if (snapshot) {
      aggregate = this.aggregateType.createFrom(snapshot);
    } else {
      aggregate = this.aggregateType.createFrom();
    }
    var stream = await this.eventStore.getStream(streamName);
    if (stream) {
      await stream.open();
      if (snapshot) {
        if ("version" in snapshot) {
          stream.position = snapshot.version;
        } else {
          throw new Error("Snapshot version is null");
        }
      } else {
        stream.position = 0;
      }
      for (var event of stream) {
        aggregate.apply(event);
      }
      await stream.close();
    } else {
      throw new Error(`Stream '${streamName}' not found`);
    }
    return aggregate;
  }

  async save(aggregate) {
    if (!aggregate) {
      throw new Error("Aggregate is null");
    }
    if (!aggregate.id) {
      throw new Error("Aggregate id is null");
    }
    var streamName = this.streamNameFor(aggregate.id);
    var stream = await this.eventStore.createStream(streamName);
    if (stream) {
      var uncommittedEvents = aggregate.uncommittedEvents;
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


  async update(aggregate) {
    if (!aggregate) {
      throw new Error("Aggregate is null");
    }
    if (!aggregate.id) {
      throw new Error("Aggregate id is null");
    }
    var streamName = this.streamNameFor(aggregate.id);
    var stream = await this.eventStore.getStream(streamName);
    if (stream) {
      var uncommittedEvents = aggregate.uncommittedEvents;
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
      throw new Error("Aggregate id is null");
    }
    var streamName = this.streamNameFor(id);
    await this.eventStore.deleteStream(streamName);
  }

}