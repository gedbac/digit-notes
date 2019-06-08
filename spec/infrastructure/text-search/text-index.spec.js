import { expect } from "chai";
import { TextIndex, WhitespaceTextAnalyzer } from "d8s/infrastructure/text-search";

describe("Text Index", () => {

  it("should create index", () => {
    var textIndex = new TextIndex("text", new WhitespaceTextAnalyzer());
    var doc = {
      text: "black rabbit"
    };
    textIndex.put(doc);
    expect(textIndex).to.be.not.null;
  });
});
