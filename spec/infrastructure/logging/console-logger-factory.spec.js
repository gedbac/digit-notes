import { expect } from "chai";
import { ConsoleLoggerFactory, LogLevels } from "d8s/infrastructure/logging";

class Foo {}

describe("Console Logger Factory", () => {

  it("should write to log", () => {
    var loggerFactory = new ConsoleLoggerFactory(LogLevels.DEBUG);
    var logger = loggerFactory.createLogger("Spec");
    logger.logDebug("Application started [application=d8s]");
    logger.logInformation("Application started [application=d8s]");
    logger.logWarning("Not found [username=bob, application=d8s]");
    logger.logError("An error has occured [username=bob, application=d8s]");
    logger.logCritical("A critical error has occured [username=bob, application=d8s]");
    expect(logger).to.be.not.null;
  });

  it("should create logger with class name", () => {
    var loggerFactory = new ConsoleLoggerFactory();
    var logger = loggerFactory.createLogger(Foo);
    expect(logger.name).to.be.equal("Foo");
  });

});