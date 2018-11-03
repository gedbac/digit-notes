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
    this._serviceParameters = new Map();
  }

  getConstructorParameters(serviceType, serviceProvider, context) {
    var parameterValues = null;
    var parameterNames = this._getParameterNames(serviceType);
    if (parameterNames && parameterNames.length > 0) {
      parameterValues = [];
      for (var i = 0; i < parameterNames.length; i++) {
        if(parameterNames[i] === "serviceProvider") {
          parameterValues[i] = serviceProvider;
        } else {
          parameterValues[i] = serviceProvider.getService(parameterNames[i], context);
        }
      }
    }
    return parameterValues;
  }

  _getParameterNames(serviceType) {
    var params = null;
    if (serviceType && typeof serviceType === "function") {
      if (!this._serviceParameters.has(serviceType)) {
        var matches = serviceType
          .toString()
          .match(/(?:constructor|function)[^(]*\(([^)]*)\)/);
        if (matches && matches.length > 1) {
          params = matches[1]
            .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
            .replace(/\s+/g, '')
            .split(",");
        }
        this._serviceParameters.set(serviceType, params);
      } else {
        params = this._serviceParameters.get(serviceType);
      }
    }
    return params;
  }

}