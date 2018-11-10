import { expect } from "chai";
import sinon from "sinon";
import { Event } from "infrastructure-util";

describe("Event", () => {

  it("should attach event handler", () => {
    var target = {};
    Event.attach(target);
    var callback = sinon.spy();
    target.on("changed", callback);
    var args = {};
    target.trigger("changed", args);
    expect(callback.calledWithExactly(args)).to.be.true;
  });

  it("should detach event handler", () => {
    var target = {};
    Event.attach(target);
    var callback = sinon.spy();
    target.on("changed", callback);
    target.off("changed", callback);
    target.trigger("changed");
    expect(callback.notCalled).to.be.true;
  });

  it("should attach event handler and raise only once", () => {
    var target = {};
    Event.attach(target);
    var callback = sinon.spy();
    target.once("changed", callback);
    target.trigger("changed");
    target.trigger("changed");
    expect(callback.callCount).to.be.equals(1);
  });

  it("should throw an error due missing target", () => {
    expect(() => {
      Event.trigger("changed");
    }).throw().with.property("message", "Event's target is not set");
    expect(() => {
      Event.on("changed", () => {});
    }).throw().with.property("message", "Event's target is not set");
    expect(() => {
      Event.off("changed", () => {});
    }).throw().with.property("message", "Event's target is not set");
  });

});