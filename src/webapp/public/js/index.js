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

import React from "react";
import ReactDOM from "react-dom";
import Startup from "./startup";
import DependencyInjection from "./shared/dependency-injection";
import Application from "./components/application";
import "../css/style";

var serviceProvider = new Startup()
  .configure()
  .createServiceProvider();

var WrappedApplication = DependencyInjection.inject(Application, serviceProvider);

ReactDOM.render(
  <WrappedApplication />,
  document.getElementById("viewport")
);