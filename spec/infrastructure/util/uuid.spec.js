import { expect } from "chai";
import { uuid } from "amber-notes/infrastructure/util";

describe("UUID", () => {

  it("should genereate uuid", () => {
    var id = uuid();
    expect(id).to.be.not.null;
  });

});