import { expect } from "chai";
import { ServiceProviderBuilder, ServiceDescriptor } from "infrastructure-dependency-injection";

class FooService {
  constructor() {}
}

describe("Service Provider", () => {

  var serviceProviderBuilder = null;

  beforeEach(() => {
    serviceProviderBuilder = new ServiceProviderBuilder();
  });

  afterEach(() => {
    serviceProviderBuilder = null;
  });

  it("should get singleton service", () => {
    var serviceProvider = serviceProviderBuilder
      .addSingleton(FooService)
      .build();
    var service = serviceProvider.getService(FooService);
    expect(service).not.to.be.null;
  });

  it("should get singleton service registered as factory", () => {
    var serviceProvider = serviceProviderBuilder
      .addSingleton("foo", {
        factory: () => new FooService()
      })
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.equals(service3);
    expect(service2).is.equals(service3);
  });

  it("should get singleton service registered as factory using short syntax", () => {
    var serviceProvider = serviceProviderBuilder
      .addSingleton("foo", () => new FooService())
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.equals(service3);
    expect(service2).is.equals(service3);
  });

  it("should get singleton service registered as type", () => {
    var serviceProvider = serviceProviderBuilder
      .addSingleton("foo", {
        type: FooService
      })
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.equals(service3);
    expect(service2).is.equals(service3);
  });

  it("should get singleton service registered by type using short syntax", () => {
    var serviceProvider = serviceProviderBuilder
      .addSingleton("foo", FooService)
      .build();
    var service = serviceProvider.getService("foo");
    expect(service).not.to.be.null;
  });

  it("should get singleton service registered as instance", () => {
    var serviceProvider = serviceProviderBuilder
      .addSingleton("foo", {
        instance: new FooService()
      })
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.equals(service3);
    expect(service2).is.equals(service3);
  });

  it("should get singleton service registered as instance using short syntax", () => {
    var serviceProvider = serviceProviderBuilder
      .addSingleton("foo", new FooService())
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.equals(service3);
    expect(service2).is.equals(service3);
  });

  it("should get transient service", () => {
    var serviceProvider = serviceProviderBuilder
      .addTransient(FooService)
      .build();
    var service = serviceProvider.getService(FooService);
    expect(service).not.to.be.null;
  });

  it("should get transient service registered as factory", () => {
    var serviceProvider  = serviceProviderBuilder
      .addTransient("foo", {
        factory: () => new FooService()
      })
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.not.equals(service2);
    expect(service1).is.not.equals(service3);
    expect(service2).is.not.equals(service3);
  });

  it("should get transient service registered as factory using short syntax", () => {
    var serviceProvider  = serviceProviderBuilder
      .addTransient("foo",() => new FooService())
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.not.equals(service2);
    expect(service1).is.not.equals(service3);
    expect(service2).is.not.equals(service3);
  });

  it("should get transient service registered as type", () => {
    var serviceProvider = serviceProviderBuilder
      .addTransient("foo", {
        type: FooService
      })
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.not.equals(service2);
    expect(service1).is.not.equals(service3);
    expect(service2).is.not.equals(service3);
  });

  it("should get transient service registered as type using short syntax", () => {
    var serviceProvider = serviceProviderBuilder
      .addTransient("foo", FooService)
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.not.equals(service2);
    expect(service1).is.not.equals(service3);
    expect(service2).is.not.equals(service3);
  });

  it("should get scoped service", () => {
    var serviceProvider = serviceProviderBuilder
      .addScoped(FooService)
      .build();
    var service = serviceProvider.getService(FooService);
    expect(service).not.to.be.null;
  });

  it("should get scoped service registered as factory", () => {
    var serviceProvider = serviceProviderBuilder
      .addScoped("foo", {
        factory: () => new FooService()
      })
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.not.equals(service3);
    expect(service2).is.not.equals(service3);
  });

  it("should get scoped service registered as factory using short syntax", () => {
    var serviceProvider = serviceProviderBuilder
      .addScoped("foo", () => new FooService())
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.not.equals(service3);
    expect(service2).is.not.equals(service3);
  });

  it("should get scoped service registered as type", () => {
    var serviceProvider = serviceProviderBuilder
      .addScoped("foo", {
        type: FooService
      })
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.not.equals(service3);
    expect(service2).is.not.equals(service3);
  });

  it("should get scoped service registered as type using short syntax", () => {
    var serviceProvider = serviceProviderBuilder
      .addScoped("foo", FooService)
      .build();
    var service1 = serviceProvider.getService("foo");
    var service2 = serviceProvider.getService("foo");
    var scope = serviceProvider.createScope();
    var service3 = scope.serviceProvider.getService("foo");
    expect(service1).not.to.be.null;
    expect(service2).not.to.be.null;
    expect(service3).not.to.be.null;
    expect(service1).is.equals(service2);
    expect(service1).is.not.equals(service3);
    expect(service2).is.not.equals(service3);
  });

  it("should throw an error due missing service descriptor", () => {
    expect(() => {
      serviceProviderBuilder.addService(null);
    }).throw().with.property("message", "Service descriptor is null");
  });

  it("should throw an error due missing service name", () => {
    expect(() => {
      serviceProviderBuilder.addTransient();
    }).throw().with.property("message", "Service name is null");
  });

  it("should throw an error due missing service lifetime", () => {
    expect(() => {
      serviceProviderBuilder.addService(new ServiceDescriptor(FooService));
    }).throw().with.property("message", "Lifetime of service 'FooService' is null");
  });

  it("should throw an error due invalid lifetime", () => {
    expect(() => {
      serviceProviderBuilder.addService(new ServiceDescriptor(FooService, "Foo"));
    }).throw().with.property("message", "Lifetime 'Foo' of service 'FooService' is not supported");
  });

  it("should throw an error due provided instance for transient service", () => {
    expect(() => {
      serviceProviderBuilder.addTransient("foo", {
        instance: new FooService()
      });
    }).throw().with.property("message", "Instance can't be set for transient service 'foo'");
  });

  it("should throw an error due provided instance for scoped service", () => {
    expect(() => {
      serviceProviderBuilder.addScoped("foo", {
        instance: new FooService()
      });
    }).throw().with.property("message", "Instance can't be set for scoped service 'foo'");
  });

  it("should throw an error due provided invalid service name", () => {
    expect(() => {
      serviceProviderBuilder.addScoped({});
    }).throw().with.property("message", "Service name's type is invalid");
  });

  it("should throw an error due not provided type", () => {
    expect(() => {
      serviceProviderBuilder.addTransient("foo");
    }).throw().with.property("message", "Type of service 'foo' is null");
  });

  it("should throw an error due provided instance and factory at the same time", () => {
    expect(() => {
      serviceProviderBuilder.addSingleton("foo", {
        instance: new FooService(),
        factory: () => new FooService()
      });
    }).throw().with.property("message", "Instance and factory can't be set at the same time for service 'foo'");
  });

  it("should throw an error due provided instance and type at the same time", () => {
    expect(() => {
      serviceProviderBuilder.addSingleton("foo", {
        instance: new FooService(),
        type: FooService
      });
    }).throw().with.property("message", "Instance and type can't be set at the same time for service 'foo'");
  });

  it("should throw an error due provided instance and factory at the same time", () => {
    expect(() => {
      serviceProviderBuilder.addSingleton("foo", {
        factory: () => new FooService(),
        type: FooService
      });
    }).throw().with.property("message", "Factory and type can't be set at the same time for service 'foo'");
  });

  it("should get singleton services", () => {
    var service1 = new FooService();
    var service2 = new FooService();
    var serviceProvider = serviceProviderBuilder
      .addSingleton("foo", {
        instance: service1
      })
      .addSingleton("foo", {
        instance: service2
      })
      .build();
    var services = serviceProvider.getServices("foo");
    expect(services).not.to.be.null;
    expect(services.length).to.be.equals(2);
    expect(services).to.include(service1);
    expect(services).to.include(service2);
  });

});