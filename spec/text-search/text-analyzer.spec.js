import { expect } from "chai";
import { TextAnalyzer } from "text-search";

describe("Text Analyzer", () => {

  it("should analyze text", () => {
    var value = "black rabbit rabbit";
    var textAnalyzer = new TextAnalyzer();
    var terms = textAnalyzer.analyze(value);
    expect(terms.length).is.equal(2);
    expect(terms[0]).to.be.equal("black");
    expect(terms[1]).to.be.equal("rabbit");
  });

  it("should analyze array", () => {
    var value = [ "black", "rabbit", "rabbit" ];
    var textAnalyzer = new TextAnalyzer();
    var terms = textAnalyzer.analyze(value);
    expect(terms.length).is.equal(2);
    expect(terms[0]).to.be.equal("black");
    expect(terms[1]).to.be.equal("rabbit");
  });

});