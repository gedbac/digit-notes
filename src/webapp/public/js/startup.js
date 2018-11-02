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

import { ConsoleLoggerFactory, LogLevels } from "infrastructure-logging";
import Dispatcher from "./shared/dispatcher";

export default class Startup {

  configureServices(serviceProviderFactory) {
    serviceProviderFactory
      .addModule(this._configureLogging)
      .addSingleton("dispatcherLogger", {
        factory: x => x
          .getService("consoleLoggerFactory")
          .createLogger("dispatcherLogger")
      })
      .addSingleton("dispatcher", {
        factory: x => new Dispatcher(
          x.getService("dispatcherLogger")
        )
      });
  }

  _configureLogging(serviceProviderFactory) {
    serviceProviderFactory
      .addSingleton("consoleLoggerFactory", () => new ConsoleLoggerFactory(LogLevels.Debug))
      .addSingleton("logger", {
        factory: x => x
          .getService("consoleLoggerFactory")
          .createLogger("application")
      });
  }

}