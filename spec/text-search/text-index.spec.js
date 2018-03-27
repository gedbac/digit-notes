import { expect } from "chai";
import { TextIndex, TextAnalyzer } from "text-search";

describe("Text Index", () => {

  it("should create index", () => {
    var textIndex = new TextIndex({
      propertyName: "text",
      analyzer: new TextAnalyzer()
    });
    var doc = {
      text: "black rabbit"
    };
    textIndex.put(doc);
    expect(textIndex).to.be.not.null;
  });
});
