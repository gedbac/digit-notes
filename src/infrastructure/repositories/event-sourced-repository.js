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

  constructor(eventStore, aggregateType, logger) {
    super(logger);
    if (new.target === EventSourcedRepository) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._eventStore = eventStore;
    if (!this._eventStore) {
      throw new Error("Event store is null");
    }
    this._aggregateType = aggregateType;
    if (!this._aggregateType) {
      throw new Error("Aggregate type is null");
    }
  }

  get eventStore() {
    return this._eventStore;
  }

  get aggregateType() {
    return this._aggregateType;
  }

  async findBy(id) {
    var aggregate = null;
    try {
      if (!id) {
        throw new Error("Aggregate id is null");
      }
      var streamName = this._streamNameFor(id);
      var snapshot = await this.eventStore.getLatestSnapshot(streamName);
      if (snapshot) {
        aggregate = new this.aggregateType(snapshot);
      } else {
        aggregate = new this.aggregateType();
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
        var event = await stream.read();
        while (event) {
          aggregate.apply(event);
          event = await stream.read();
        }
        await stream.close();
      } else {
        throw new Error(`Stream '${streamName}' not found`);
      }
      this.logger.logDebug(`Aggregate has been fetched by id [id=${id}]`);
    } catch(error) {
      this.logger.logError(`Failed to fetch aggregate by id [id=${id}]\n${error}`);
      throw error;
    }
    return aggregate;
  }

  async save(aggregate) {
    var id = null;
    try {
      if (!aggregate) {
        throw new Error("Aggregate is null");
      }
      if (!aggregate.id) {
        throw new Error("Aggregate id is null");
      }
      var streamName = this._streamNameFor(aggregate.id);
      var stream = await this.eventStore.createStream(streamName);
      if (stream) {
        var uncommittedEvents = aggregate.uncommittedEvents;
        if (uncommittedEvents && uncommittedEvents.length > 0) {
          await stream.open();
          for (var event of uncommittedEvents) {
            await stream.write(event);
          }
          await stream.close();
          this.eventStore.addSnapshot(streamName, aggregate);
        }
      } else {
        throw new Error(`Failed to create stream '${streamName}'`);
      }
      aggregate.commit();
      this.logger.logDebug(`Aggregate has been saved [id=${id}]`);
    } catch(error) {
      this.logger.logError(`Failed to save aggregate [id=${id}]\n${error}`);
      throw error;
    }
  }

  async update(aggregate) {
    var id = null;
    try {
      if (!aggregate) {
        throw new Error("Aggregate is null");
      }
      if (!aggregate.id) {
        throw new Error("Aggregate id is null");
      }
      id = aggregate.id;
      var streamName = this._streamNameFor(id);
      var stream = await this.eventStore.getStream(streamName);
      if (stream) {
        var uncommittedEvents = aggregate.uncommittedEvents;
        if (uncommittedEvents && uncommittedEvents.length > 0) {
          await stream.open();
          for (var event of uncommittedEvents) {
            await stream.write(event);
          }
          await stream.close();
          this.eventStore.addSnapshot(streamName, aggregate);
        }
      } else {
        throw new Error(`Failed to get stream '${streamName}'`);
      }
      aggregate.commit();
      this.logger.logDebug(`Aggregate has been updated [id=${id}]`);
    } catch(error) {
      this.logger.logError(`Failed to update aggregate [id=${id}]\n${error}`);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!id) {
        throw new Error("Aggregate id is null");
      }
      var streamName = this._streamNameFor(id);
      await this.eventStore.deleteStream(streamName);
      this.logger.logDebug(`Aggregate has been deleted [id=${id}]`);
    } catch(error) {
      this.logger.logError(`Failed to delete aggregate [id=${id}]\n${error}`);
      throw error;
    }
  }

  _streamNameFor(id) {
    return `${this.aggregateType.name}::${id}`;
  }

}