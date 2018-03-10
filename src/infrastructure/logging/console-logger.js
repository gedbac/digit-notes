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

import Logger from "./logger";
import LogLevels from "./log-levels";

export default class ConsoleLogger extends Logger {

  constructor(props) {
    super(props);
  }

  logDebug(message) {
    if (this.isEnabled(LogLevels.Debug)) {
      console.log(message);
    }
  }

  logInformation(message) {
    if (this.isEnabled(LogLevels.Information)) {
      console.info(message);
    }
  }

  logWarning(message) {
    if (this.isEnabled(LogLevels.Warning)) {
      console.warn(message);
    }
  }

  logError(message) {
    if (this.isEnabled(LogLevels.Error)) {
      console.error(message);
    }
  }

  logCritical(message) {
    if (this.isEnabled(LogLevels.Critical)) {
      console.error(message);
    }
  }

}