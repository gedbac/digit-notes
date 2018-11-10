import { expect } from "chai";
import { ServiceProviderFactory, PropertyInjection } from "infrastructure-dependency-injection";

describe("Property injection", () => {

  var serviceProviderFactory = null;

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
    serviceProviderFactory = new ServiceProviderFactory();
  });

  afterEach(() => {
    serviceProviderFactory = null;
  });

  it("should inject properties", () => {
    var serviceProvider = serviceProviderFactory
      .use(new PropertyInjection())
      .addSingleton("foo", { instance: {} })
      .addSingleton("bar", { instance: {} })
      .addSingleton(Child)
      .create();
    var service = serviceProvider.getService(Child);
    expect(service).not.to.be.null;
    expect(service.foo).not.to.be.null;
    expect(service.bar).not.to.be.null;
  });

});