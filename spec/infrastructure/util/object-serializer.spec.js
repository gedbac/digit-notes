import { expect } from "chai";
import { ObjectSerializer } from "d8s/infrastructure/util";

class Person {

  constructor(id, name) {
    this._id = id;
    this._name = name;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

}

describe("ObjectSerializer", () => {

  it("should serialize and deserialize object", async () => {
    var serializer = new ObjectSerializer(
      [[ "Person", Person ]]
    );
    var foo = new Person(1, "Bob");
    var text = serializer.serialize(foo);
    var obj = serializer.deserialize(text);
    expect(obj).to.be.not.null;
    expect(obj).to.be.instanceOf(Person);
  });

});