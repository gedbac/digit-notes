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

import ServiceDescriptor from "./service-descriptor";
import ServiceLifetimes from "./service-lifetimes";
import ServiceProvider from "./service-provider";
import ServiceNameFormatter from "./service-name-formatter";

export default class ServiceProviderBuilder {

  constructor() {
    this._serviceDescriptors = new Map();
    this._serviceInjections = [];
  }

  build() {
    return new ServiceProvider(this._serviceDescriptors, this._serviceInjections);
  }

  addModule(configuration) {
    if (!configuration) {
      throw new Error("Configuration is null");
    }
    if (configuration && typeof configuration === "function") {
      configuration(this);
    } else if ("configure" in configuration) {
      configuration.configure(this);
    }
    return this;
  }

  use(serviceInjection) {
    if (!serviceInjection) {
      throw new Error("Service injection is null");
    }
    this._serviceInjections.push(serviceInjection);
    return this;
  }

  addService(serviceDescriptor) {
    if (!serviceDescriptor) {
      throw new Error("Service descriptor is null");
    }
    if (!serviceDescriptor.name) {
      throw new Error("Service name is null");
    }
    if (typeof serviceDescriptor.name !== "string" && typeof serviceDescriptor.name !== "function") {
      throw new Error("Service name's type is invalid");
    }
    var serviceName = ServiceNameFormatter.format(serviceDescriptor.name);
    if (!serviceDescriptor.lifetime) {
      throw new Error(`Lifetime of service '${serviceName}' is null`);
    }
    if (
      serviceDescriptor.lifetime !== ServiceLifetimes.SINGLETON &&
      serviceDescriptor.lifetime !== ServiceLifetimes.TRANSIENT &&
      serviceDescriptor.lifetime !== ServiceLifetimes.SCOPED
    ) {
      throw new Error(`Lifetime '${serviceDescriptor.lifetime}' of service '${serviceName}' is not supported`);
    }
    if (!serviceDescriptor.instance && !serviceDescriptor.factory && !serviceDescriptor.type) {
      throw new Error(`Type of service '${serviceName}' is null`);
    }
    if (serviceDescriptor.lifetime === ServiceLifetimes.TRANSIENT && serviceDescriptor.instance) {
      throw new Error(`Instance can't be set for transient service '${serviceName}'`);
    }
    if (serviceDescriptor.lifetime === ServiceLifetimes.SCOPED && serviceDescriptor.instance) {
      throw new Error(`Instance can't be set for scoped service '${serviceName}'`);
    }
    if (serviceDescriptor.instance && serviceDescriptor.factory) {
      throw new Error(`Instance and factory can't be set at the same time for service '${serviceName}'`);
    }
    if (serviceDescriptor.instance && serviceDescriptor.type) {
      throw new Error(`Instance and type can't be set at the same time for service '${serviceName}'`);
    }
    if (serviceDescriptor.factory && serviceDescriptor.type) {
      throw new Error(`Factory and type can't be set at the same time for service '${serviceName}'`);
    }
    if (serviceDescriptor.type && typeof serviceDescriptor.type !== "function") {
      throw new Error(`Service '${serviceName}' type is invalid`);
    }
    var key = serviceName.toLowerCase();
    if (!this._serviceDescriptors.has(key)) {
      this._serviceDescriptors.set(key, [ serviceDescriptor ]);
    } else {
      var serviceDescriptors = this._serviceDescriptors.get(key);
      if (serviceDescriptors) {
        serviceDescriptors.splice(0, 0, serviceDescriptor);
      } else {
        this._serviceDescriptors.set(key, [ serviceDescriptor ]);
      }
    }
    return this;
  }

  addSingleton(name, options) {
    return this.addService(
      this._createServiceDescriptor(name, ServiceLifetimes.SINGLETON, options)
    );
  }

  addTransient(name, options) {
    return this.addService(
      this._createServiceDescriptor(name, ServiceLifetimes.TRANSIENT, options)
    );
  }

  addScoped(name, options) {
    return this.addService(
      this._createServiceDescriptor(name, ServiceLifetimes.SCOPED, options)
    );
  }

  _createServiceDescriptor(name, lifetime, options) {
    if (name && !options && typeof name === "function") {
      options = {
        type: name
      };
    } else if (name && options && !options.instance && !options.factory && !options.type) {
      if (typeof options === "function" && options.prototype) {
        options = {
          type: options
        };
      } else if (typeof options === "function" && !options.prototype) {
        options = {
          factory: options
        };
      } else if (typeof options === "object") {
        options = {
          instance: options
        };
      }
    } else {
      options = options || {};
    }
    return new ServiceDescriptor(name, lifetime, options.type, options.factory, options.instance);
  }

}