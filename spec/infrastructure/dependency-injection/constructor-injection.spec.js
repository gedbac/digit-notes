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

  it("should inject via constructor", () => {
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

});