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

export default class EventStreamMerger {

  constructor(streamFactory, eventComparer) {
    this._streamFactory = streamFactory;
    if (!this._streamFactory) {
      throw new Error("Event stream factory is null");
    }
    this._eventComparer = eventComparer;
    if (!this._eventComparer) {
      throw new Error("Event comparer is null");
    }
  }

  async merge(stream1, stream2) {
    if (!stream1 || !stream2) {
      throw new Error("Stream is null");
    }
    stream1.position = 0;
    stream2.position = 0;
    var outputStream = this._streamFactory.create("temp");
    outputStream.open();
    var event1 = await stream1.read();
    var event2 = await stream2.read();
    while (event1 || event2) {
      if (event1 && event2) {
        var result = this._eventComparer.compare(event1, event2);
        if (result === 0) {
          await outputStream.write(event1);
          event1 = await stream1.read();
          event2 = await stream2.read();
        } else if (result === -1) {
          await outputStream.write(event1);
          event1 = await stream1.read();
        } else {
          await outputStream.write(event2);
          event2 = await stream2.read();
        }
      } else if (event1) {
        await outputStream.write(event1);
        event1 = await stream1.read();
      } else if (event2) {
        await outputStream.write(event2);
        event2 = await stream2.read();
      }
    }
    return outputStream;
  }
}