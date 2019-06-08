import { expect } from "chai";
import { IndexedDatabase } from "d8s/infrastructure/data";

describe("Indexed Database", () => {

  var database = null;

  beforeEach(() => {
    database = new IndexedDatabase("foo", 1, db => {
      if (db.version === 1) {
        if (!db.objectStoreNames.contains("bar")) {
          var objectStore = db.createObjectStore("bar", {
            autoIncrement : true
          });
          objectStore.createIndex("boo", "boo", { unique: false });
        }
      }
    });
  });

  afterEach(async () => {
    await IndexedDatabase.deleteDatabase("foo");
  });

  it("should add and iterate over object store", async () => {
    await database.open();
    await database.add("bar", { name: "x1", boo: "x" });
    await database.add("bar", { name: "y1", boo: "y" });
    await database.add("bar", { name: "z1", boo: "z" });
    var list = [];
    await database.forEach("bar", null, null, value => {
      list.push(value);
    });
    await database.close();
    expect(list.length).to.be.equal(3);
    expect(list[0].name).to.be.equal("x1");
    expect(list[1].name).to.be.equal("y1");
    expect(list[2].name).to.be.equal("z1");
  });

  it("should add and iterate over object store with filter", async () => {
    await database.open();
    await database.add("bar", { name: "x1", boo: "x" });
    await database.add("bar", { name: "y1", boo: "y" });
    await database.add("bar", { name: "z1", boo: "z" });
    var list = [];
    await database.forEach("bar", null, IDBKeyRange.only(1), value => {
      list.push(value);
    });
    await database.close();
    expect(list.length).to.be.equal(1);
    expect(list[0].name).to.be.equal("x1");
  });

  it("should add and iterate over index", async () => {
    await database.open();
    await database.add("bar", { name: "x1", boo: "x" });
    await database.add("bar", { name: "y1", boo: "y" });
    await database.add("bar", { name: "z1", boo: "z" });
    var list = [];
    await database.forEach("bar", "boo", null, value => {
      list.push(value);
    });
    await database.close();
    expect(list.length).to.be.equal(3);
    expect(list[0].name).to.be.equal("x1");
    expect(list[1].name).to.be.equal("y1");
    expect(list[2].name).to.be.equal("z1");
  });

  it("should add and iterate over index with filter", async () => {
    await database.open();
    await database.add("bar", { name: "x1", boo: "x" });
    await database.add("bar", { name: "y1", boo: "y" });
    await database.add("bar", { name: "z1", boo: "z" });
    var list = [];
    await database.forEach("bar", "boo", IDBKeyRange.only("y"), value => {
      list.push(value);
    });
    await database.close();
    expect(list.length).to.be.equal(1);
    expect(list[0].name).to.be.equal("y1");
  });

});