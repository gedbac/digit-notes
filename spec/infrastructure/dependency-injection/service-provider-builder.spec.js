import { expect } from "chai";
import { ServiceProviderBuilder} from "d8s/infrastructure/dependency-injection";

describe("Service Provider Builder", () => {

  var serviceProviderBuilder = null;

  beforeEach(() => {
    serviceProviderBuilder = new ServiceProviderBuilder();
  });

  afterEach(() => {
    serviceProviderBuilder = null;
  });

  it("should create service provider", () =>{
    var serviceProvider = serviceProviderBuilder.build();
    expect(serviceProvider).not.to.be.null;
  });

  it("should register module using function", () => {
    serviceProviderBuilder.addModule(x => {
      x.addSingleton("foo", { instance: {} });
    });
    var serviceProvider = serviceProviderBuilder.build();
    var serviceDescriptor = serviceProvider.getService("foo");
    expect(serviceDescriptor).not.to.be.null;
  });

  it("should register module usign configuration object", () => {
    var foo = {
      configure: x => {
        x.addSingleton("foo", { instance: {} });
      }
    };
    serviceProviderBuilder.addModule(foo);
    var serviceProvider = serviceProviderBuilder.build();
    var service = serviceProvider.getService("foo");
    expect(service).not.to.be.null;
  });

  it("should throw an error due missing configuration", () => {
    expect(() => {
      serviceProviderBuilder.addModule();
    }).throw().with.property("message", "Configuration is null");
  });

});