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
    this._resolvedServices = new Map();
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
    var serviceInstance = null;
    if (name) {
      var serviceName = this._getServiceName(name);
      if (serviceName) {
        var serviceDescriptors = this._serviceDescriptors.get(serviceName);
        if (serviceDescriptors && serviceDescriptors.length > 0) {
          serviceInstance = this._resolveService(serviceName, serviceDescriptors[0], context);
        }
      }
    }
    return serviceInstance;
  }

  getServices(name, context) {
    var serviceInstances = null;
    if (name) {
      var serviceName = this._getServiceName(name);
      if (serviceName) {
        var serviceDescriptors = this._serviceDescriptors.get(serviceName);
        if (serviceDescriptors && serviceDescriptors.length > 0) {
          serviceInstances = [];
          for (var serviceDescriptor of serviceDescriptors) {
            serviceInstances.push(this._resolveService(serviceInstances, serviceDescriptor, context));
          }
        }
      }
    }
    return serviceInstances;
  }

  inject(serviceInstance, context) {
    if (serviceInstance && this._serviceInjections) {
      this._serviceInjections.forEach(x => x.inject(serviceInstance, this, context));
    }
  }

  _resolveService(serviceName, serviceDescriptor, context) {
    var serviceInstance = null;
    context = context || { resolving: new Map() };
    if (!context.resolving) {
      context.resolving = new Map();
    }
    if (context.resolving.has(serviceName)) {
      throw new Error(`Can not resolve circular dependency '${this._toString(serviceDescriptor.name)}'`);
    }
    var resolvedService = this._resolvedServices.get(serviceName);
    if (resolvedService && resolvedService.has(serviceDescriptor)) {
      serviceInstance = resolvedService.get(serviceDescriptor);
    } else {
      switch(serviceDescriptor.lifetime) {
        case ServiceLifetimes.SINGLETON:
          serviceInstance = this._createSingletonService(serviceName, serviceDescriptor, context);
          break;
        case ServiceLifetimes.TRANSIENT:
          serviceInstance = this._createTransientService(serviceName, serviceDescriptor, context);
          break;
        case ServiceLifetimes.SCOPED:
          serviceInstance = this._createScopedService(serviceName, serviceDescriptor, context);
          break;
      }
    }
    return serviceInstance;
  }

  _createSingletonService(serviceName, serviceDescriptor, context) {
    var serviceInstance = null;
    if (this._serviceProvider) {
      serviceInstance = this._serviceProvider.getService(serviceDescriptor.name, context);
    } else {
      context.resolving.set(serviceName, true);
      if (serviceDescriptor.type) {
        serviceInstance = this._createService(serviceDescriptor.type, context);
      } else if (serviceDescriptor.factory) {
        serviceInstance = serviceDescriptor.factory(this);
        this.inject(serviceInstance, context);
      } else if (serviceDescriptor.instance) {
        serviceInstance = serviceDescriptor.instance;
      }
      context.resolving.delete(serviceName);
    }
    this._setService(serviceName, serviceInstance, serviceDescriptor);
    return serviceInstance;
  }

  _createTransientService(serviceName, serviceDescriptor, context) {
    var serviceInstance = null;
    context.resolving.set(serviceName, true);
    if (serviceDescriptor.type) {
      serviceInstance = this._createService(serviceDescriptor.type, context);
    } else if (serviceDescriptor.factory) {
      serviceInstance = serviceDescriptor.factory(this);
      this.inject(serviceInstance, context);
    }
    context.resolving.delete(serviceName);
    return serviceInstance;
  }

  _createScopedService(serviceName, serviceDescriptor, context) {
    var serviceInstance = null;
    context.resolving.set(serviceName, true);
    if (serviceDescriptor.type) {
      serviceInstance = this._createService(serviceDescriptor.type, context);
    } else if (serviceDescriptor.factory) {
      serviceInstance = serviceDescriptor.factory(this);
      this.inject(serviceInstance, context);
    }
    this._setService(serviceName, serviceInstance, serviceDescriptor);
    context.resolving.set(serviceName, true);
    return serviceInstance;
  }

  _createService(serviceType, context) {
    var serviceInstance, params = null;
    if (this._serviceInjections) {
      this._serviceInjections.forEach(x => {
        if (!params) {
          params = x.getParameters(serviceType, this, context);
        }
      });
    }
    if (params) {
      serviceInstance = new serviceType(...params);
    } else {
      serviceInstance = new serviceType();
    }
    return serviceInstance;
  }

  _setService(serviceName, serviceInstance, serviceDescriptor) {
    var resolvedService = this._resolvedServices.get(serviceName);
    if (!resolvedService) {
      this._resolvedServices.set(serviceName, new Map([
        [ serviceDescriptor, serviceInstance ]
      ]));
    } else {
      resolvedService.set(serviceDescriptor, serviceInstance);
    }
  }

  _getServiceName(value) {
    var serviceName = null;
    if (value) {
      if (typeof value === "string") {
        serviceName = value;
      } else if (typeof value === "function") {
        serviceName = value.name;
      }
      if (value) {
        serviceName = serviceName.toLowerCase();
      }
    }
    return serviceName;
  }

  _toString(value) {
    var serviceName = null;
    if (value) {
      if (typeof value === "string") {
        serviceName = value;
      } else if (typeof value === "function") {
        serviceName = value.name;
      }
    }
    return serviceName;
  }

}