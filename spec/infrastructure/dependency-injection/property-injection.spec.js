import { expect } from "chai";
import { ServiceProviderBuilder, PropertyInjection } from "infrastructure-dependency-injection";

describe("Property injection", () => {

  var serviceProviderBuilder = null;

  class Parent {

    constructor() {
      this._foo = null;
    }

    get foo() {
      return this._foo;
    }

    set foo(value) {
      this._foo = value;
    }

  }

  class Child extends Parent {

    constructor() {
      super();
      this._bar = null;
    }

    get bar() {
      return this._bar;
    }

    set bar(value) {
      this._bar = value;
    }

  }

  beforeEach(() => {
    serviceProviderBuilder = new ServiceProviderBuilder();
  });

  afterEach(() => {
    serviceProviderBuilder = null;
  });

  it("should inject properties", () => {
    var serviceProvider = serviceProviderBuilder
      .use(new PropertyInjection())
      .addSingleton("foo", { instance: {} })
      .addSingleton("bar", { instance: {} })
      .addSingleton(Child)
      .build();
    var service = serviceProvider.getService(Child);
    expect(service).not.to.be.null;
    expect(service.foo).not.to.be.null;
    expect(service.bar).not.to.be.null;
  });

  it("should inject service provider", () => {
    class Foo {

      constructor() {
        this._serviceProvider = null;
      }

      get serviceProvider() {
        return this._serviceProvider;
      }

      set serviceProvider(value) {
        this._serviceProvider = value;
      }

    }
    var serviceProvider = serviceProviderBuilder
      .use(new PropertyInjection())
      .addSingleton(Foo)
      .build();
    var service = serviceProvider.getService(Foo);
    expect(service).not.to.be.null;
    expect(service.serviceProvider).to.be.equals(serviceProvider);
  });

});