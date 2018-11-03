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

  constructor(serviceDescriptors, serviceInjections, serviceProvider) {
    this._serviceDescriptors = serviceDescriptors;
    this._serviceInjections = serviceInjections;
    this._serviceProvider = serviceProvider;
    this._services = new Map();
    if (!this._serviceDescriptors) {
      throw new Error("Service descriptors is null");
    }
  }

  createScope() {
    return new ServiceScope(
      new ServiceProvider(this._serviceDescriptors, this._serviceInjections, this)
    );
  }

  getService(name, context) {
    var service = null;
    if (name) {
      var serviceKey = this._getServiceKey(name);
      if (serviceKey) {
        service = this._services.get(serviceKey);
        if (!service) {
          context = context || { resolving: new Map() };
          if (context.resolving.has(serviceKey)) {
            throw new Error(`Can not resolve circular dependency '${serviceKey}'`);
          }
          if (!context.resolving) {
            context.resolving = new Map();
          }
          context.resolving.set(serviceKey, true);
          var serviceDescriptor = this._serviceDescriptors.get(serviceKey);
          if (serviceDescriptor) {
            switch(serviceDescriptor.lifetime) {
              case ServiceLifetimes.Singleton:
                service = this._createSingletonService(serviceDescriptor, context);
                break;
              case ServiceLifetimes.Transient:
                service = this._createTransientService(serviceDescriptor, context);
                break;
              case ServiceLifetimes.Scoped:
                service = this._createScopedService(serviceDescriptor, context);
                break;
            }
          }
          context.resolving.delete(serviceKey);
        }
      }
    }
    return service;
  }

  _createSingletonService(serviceDescriptor, context) {
    var service = null;
    if (this._serviceProvider) {
      service = this._serviceProvider.getService(serviceDescriptor.name, context);
    } else {
      if (serviceDescriptor.type) {
        service = this._createService(serviceDescriptor.type, context);
      } else if (serviceDescriptor.factory) {
        service = serviceDescriptor.factory(this);
        this._injectDependencies(service, context);
      } else if (serviceDescriptor.instance) {
        service = serviceDescriptor.instance;
      }
    }
    if (service) {
      this._services.set(this._getServiceKey(serviceDescriptor.name), service);
    }
    return service;
  }

  _createTransientService(serviceDescriptor, context) {
    var service = null;
    if (serviceDescriptor.type) {
      service = this._createService(serviceDescriptor.type, context);
    } else if (serviceDescriptor.factory) {
      service = serviceDescriptor.factory(this);
      this._injectDependencies(service, context);
    }
    return service;
  }

  _createScopedService(serviceDescriptor, context) {
    var service = null;
    if (serviceDescriptor.type) {
      service = this._createService(serviceDescriptor.type, context);
    } else if (serviceDescriptor.factory) {
      service = serviceDescriptor.factory(this);
      this._injectDependencies(service, context);
    }
    if (service) {
      this._services.set(this._getServiceKey(serviceDescriptor.name), service);
    }
    return service;
  }

  _createService(serviceType, context) {
    var service, params = null;
    if (this._serviceInjections) {
      this._serviceInjections.forEach(x => {
        if (!params) {
          params = x.getConstructorParameters(serviceType, this, context);
        }
      });
    }
    if (params) {
      service = new serviceType(...params);
    } else {
      service = new serviceType();
    }
    return service;
  }

  _injectDependencies(service, context) {
    if (service && this._serviceInjections) {
      this._serviceInjections.forEach(x => x.injectDependencies(service, this, context));
    }
  }

  _getServiceKey(serviceName) {
    var serviceKey = null;
    if (serviceName) {
      if (typeof serviceName === "string") {
        serviceKey = serviceName;
      } else if (typeof serviceName === "function") {
        serviceKey = serviceName.name;
      }
      if (serviceKey) {
        serviceKey = serviceKey.toLowerCase();
      }
    }
    return serviceKey;
  }

}