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

import ServiceInjection from "./service-injection";

export default class ConstructorInjection extends ServiceInjection {

  constructor() {
    super();
    this._serviceParameterNames = new Map();
  }

  getParameters(serviceType, serviceProvider, context) {
    var serviceParameterValues = [];
    if (serviceType) {
      var serviceParameterNames = this._serviceParameterNames.get(serviceType);
      if (!serviceParameterNames) {
        serviceParameterNames = this._getServiceParameterNames(serviceType);
        this._serviceParameterNames.set(serviceType, serviceParameterNames);
      }
      if (serviceParameterNames && serviceParameterNames.length > 0) {
        for (var i = 0; i < serviceParameterNames.length; i++) {
          if(serviceParameterNames[i] === "serviceProvider") {
            serviceParameterValues[i] = serviceProvider;
          } else {
            serviceParameterValues[i] = serviceProvider.getService(serviceParameterNames[i], context);
          }
        }
      }
    }
    return serviceParameterValues;
  }

  _getServiceParameterNames(serviceType) {
    var serviceParameterNames = null;
    if (serviceType && typeof serviceType === "function") {
      var matches = serviceType
        .toString()
        .match(/(?:constructor|function)[^(]*\(([^)]*)\)/);
      if (matches && matches.length > 1) {
        serviceParameterNames = matches[1]
          .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
          .replace(/\s+/g, '')
          .split(",");
      }
    }
    return serviceParameterNames;
  }

}