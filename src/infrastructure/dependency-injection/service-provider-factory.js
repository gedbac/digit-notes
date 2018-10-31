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

import ServiceDescriptor from "./service-descriptor";
import ServiceLifetimes from "./service-lifetimes";
import ServiceProvider from "./service-provider";

export default class ServiceProviderFactory {

  constructor() {
    this._serviceDescriptors = new Map();
    this._serviceInjections = [];
  }

  create() {
    return new ServiceProvider(this._serviceDescriptors, this._serviceInjections);
  }

  addModule(configuration) {
    if (!configuration) {
      throw {
        message: "Configuration is null"
      };
    }
    if (configuration && configuration === "function") {
      configuration(this);
    } else if ("configure" in configuration) {
      configuration.configure(this);
    }
    return this;
  }

  use(serviceInjection) {
    if (!serviceInjection) {
      throw {
        message: "Service injection is null"
      };
    }
    this._serviceInjections.push(serviceInjection);
    return this;
  }

  addService(serviceDescriptor) {
    if (!serviceDescriptor) {
      throw {
        message: "Service descriptor is null"
      };
    }
    if (!serviceDescriptor.name) {
      throw {
        message: "Service name is null"
      };
    }
    if (typeof serviceDescriptor.name !== "string" && typeof serviceDescriptor.name !== "function") {
      throw {
        message: "Service name's type is invalid"
      };
    }
    var serviceName = this._getServiceName(serviceDescriptor.name);
    if (!serviceDescriptor.lifetime) {
      throw {
        message: `Lifetime of service '${serviceName}' is null`
      };
    }
    if (
      serviceDescriptor.lifetime !== ServiceLifetimes.Singleton &&
      serviceDescriptor.lifetime !== ServiceLifetimes.Transient &&
      serviceDescriptor.lifetime !== ServiceLifetimes.Scoped
    ) {
      throw {
        message: `Lifetime '${serviceDescriptor.lifetime}' of service '${serviceName}' is not supported`
      };
    }
    if (!serviceDescriptor.instance && !serviceDescriptor.factory && !serviceDescriptor.type) {
      throw {
        message: `Type of service '${serviceName}' is null`
      };
    }
    if (serviceDescriptor.lifetime === ServiceLifetimes.Transient && serviceDescriptor.instance) {
      throw {
        message: `Instance can't be set for transient service '${serviceName}'`
      };
    }
    if (serviceDescriptor.lifetime === ServiceLifetimes.Scoped && serviceDescriptor.instance) {
      throw {
        message: `Instance can't be set for scoped service '${serviceName}'`
      };
    }
    if (serviceDescriptor.instance && serviceDescriptor.factory) {
      throw {
        message: `Instance and factory can't be set at the same time for service '${serviceName}'`
      };
    }
    if (serviceDescriptor.instance && serviceDescriptor.type) {
      throw {
        message: `Instance and type can't be set at the same time for service '${serviceName}'`
      };
    }
    if (serviceDescriptor.factory && serviceDescriptor.type) {
      throw {
        message: `Factory and type can't be set at the same time for service '${serviceName}'`
      };
    }
    this._serviceDescriptors.set(this._getServiceKey(serviceDescriptor.name), serviceDescriptor);
    return this;
  }

  addSingleton(name, options = {}) {
    if (name && typeof name === "function" && !options.instance && !options.factory && !options.type) {
      options.type = name;
    } else if (name && typeof options === "function") {
      options.type = options;
    }
    return this.addService(new ServiceDescriptor(
      name,
      ServiceLifetimes.Singleton,
      options.type,
      options.factory,
      options.instance
    ));
  }

  addTransient(name, options = {}) {
    if (name && typeof name === "function" && !options.instance && !options.factory && !options.type) {
      options.type = name;
    } else if (name && typeof options === "function") {
      options.type = options;
    }
    return this.addService(new ServiceDescriptor(
      name,
      ServiceLifetimes.Transient,
      options.type,
      options.factory,
      options.instance
    ));
  }

  addScoped(name, options = {}) {
    if (name && typeof name === "function" && !options.instance && !options.factory && !options.type) {
      options.type = name;
    } else if (name && typeof options === "function") {
      options.type = options;
    }
    return this.addService(new ServiceDescriptor(
      name,
      ServiceLifetimes.Scoped,
      options.type,
      options.factory,
      options.instance
    ));
  }

  _getServiceName(name) {
    var serviceName = null;
    if (name) {
      if (typeof name === "string") {
        serviceName = name;
      } else if (typeof name === "function") {
        serviceName = name.name;
      }
    }
    return serviceName;
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