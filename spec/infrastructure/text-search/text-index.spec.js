import { expect } from "chai";
import { TextIndex, WhitespaceTextAnalyzer } from "infrastructure-text-search";

describe("Text Index", () => {

  it("should create index", () => {
    var textIndex = new TextIndex({
      propertyName: "text",
      analyzer: new WhitespaceTextAnalyzer()
    });
    var doc = {
      text: "black rabbit"
    };
    textIndex.put(doc);
    expect(textIndex).to.be.not.null;
  });
});
