import { expect } from "chai";
import { WhitespaceTextAnalyzer } from "amber-notes/infrastructure/text-search";

describe("Whitespace Text Analyzer", () => {

  it("should analyze text", () => {
    var value = "black rabbit rabbit";
    var textAnalyzer = new WhitespaceTextAnalyzer();
    var terms = textAnalyzer.analyze(value);
    expect(terms.length).is.equal(2);
    expect(terms[0]).to.be.equal("black");
    expect(terms[1]).to.be.equal("rabbit");
  });

  it("should analyze array", () => {
    var value = [ "black", "rabbit", "rabbit" ];
    var textAnalyzer = new WhitespaceTextAnalyzer();
    var terms = textAnalyzer.analyze(value);
    expect(terms.length).is.equal(2);
    expect(terms[0]).to.be.equal("black");
    expect(terms[1]).to.be.equal("rabbit");
  });

});