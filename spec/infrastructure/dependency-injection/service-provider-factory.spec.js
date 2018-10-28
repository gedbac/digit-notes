import { expect } from "chai";
import { ServiceProviderFactory } from "infrastructure-dependency-injection";

describe("Service Provider Factory", () => {

  var serviceProviderFactory = null;

  beforeEach(() => {
    serviceProviderFactory = new ServiceProviderFactory();
  });

  afterEach(() => {
    serviceProviderFactory = null;
  });

  it("should create service provider", () =>{
    var serviceProvider = serviceProviderFactory.create();
    expect(serviceProvider).not.to.be.null;
  });

  it("should register module using function", () => {
    serviceProviderFactory.use(x => {
      x.addSingleton("foo", { instance: {} });
    });
    var serviceDescriptor = serviceProviderFactory.get("foo");
    expect(serviceDescriptor).not.to.be.null;
  });

  it("should register module usign configuration object", () => {
    var foo = {
      configure: x => {
        x.addSingleton("foo", { instance: {} });
      }
    };
    serviceProviderFactory.use(foo);
    var serviceDescriptor = serviceProviderFactory.get("foo");
    expect(serviceDescriptor).not.to.be.null;
  });

  it("should throw an error due missing configuration", () => {
    expect(() => {
      serviceProviderFactory.use();
    })
    .throw().with.property("message", "Configuration is null");
  });

});