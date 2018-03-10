import { expect } from "chai";
import { Options } from "infrastructure-util";

class Foo {

  constructor() {
    this._foo1 = null;
    this._foo2 = null;
  }

  get foo1() {
    return this._foo1;
  }

  set foo1(value) {
    this._foo1 = value;
  }

  get foo2() {
    return this._foo2;
  }

}

class Bar extends Foo {

  constructor() {
    super();
    this._bar1 = null;
    this._bar2 = null;
  }

  get bar1() {
    return this._bar1;
  }

  set bar1(value) {
    this._bar1 = value;
  }

  get bar2() {
    return this._bar2;
  }
}

describe("Options", () => {

  it("should set classes properties", () => {
    var foo = new Foo();
    Options.apply(foo, {
      foo1: "foo1",
      foo2: "foo2"
    });
    expect(foo.foo1).to.be.equal("foo1");
    expect(foo.foo2).to.be.null;
  });

  it("should set classes with inheritance properties", () => {
    var bar = new Bar();
    Options.apply(bar, {
      foo1: "foo1",
      foo2: "foo2",
      bar1: "bar1",
      bar2: "bar2"
    });
    expect(bar.foo1).to.be.equal("foo1");
    expect(bar.foo2).to.be.null;
    expect(bar.bar1).to.be.equal("bar1");
    expect(bar.bar2).to.be.null;
  });

});