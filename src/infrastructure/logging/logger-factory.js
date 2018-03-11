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

import LogLevels from "./log-levels";

export default class LoggerFactory {

  constructor(props) {
    this._logLevel = LogLevels.None;
    if (props && "logLevel" in props) {
      this._logLevel = props.logLevel;
    }
  }

  get logLevel() {
    return this._logLevel;
  }

  createLogger(name) {
    if (!name) {
      throw {
        message: "Logger's name is not set"
      };
    }
    if (typeof name === "function") {
      name = name.name;
    }
    if (typeof name !== "string") {
      throw {
        message: "Logger's name is not a string"
      };
    }
    return this._onCreateLogger(name);
  }

  _onCreateLogger(name) {
    return new Logger({
      name: name,
      logLevel: this.logLevel
    });
  }

}