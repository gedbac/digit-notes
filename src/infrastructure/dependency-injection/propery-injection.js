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

export default class PropertyInjection extends ServiceInjection {

  constructor() {
    super();
    this._servicePropertyNames = new Map();
  }

  inject(service, serviceProvider, context) {
    var serviceType = this._getServiceType(service);
    if (serviceType) {
      var servicePropertyNames = this._servicePropertyNames.get(serviceType);
      if (!servicePropertyNames) {
        servicePropertyNames = this._getServicePropertyNames(service);
        this._servicePropertyNames.set(serviceType, servicePropertyNames);
      }
      if (servicePropertyNames) {
        for(var propertyName of servicePropertyNames) {
          if (propertyName === "serviceProvider") {
            service[propertyName] = serviceProvider;
          } else {
            service[propertyName] = serviceProvider.getService(propertyName);
          }
        }
      }
    }
  }

  _getServicePropertyNames(service) {
    var servicePropertyNames = [];
    if (service) {
      var prototype = Object.getPrototypeOf(service);
      if (prototype && prototype !== Object.prototype) {
        var propertyNames = Object.getOwnPropertyNames(prototype);
        if (propertyNames) {
          for (var propertyName of propertyNames) {
            var propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
            if (propertyDescriptor && propertyDescriptor.set) {
              servicePropertyNames.push(propertyName);
            }
          }
        }
        servicePropertyNames = servicePropertyNames.concat(this._getServicePropertyNames(prototype));
      }
    }
    return servicePropertyNames;
  }

  _getServiceType(service) {
    var serviceType = null;
    if (service) {
      var prototype = Object.getPrototypeOf(service);
      if (prototype) {
        serviceType = prototype.constructor;
      }
    }
    return serviceType;
  }

}