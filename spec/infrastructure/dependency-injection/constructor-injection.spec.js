import { expect } from "chai";
import { ServiceProviderFactory, ConstructorInjection } from "infrastructure-dependency-injection";

describe("Constructor injection", () => {

  var serviceProviderFactory = null;

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
    serviceProviderFactory = new ServiceProviderFactory();
  });

  afterEach(() => {
    serviceProviderFactory = null;
  });

  it("should inject to constructor", () => {
    var serviceProvider = serviceProviderFactory
      .use(new ConstructorInjection())
      .addSingleton("foo", {
        instance: {}
      })
      .addSingleton("bar", {
        instance: {}
      })
      .addSingleton(FooService)
      .create();
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
    var serviceProvider = serviceProviderFactory
      .use(new ConstructorInjection())
      .addSingleton("foo", {
        instance: {}
      })
      .addSingleton("bar", {
        instance: {}
      })
      .addSingleton(BarService)
      .create();
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
    var serviceProvider = serviceProviderFactory
      .use(new ConstructorInjection())
      .addSingleton(BooService)
      .create();
    var service = serviceProvider.getService(BooService);
    expect(service).not.to.be.null;
    expect(service.serviceProvider).to.be.equals(serviceProvider);
  });

});