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
    serviceProviderFactory.addModule(x => {
      x.addSingleton("foo", { instance: {} });
    });
    var serviceProvider = serviceProviderFactory.create();
    var serviceDescriptor = serviceProvider.getService("foo");
    expect(serviceDescriptor).not.to.be.null;
  });

  it("should register module usign configuration object", () => {
    var foo = {
      configure: x => {
        x.addSingleton("foo", { instance: {} });
      }
    };
    serviceProviderFactory.addModule(foo);
    var serviceProvider = serviceProviderFactory.create();
    var service = serviceProvider.getService("foo");
    expect(service).not.to.be.null;
  });

  it("should throw an error due missing configuration", () => {
    expect(() => {
      serviceProviderFactory.addModule();
    }).throw().with.property("message", "Configuration is null");
  });

});