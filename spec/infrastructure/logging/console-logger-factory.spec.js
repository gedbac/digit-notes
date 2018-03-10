import { expect } from "chai";
import { ConsoleLoggerFactory, LogLevels } from "infrastructure-logging";

describe("Console Logger Factory", () => {

  it("should write to log", () => {
    var loggerFactory = new ConsoleLoggerFactory({
      logLevel: LogLevels.Debug
    });
    var logger = loggerFactory.createLogger("Spec");
    logger.logDebug("Application started [application=amber-notes]");
    logger.logInformation("Application started [application=amber-notes]");
    logger.logWarning("Not found [username=bob, application=amber-notes]");
    logger.logError("An error has occured [username=bob, application=amber-notes]");
    logger.logCritical("A critical error has occured [username=bob, application=amber-notes]");
    expect(logger).to.be.not.null;
  });

});