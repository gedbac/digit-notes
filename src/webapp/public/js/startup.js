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

import { ServiceProviderFactory, ConstructorInjection, PropertyInjection } from "infrastructure-dependency-injection";
import { ConsoleLoggerFactory, LogLevels } from "infrastructure-logging";
import Dispatcher from "./shared/dispatcher";
import ApplicationActions from "./actions/application-actions";
import ApplicationStore from "./stores/application-store";
import OutlinerActions from "./actions/outliner-actions";
import OutlinerStore from "./stores/outliner-store";

export default class Startup {

  constructor() {
    this._serviceProviderFactory = new ServiceProviderFactory();
  }

  configure() {
    this.configureServices(this._serviceProviderFactory);
    return this;
  }

  createServiceProvider() {
    return this._serviceProviderFactory.create();
  }

  configureServices(serviceProviderFactory) {
    serviceProviderFactory
      .use(new ConstructorInjection())
      .use(new PropertyInjection())
      .addModule(x => this.configureLogging(x))
      .addModule(x => this.configureApplication(x))
      .addModule(x => this.configureOutlines(x));
  }

  configureLogging(serviceProviderFactory) {
    serviceProviderFactory
      .addScoped("consoleLoggerFactory", () => new ConsoleLoggerFactory(LogLevels.DEBUG))
      .addScoped("logger", x => x
        .getService("consoleLoggerFactory")
        .createLogger("application")
      );
  }

  configureApplication(serviceProviderFactory) {
    serviceProviderFactory
      .addScoped("dispatcherLogger", x => x
        .getService("consoleLoggerFactory")
        .createLogger("dispatcherLogger")
      )
      .addScoped("dispatcher", x =>
        new Dispatcher(
          x.getService("dispatcherLogger")
        )
      )
      .addScoped(ApplicationActions)
      .addScoped(ApplicationStore);
  }

  configureOutlines(serviceProviderFactory) {
    serviceProviderFactory
      .addScoped(OutlinerActions)
      .addScoped(OutlinerStore);
  }

}