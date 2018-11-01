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

import React from "react";
import ReactDOM from "react-dom";
import { ServiceProviderFactory } from "infrastructure-dependency-injection";
import Startup from "./startup";
import { ApplicationContextProvider } from "./components/application-context";
import Application from "./components/application";
import LaunchPage from "./components/launch-page";
import "../css/style.scss";

var serviceProviderFactory = new ServiceProviderFactory();

var startup = new Startup();

startup.configureServices(serviceProviderFactory);

var serviceProvider = serviceProviderFactory.create();

var logger = serviceProvider.getService("logger");

var jsx = (
  <ApplicationContextProvider value={{ serviceProvider: serviceProvider }}>
    <Application>
      <LaunchPage />
    </Application>
  </ApplicationContextProvider>
);

ReactDOM.render(jsx, document.getElementById("container"));

logger.logInformation("Application started");