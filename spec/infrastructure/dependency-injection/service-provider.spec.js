import { expect } from "chai";
import { ServiceDescriptorCollection, ServiceProvider } from "infrastructure-dependency-injection";
import ServiceDescriptor from "../../../src/infrastructure/dependency-injection/service-descriptor";

class FooService {
  constructor() {}
}

describe("Service Provider", () => {

  var serviceDescriptors = null;

  beforeEach(() => {
    serviceDescriptors = new ServiceDescriptorCollection();
  });

  afterEach(() => {
    serviceDescriptors = null;
  });

  it("should get singleton service", () => {
    serviceDescriptors.addSingleton(FooService);
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
    var service = serviceProvider.getService(FooService);
    expect(service).not.to.be.null;
  });

  it("should get singleton service by name", () => {
    serviceDescriptors.addSingleton("foo", FooService);
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
    var service = serviceProvider.getService("foo");
    expect(service).not.to.be.null;
  });

  it("should get singleton service registered as instance", () => {
    serviceDescriptors.addSingleton(FooService, {
      instance: new FooService()
    });
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
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

  it("should get singleton service registered as factory", () => {
    serviceDescriptors.addSingleton(FooService, {
      factory: () => new FooService()
    });
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
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
    serviceDescriptors.addSingleton(FooService, {
      type: FooService
    });
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
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
    serviceDescriptors.addTransient(FooService);
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
    var service = serviceProvider.getService(FooService);
    expect(service).not.to.be.null;
  });

  it("should get transient service by name", () => {
    serviceDescriptors.addTransient("foo", FooService);
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
    var service = serviceProvider.getService("foo");
    expect(service).not.to.be.null;
  });

  it("should get transient service registered as factory", () => {
    serviceDescriptors.addTransient(FooService, {
      factory: () => new FooService()
    });
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
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
    serviceDescriptors.addTransient(FooService, {
      type: FooService
    });
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
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
    serviceDescriptors.addScoped(FooService);
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
    var service = serviceProvider.getService(FooService);
    expect(service).not.to.be.null;
  });

  it("should get scoped service by name", () => {
    serviceDescriptors.addScoped("foo", FooService);
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
    var service = serviceProvider.getService("foo");
    expect(service).not.to.be.null;
  });

  it("should get scoped service registered as factory", () => {
    serviceDescriptors.addScoped(FooService, {
      factory: () => new FooService()
    });
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
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
    serviceDescriptors.addScoped(FooService, {
      type: FooService
    });
    var serviceProvider = new ServiceProvider({
      serviceDescriptors: serviceDescriptors
    });
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
      serviceDescriptors.add(null);
    })
    .throw().with.property("message", "Service descriptor is null");
  });

  it("should throw an error due missing service name", () => {
    expect(() => {
      serviceDescriptors.addTransient();
    })
    .throw().with.property("message", "Service name is null");
  });

  it("should throw an error due missing service lifetime", () => {
    expect(() => {
      serviceDescriptors.add(new ServiceDescriptor({
        name: FooService
      }));
    })
    .throw().with.property("message", "Lifetime of service 'FooService' is null");
  });

  it("should throw an error due invalid lifetime", () => {
    expect(() => {
      serviceDescriptors.add(new ServiceDescriptor({
        name: FooService,
        lifetime: "Foo"
      }));
    })
    .throw().with.property("message", "Lifetime 'Foo' of service 'FooService' is not supported");
  });

  it("should throw an error due provided instance for transient service", () => {
    expect(() => {
      serviceDescriptors.addTransient(FooService, {
        instance: new FooService()
      });
    })
    .throw().with.property("message", "Instance can't be set for transient service 'FooService'");
  });

  it("should throw an error due provided instance for scoped service", () => {
    expect(() => {
      serviceDescriptors.addScoped(FooService, {
        instance: new FooService()
      });
    })
    .throw().with.property("message", "Instance can't be set for scoped service 'FooService'");
  });

  it("should throw an error due provided invalid service name", () => {
    expect(() => {
      serviceDescriptors.addScoped({});
    })
    .throw().with.property("message", "Service name's type is invalid");
  });

  it("should throw an error due not provided type", () => {
    expect(() => {
      serviceDescriptors.addTransient("foo");
    })
    .throw().with.property("message", "Type of service 'foo' is null");
  });

  it("should throw an error due provided instance and factory at the same time", () => {
    expect(() => {
      serviceDescriptors.addSingleton("foo", {
        instance: new FooService(),
        factory: () => new FooService()
      });
    })
    .throw().with.property("message", "Instance and factory can't be set at the same time for service 'foo'");
  });

  it("should throw an error due provided instance and type at the same time", () => {
    expect(() => {
      serviceDescriptors.addSingleton("foo", {
        instance: new FooService(),
        type: FooService
      });
    })
    .throw().with.property("message", "Instance and type can't be set at the same time for service 'foo'");
  });

  it("should throw an error due provided instance and factory at the same time", () => {
    expect(() => {
      serviceDescriptors.addSingleton("foo", {
        factory: () => new FooService(),
        type: FooService
      });
    })
    .throw().with.property("message", "Factory and type can't be set at the same time for service 'foo'");
  });

});