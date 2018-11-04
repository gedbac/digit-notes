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

import LogLevel from "./log-levels";
import LogLevels from "./log-levels";

export default class Logger {

  constructor(name, logLevel = LogLevel.None) {
    this._name = name;
    this._logLevel = logLevel;
    if (!this._name) {
      throw new Error("Logger's name is null");
    }
  }

  get name() {
    return this._name;
  }

  get logLevel() {
    return this._logLevel;
  }

  isEnabled(logLevel) {
    return this._logLevelToNumber(this._logLevel) <= this._logLevelToNumber(logLevel);
  }

  logDebug(message) {}

  logInformation(message) {}

  logWarning(message) {}

  logError(message) {}

  logCritical(message) {}

  _logLevelToNumber(logLevel) {
    if (logLevel === LogLevels.DEBUG) {
      return 0;
    } else if (logLevel === LogLevels.INFORMATION) {
      return 1;
    } else if (logLevel === LogLevels.WARNING) {
      return 2;
    } else if (logLevel === LogLevels.ERROR) {
      return 3;
    } else if (logLevel === LogLevels.CRITICAL) {
      return 4;
    } else if (logLevel === LogLevels.NONE) {
      return 5;
    }
    throw new Error(`Log '${logLevel}' level is not supported`);
  }

}