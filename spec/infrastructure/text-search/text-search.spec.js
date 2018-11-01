import { expect } from "chai";
import { TextSearch, WhitespaceTextAnalyzer } from "infrastructure-text-search";
import { ConsoleLoggerFactory, LogLevels } from "infrastructure-logging";

describe("Text Search", () => {

  it("should find by keywoard", async () => {
    var loggerFactory = new ConsoleLoggerFactory(LogLevels.Information);

    var terms = [];
    var str  = [ "a", "b", "c", "d", "e", "f", "g", "h", "l", "j" ];
    var n = str.length;
    permute(str, 0, n - 1, terms);

    // habcdefg

    var start = Date.now();
    var term = find("jabcdefghl", terms);
    var end = Date.now();
    var took = end - start;

    console.log(`took: ${took}ms`); // 53ms-58ms

    console.log(terms.length);
    console.log(terms[terms.length - 1]);

    expect(term).not.to.be.null;

    var textSearch = new TextSearch({
      logger: loggerFactory.createLogger(TextSearch)
    });

    textSearch.createIndex("myterms", {
      propertyName: "text",
      analyzer: new WhitespaceTextAnalyzer(),
      map: doc => doc.id
    });

    for (var i = 0; i < terms.length; i++) {
      textSearch.put("myterms", {
        id: i,
        text: terms[i]
      },);
    }

    var result = await textSearch.search("myterms", "jabcdefghl");

    expect(result.hits).not.to.be.null;
    expect(result.hits.length).to.be.equal(1);

    console.log(`took: ${result.took}ms`); // 53ms-58ms
  }).timeout(30000);

});

function permute(str, l, r, terms) {
  if (l === r) {
    terms.push(str.join(""));
  } else {
    for (var i = l; i <= r; i++) {
      swap(str, l, i);
      permute(str, l + 1, r, terms);
      swap(str, l, i);
    }
  }
}

function swap(str, i, j) {
  var temp = str[i];
  str[i] = str[j];
  str[j] = temp;
  return str;
}

function find(keyword, terms) {
  for (var term of terms) {
    if (term === keyword) {
      return term;
    }
  }
  return null;
}