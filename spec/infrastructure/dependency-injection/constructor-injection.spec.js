import { expect } from "chai";
import { ServiceProviderBuilder, ConstructorInjection } from "amber-notes/infrastructure/dependency-injection";

describe("Constructor injection", () => {

  var serviceProviderBuilder = null;

  class FooService {
    constructor(
      /* @param: foo */foo,
      /* @param: bar */bar
    ) {
      this.foo = foo;
      this.bar = bar;
    }
  }

  beforeEach(() => {
    serviceProviderBuilder = new ServiceProviderBuilder();
  });

  afterEach(() => {
    serviceProviderBuilder = null;
  });

  it("should inject to constructor", () => {
    var serviceProvider = serviceProviderBuilder
      .use(new ConstructorInjection())
      .addSingleton("foo", {
        instance: {}
      })
      .addSingleton("bar", {
        instance: {}
      })
      .addSingleton(FooService)
      .build();
    var service = serviceProvider.getService(FooService);
    expect(service).not.to.be.null;
    expect(service.foo).not.to.be.null;
    expect(service.bar).not.to.be.null;
  });

  it("should inject to function", () => {
    function BarService(foo, bar) {
      this.foo = foo;
      this.bar = bar;
    }
    var serviceProvider = serviceProviderBuilder
      .use(new ConstructorInjection())
      .addSingleton("foo", {
        instance: {}
      })
      .addSingleton("bar", {
        instance: {}
      })
      .addSingleton(BarService)
      .build();
    var service = serviceProvider.getService(BarService);
    expect(service).not.to.be.null;
    expect(service.foo).not.to.be.null;
    expect(service.bar).not.to.be.null;
  });

  it("should inject service provider to constructor", () => {
    class BooService {
      constructor(serviceProvider) {
        this.serviceProvider = serviceProvider;
      }
    }
    var serviceProvider = serviceProviderBuilder
      .use(new ConstructorInjection())
      .addSingleton(BooService)
      .build();
    var service = serviceProvider.getService(BooService);
    expect(service).not.to.be.null;
    expect(service.serviceProvider).to.be.equals(serviceProvider);
  });

  it("should detect circular dependencies", () => {
    class Foo {
      constructor(bar) {}
    }
    class Bar {
      constructor(foo) {}
    }
    var serviceProvider = serviceProviderBuilder
      .use(new ConstructorInjection())
      .addSingleton(Foo)
      .addSingleton(Bar)
      .build();
    expect(() => {
      serviceProvider.getService(Foo);
    }).throw().with.property("message", "Can not resolve circular dependency 'Foo'");
  });

});