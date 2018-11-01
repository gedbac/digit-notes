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

  constructor(name, logLevel) {
    super(name, logLevel);
  }

  logDebug(message) {
    if (this.isEnabled(LogLevels.Debug)) {
      console.log(this._formatMessage(LogLevels.Debug, message));
    }
  }

  logInformation(message) {
    if (this.isEnabled(LogLevels.Information)) {
      console.info(this._formatMessage(LogLevels.Information, message));
    }
  }

  logWarning(message) {
    if (this.isEnabled(LogLevels.Warning)) {
      console.warn(this._formatMessage(LogLevels.Warning, message));
    }
  }

  logError(message) {
    if (this.isEnabled(LogLevels.Error)) {
      console.error(this._formatMessage(LogLevels.Error, message));
    }
  }

  logCritical(message) {
    if (this.isEnabled(LogLevels.Critical)) {
      console.error(this._formatMessage(LogLevels.Critical, message));
    }
  }

  _formatMessage(logLevel, message) {
    return `${new Date().toISOString()} ${this.name} ${this._formatLogLevel(logLevel)}: ${message}`;
  }

  _formatLogLevel(logLevel) {
    if (logLevel === LogLevels.Debug) {
      return "DEBUG";
    } else if (logLevel === LogLevels.Information) {
      return "INFO";
    } else if (logLevel === LogLevels.Warning) {
      return "WARN";
    } else if (logLevel === LogLevels.Error) {
      return "ERROR";
    } else if (logLevel === LogLevels.Critical) {
      return "CRITICAL";
    }
    return null;
  }

}