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

import ServiceScope from "./service-scope";
import ServiceLifetimes from "./service-lifetimes";

export default class ServiceProvider {

  constructor(props) {
    this._serviceProvider = null;
    if (props && "serviceProvider" in props) {
      this._serviceProvider = props.serviceProvider;
    }
    this._serviceDescriptors = null;
    if (props && "serviceDescriptors" in props) {
      this._serviceDescriptors = props.serviceDescriptors;
    }
    this._services = new Map();
  }

  get serviceProvider() {
    return this._serviceProvider;
  }

  get serviceDescriptors() {
    return this._serviceDescriptors;
  }

  createScope() {
    return new ServiceScope({
      serviceProvider: new ServiceProvider({
        serviceProvider: this,
        serviceDescriptors: this.serviceDescriptors
      })
    });
  }

  getService(name) {
    var service = null;
    if (name) {
      var serviceName = this._serviceNameAsString(name);
      service = this._services.get(serviceName);
      if (!service) {
        var serviceDescriptor = this._serviceDescriptors.get(serviceName);
        if (serviceDescriptor) {
          switch(serviceDescriptor.lifetime) {
            case ServiceLifetimes.Singleton:
              service = this._createSingletonService(serviceDescriptor);
              break;
            case ServiceLifetimes.Transient:
              service = this._createTransientService(serviceDescriptor);
              break;
            case ServiceLifetimes.Scoped:
              service = this._createScopedService(serviceDescriptor);
              break;
          }
        }
      }
    }
    return service;
  }

  _createSingletonService(serviceDescriptor) {
    var service = null;
    if (this.serviceProvider) {
      service = this.serviceProvider.getService(serviceDescriptor.name);
    } else {
      if (serviceDescriptor.instance) {
        service = serviceDescriptor.service;
      } else if (serviceDescriptor.factory) {
        service = serviceDescriptor.factory(this);
      } else if (serviceDescriptor.type) {
        service = new serviceDescriptor.type();
      }
    }
    if (service) {
      this._services.set(this._serviceNameAsString(serviceDescriptor.name), service);
    }
    return service;
  }

  _createTransientService(serviceDescriptor) {
    var service = null;
    if (serviceDescriptor.factory) {
      service = serviceDescriptor.factory(this);
    } else if (serviceDescriptor.type) {
      service = new serviceDescriptor.type();
    }
    return service;
  }

  _createScopedService(serviceDescriptor) {
    var service = null;
    if (serviceDescriptor.factory) {
      service = serviceDescriptor.factory(this);
    } else if (serviceDescriptor.type) {
      service = new serviceDescriptor.type();
    }
    if (service) {
      this._services.set(this._serviceNameAsString(serviceDescriptor.name), service);
    }
    return service;
  }

  _serviceNameAsString(serviceName) {
    if (typeof serviceName === "function") {
      serviceName = serviceName.name;
    }
    return serviceName;
  }

}