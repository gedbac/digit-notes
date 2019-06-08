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

import { ServiceProviderBuilder, ConstructorInjection, PropertyInjection } from "d8s/infrastructure/dependency-injection";
import { ConsoleLoggerFactory, LogLevels } from "d8s/infrastructure/logging";
import Dispatcher from "./shared/dispatcher";
import ApplicationActions from "./actions/application-actions";
import ApplicationStore from "./stores/application-store";
import OutlinerActions from "./actions/outliner-actions";
import OutlinerStore from "./stores/outliner-store";

export default class Startup {

  constructor() {
    this._serviceProviderBuilder = new ServiceProviderBuilder();
  }

  configure() {
    this.configureServices(this._serviceProviderBuilder);
    return this;
  }

  createServiceProvider() {
    return this._serviceProviderBuilder.build();
  }

  configureServices(serviceProviderBuilder) {
    serviceProviderBuilder
      .use(new ConstructorInjection())
      .use(new PropertyInjection())
      .addModule(x => this.configureLogging(x))
      .addModule(x => this.configureApplication(x))
      .addModule(x => this.configureOutlines(x));
  }

  configureLogging(serviceProviderBuilder) {
    serviceProviderBuilder
      .addScoped("consoleLoggerFactory", () => new ConsoleLoggerFactory(LogLevels.DEBUG))
      .addScoped("logger", x => x
        .getService("consoleLoggerFactory")
        .createLogger("Application")
      );
  }

  configureApplication(serviceProviderBuilder) {
    serviceProviderBuilder
      .addScoped("dispatcherLogger", x => x
        .getService("consoleLoggerFactory")
        .createLogger("Dispatcher")
      )
      .addScoped("dispatcher", x =>
        new Dispatcher(
          x.getService("dispatcherLogger")
        )
      )
      .addScoped(ApplicationActions)
      .addScoped(ApplicationStore);
  }

  configureOutlines(serviceProviderBuilder) {
    serviceProviderBuilder
      .addScoped(OutlinerActions)
      .addScoped(OutlinerStore);
  }

}