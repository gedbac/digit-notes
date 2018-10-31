import { expect } from "chai";
import { ServiceProviderFactory, ServiceDescriptor } from "infrastructure-dependency-injection";

class FooService {
  constructor() {}
}

describe("Service Provider", () => {

  var serviceProviderFactory = null;

  beforeEach(() => {
    serviceProviderFactory = new ServiceProviderFactory();
  });

  afterEach(() => {
    serviceProviderFactory = null;
  });

  it("should get singleton service", () => {
    var serviceProvider = serviceProviderFactory
      .addSingleton(FooService)
      .create();
    var service = serviceProvider.getService(FooService);
    expect(service).not.to.be.null;
  });

  it("should get singleton service by name", () => {
    var serviceProvider = serviceProviderFactory
      .addSingleton("foo", FooService)
      .create();
    var service = serviceProvider.getService("foo");
    expect(service).not.to.be.null;
  });

  it("should get singleton service registered as factory", () => {
    var serviceProvider = serviceProviderFactory
      .addSingleton(FooService, {
        factory: () => new FooService()
      })
      .create();
    var service1 = serviceProvider.getService(FooService);
    var service2 = serviceProvider.getService(FooService);
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService(FooService);
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.equals(service3);
    expect(service2).is.equals(service3);
  });

  it("should get singleton service registered as type", () => {
    var serviceProvider = serviceProviderFactory
      .addSingleton(FooService, {
        type: FooService
      })
      .create();
    var service1 = serviceProvider.getService(FooService);
    var service2 = serviceProvider.getService(FooService);
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService(FooService);
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.equals(service3);
    expect(service2).is.equals(service3);
  });

  it("should get singleton service registered as instance", () => {
    var serviceProvider = serviceProviderFactory
      .addSingleton(FooService, {
        instance: new FooService()
      })
      .create();
    var service1 = serviceProvider.getService(FooService);
    var service2 = serviceProvider.getService(FooService);
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService(FooService);
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.equals(service3);
    expect(service2).is.equals(service3);
  });

  it("should get transient service", () => {
    var serviceProvider = serviceProviderFactory
      .addTransient(FooService)
      .create();
    var service = serviceProvider.getService(FooService);
    expect(service).not.to.be.null;
  });

  it("should get transient service by name", () => {
    var serviceProvider = serviceProviderFactory
      .addTransient("foo", FooService)
      .create();
    var service = serviceProvider.getService("foo");
    expect(service).not.to.be.null;
  });

  it("should get transient service registered as factory", () => {
    var serviceProvider  = serviceProviderFactory
      .addTransient(FooService, {
        factory: () => new FooService()
      })
      .create();
    var service1 = serviceProvider.getService(FooService);
    var service2 = serviceProvider.getService(FooService);
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService(FooService);
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.not.equals(service2);
    expect(service1).is.not.equals(service3);
    expect(service2).is.not.equals(service3);
  });

  it("should get transient service registered as type", () => {
    var serviceProvider = serviceProviderFactory
      .addTransient(FooService, {
        type: FooService
      })
      .create();
    var service1 = serviceProvider.getService(FooService);
    var service2 = serviceProvider.getService(FooService);
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService(FooService);
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.not.equals(service2);
    expect(service1).is.not.equals(service3);
    expect(service2).is.not.equals(service3);
  });

  it("should get scoped service", () => {
    var serviceProvider = serviceProviderFactory
      .addScoped(FooService)
      .create();
    var service = serviceProvider.getService(FooService);
    expect(service).not.to.be.null;
  });

  it("should get scoped service by name", () => {
    var serviceProvider = serviceProviderFactory
      .addScoped("foo", FooService)
      .create();
    var service = serviceProvider.getService("foo");
    expect(service).not.to.be.null;
  });

  it("should get scoped service registered as factory", () => {
    var serviceProvider = serviceProviderFactory
      .addScoped(FooService, {
        factory: () => new FooService()
      })
      .create();
    var service1 = serviceProvider.getService(FooService);
    var service2 = serviceProvider.getService(FooService);
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService(FooService);
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.not.equals(service3);
    expect(service2).is.not.equals(service3);
  });

  it("should get scoped service registered as type", () => {
    var serviceProvider = serviceProviderFactory
      .addScoped(FooService, {
        type: FooService
      })
      .create();
    var service1 = serviceProvider.getService(FooService);
    var service2 = serviceProvider.getService(FooService);
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService(FooService);
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.not.equals(service3);
    expect(service2).is.not.equals(service3);
  });

  it("should throw an error due missing service descriptor", () => {
    expect(() => {
      serviceProviderFactory.addService(null);
    })
    .throw().with.property("message", "Service descriptor is null");
  });

  it("should throw an error due missing service name", () => {
    expect(() => {
      serviceProviderFactory.addTransient();
    })
    .throw().with.property("message", "Service name is null");
  });

  it("should throw an error due missing service lifetime", () => {
    expect(() => {
      serviceProviderFactory.addService(new ServiceDescriptor(FooService));
    })
    .throw().with.property("message", "Lifetime of service 'FooService' is null");
  });

  it("should throw an error due invalid lifetime", () => {
    expect(() => {
      serviceProviderFactory.addService(new ServiceDescriptor(FooService, "Foo"));
    })
    .throw().with.property("message", "Lifetime 'Foo' of service 'FooService' is not supported");
  });

  it("should throw an error due provided instance for transient service", () => {
    expect(() => {
      serviceProviderFactory.addTransient(FooService, {
        instance: new FooService()
      });
    })
    .throw().with.property("message", "Instance can't be set for transient service 'FooService'");
  });

  it("should throw an error due provided instance for scoped service", () => {
    expect(() => {
      serviceProviderFactory.addScoped(FooService, {
        instance: new FooService()
      });
    })
    .throw().with.property("message", "Instance can't be set for scoped service 'FooService'");
  });

  it("should throw an error due provided invalid service name", () => {
    expect(() => {
      serviceProviderFactory.addScoped({});
    })
    .throw().with.property("message", "Service name's type is invalid");
  });

  it("should throw an error due not provided type", () => {
    expect(() => {
      serviceProviderFactory.addTransient("foo");
    })
    .throw().with.property("message", "Type of service 'foo' is null");
  });

  it("should throw an error due provided instance and factory at the same time", () => {
    expect(() => {
      serviceProviderFactory.addSingleton("foo", {
        instance: new FooService(),
        factory: () => new FooService()
      });
    })
    .throw().with.property("message", "Instance and factory can't be set at the same time for service 'foo'");
  });

  it("should throw an error due provided instance and type at the same time", () => {
    expect(() => {
      serviceProviderFactory.addSingleton("foo", {
        instance: new FooService(),
        type: FooService
      });
    })
    .throw().with.property("message", "Instance and type can't be set at the same time for service 'foo'");
  });

  it("should throw an error due provided instance and factory at the same time", () => {
    expect(() => {
      serviceProviderFactory.addSingleton("foo", {
        factory: () => new FooService(),
        type: FooService
      });
    })
    .throw().with.property("message", "Factory and type can't be set at the same time for service 'foo'");
  });

});