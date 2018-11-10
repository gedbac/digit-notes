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
import ServiceNameFormatter from "./service-name-formatter";

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
      var serviceName = ServiceNameFormatter.format(name);
      if (serviceName) {
        var key = serviceName.toLowerCase();
        var serviceDescriptors = this._serviceDescriptors.get(key);
        if (serviceDescriptors && serviceDescriptors.length > 0) {
          var serviceDescriptor = serviceDescriptors[0];
          serviceInstance = this._resolveService(
            ServiceNameFormatter.format(serviceDescriptor.name),
            serviceDescriptor,
            context
          );
        }
      }
    }
    return serviceInstance;
  }

  getServices(name, context) {
    var serviceInstances = null;
    if (name) {
      var serviceName = ServiceNameFormatter.format(name);
      if (serviceName) {
        var key = serviceName.toLowerCase();
        var serviceDescriptors = this._serviceDescriptors.get(key);
        if (serviceDescriptors && serviceDescriptors.length > 0) {
          serviceInstances = [];
          for (var serviceDescriptor of serviceDescriptors) {
            serviceInstances.push(
              this._resolveService(
                ServiceNameFormatter.format(serviceDescriptor.name),
                serviceDescriptor,
                context
              )
            );
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
    var key = serviceName.toLowerCase();
    if (context.resolving.has(key)) {
      throw new Error(`Can not resolve circular dependency '${serviceName}'`);
    }
    var resolvedService = this._resolvedServices.get(key);
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
      var key = serviceName.toLowerCase();
      context.resolving.set(key, true);
      if (serviceDescriptor.type) {
        serviceInstance = this._createServiceFromType(serviceDescriptor.type, context);
      } else if (serviceDescriptor.factory) {
        serviceInstance = this._createServiceFromFactory(serviceDescriptor.factory, context);
      } else if (serviceDescriptor.instance) {
        serviceInstance = serviceDescriptor.instance;
      }
      context.resolving.delete(key);
    }
    this._setService(serviceName, serviceInstance, serviceDescriptor);
    return serviceInstance;
  }

  _createTransientService(serviceName, serviceDescriptor, context) {
    var serviceInstance = null;
    var key = serviceName.toLowerCase();
    context.resolving.set(key, true);
    if (serviceDescriptor.type) {
      serviceInstance = this._createServiceFromType(serviceDescriptor.type, context);
    } else if (serviceDescriptor.factory) {
      serviceInstance = this._createServiceFromFactory(serviceDescriptor.factory, context);
    }
    context.resolving.delete(key);
    return serviceInstance;
  }

  _createScopedService(serviceName, serviceDescriptor, context) {
    var serviceInstance = null;
    var key = serviceName.toLowerCase();
    context.resolving.set(key, true);
    if (serviceDescriptor.type) {
      serviceInstance = this._createServiceFromType(serviceDescriptor.type, context);
    } else if (serviceDescriptor.factory) {
      serviceInstance = this._createServiceFromFactory(serviceDescriptor.factory, context);
    }
    this._setService(serviceName, serviceInstance, serviceDescriptor);
    context.resolving.set(key, true);
    return serviceInstance;
  }

  _createServiceFromType(serviceType, context) {
    var serviceInstance, params = null;
    if (this._serviceInjections) {
      this._serviceInjections.forEach(x => {
        if (!params) {
          params = x.getParameters(serviceType, this, context);
        }
      });
    }
    if (params && params.length > 0) {
      serviceInstance = new serviceType(...params);
    } else {
      serviceInstance = new serviceType();
      this.inject(serviceInstance);
    }
    return serviceInstance;
  }

  _createServiceFromFactory(serviceFactory, context) {
    var serviceInstance = serviceFactory(this);
    this.inject(serviceInstance, context);
    return serviceInstance;
  }

  _setService(serviceName, serviceInstance, serviceDescriptor) {
    var key = serviceName.toLowerCase();
    var resolvedService = this._resolvedServices.get(key);
    if (!resolvedService) {
      this._resolvedServices.set(key, new Map([
        [ serviceDescriptor, serviceInstance ]
      ]));
    } else {
      resolvedService.set(serviceDescriptor, serviceInstance);
    }
  }

}