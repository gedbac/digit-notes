import { expect } from "chai";
import { ConsoleLoggerFactory, LogLevels } from "amber-notes-infrastructure-logging";

describe("Console Logger Factory", () => {

  it("should write to log", () => {
    var loggerFactory = new ConsoleLoggerFactory({
      logLevel: LogLevels.Debug
    });
    var logger = loggerFactory.createLogger("log");
    expect(logger).to.be.not.null;
  });

});