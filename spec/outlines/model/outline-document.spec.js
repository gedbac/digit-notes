import { expect } from "chai";
import { uuid } from "amber-notes/infrastructure/util";
import { OutlineDocument } from "amber-notes/outlines/model";
import { OutlineDocumentFactory } from "amber-notes/outlines/factories";

describe("Outlines", () => {

  it("should create outline document prefilled with default values", () => {
    var document = new OutlineDocument();
    expect(document.createdOn).to.be.not.null;
    expect(document.modifiedOn).to.be.null;
    expect(document.title).to.be.null;
  });

  it("should create outline document using factory", () => {
    var factory = new OutlineDocumentFactory();
    var document = factory.create();
    expect(document.id).to.be.not.null;
    expect(document.createdOn).to.be.not.null;
    expect(document.uncommittedEvents.length).to.be.equal(1);
    expect(document.uncommittedEvents[0].constructor.name).to.be.equal("OutlineDocumentCreated");
    expect(document.id).to.be.equal(document.uncommittedEvents[0].outlineDocumentId);
    expect(document.createdOn).to.be.equal(document.uncommittedEvents[0].timestamp);
  });

  it("should create outline document and commit changes", () => {
    var factory = new OutlineDocumentFactory();
    var document = factory.create();
    document.commit();
    expect(document.uncommittedEvents.length).to.be.equal(0);
  });

  it("should change outline's document title", () => {
    var document = new OutlineDocument();
    document.title = "My Document";
    expect(document.title).to.be.equal("My Document");
    expect(document.uncommittedEvents.length).to.be.equal(1);
    expect(document.uncommittedEvents[0].constructor.name).to.be.equal("OutlineDocumentTitleChanged");
    expect(document.modifiedOn).to.be.equal(document.uncommittedEvents[0].timestamp);
  });

  it("should mark outline document as deleted", () => {
    var document = new OutlineDocument();
    document.delete();
    expect(document.deleted).to.be.true;
    expect(document.uncommittedEvents.length).to.be.equal(1);
    expect(document.uncommittedEvents[0].constructor.name).to.be.equal("OutlineDocumentDeleted");
    expect(document.modifiedOn).to.be.equal(document.uncommittedEvents[0].timestamp);
  });

  it("should add outlines", () => {
    var document = new OutlineDocument({
      id: uuid
    });
    document.addOutline(uuid(), "text1");
    document.children[0].addOutline(uuid(), "text2");
    expect(document.children.length).to.be.equal(1);
    var outline1 = document.children[0];
    expect(outline1.text).to.be.equal("text1");
    expect(outline1.children.length).to.be.equal(1);
    var outline2 = document.children[0].children[0];
    expect(outline2.text).to.be.equal("text2");
    expect(document.uncommittedEvents.length).to.be.equal(2);
    expect(document.uncommittedEvents[0].constructor.name).to.be.equal("OutlineAdded");
    expect(document.uncommittedEvents[0].outlineDocumentId).to.be.equal(document.id);
    expect(document.uncommittedEvents[0].outlineId).to.be.equal(outline1.id);
    expect(document.uncommittedEvents[0].parentOutlineId).to.be.null;
    expect(document.uncommittedEvents[1].constructor.name).to.be.equal("OutlineAdded");
    expect(document.uncommittedEvents[1].outlineDocumentId).to.be.equal(document.id);
    expect(document.uncommittedEvents[1].outlineId).to.be.equal(outline2.id);
    expect(document.uncommittedEvents[1].parentOutlineId).to.be.equal(outline1.id);
  });

  it("it should remove outlines", () => {
    var document = new OutlineDocument({
      id: uuid,
      children: [{
        id: uuid(),
        children: [{
          id: uuid()
        }]
      }]
    });
    var outline1 = document.children[0];
    var outline2 = document.children[0].children[0];
    outline1.removeOutline(outline2.id);
    document.removeOutline(outline1.id);
    expect(document.children.length).to.be.equal(0);
    expect(document.uncommittedEvents.length).to.be.equal(2);
    expect(document.uncommittedEvents[0].constructor.name).to.be.equal("OutlineRemoved");
    expect(document.uncommittedEvents[0].outlineDocumentId).to.be.equal(document.id);
    expect(document.uncommittedEvents[0].outlineId).to.be.equal(outline2.id);
    expect(document.uncommittedEvents[0].parentOutlineId).to.be.equal(outline1.id);
    expect(document.uncommittedEvents[1].constructor.name).to.be.equal("OutlineRemoved");
    expect(document.uncommittedEvents[1].outlineDocumentId).to.be.equal(document.id);
    expect(document.uncommittedEvents[1].outlineId).to.be.equal(outline1.id);
    expect(document.uncommittedEvents[1].parentOutlineId).to.be.null;
  });

  it("it should change outline text", () => {
    var document = new OutlineDocument({
      id: uuid(),
      children: [{
        id: uuid()
      }]
    });
    document.children[0].text = "text";
    expect(document.children[0].text).to.be.equal("text");
    expect(document.uncommittedEvents.length).to.be.equal(1);
    expect(document.uncommittedEvents[0].constructor.name).to.be.equal("OutlineTextChanged");
    expect(document.uncommittedEvents[0].outlineDocumentId).to.be.equal(document.id);
    expect(document.uncommittedEvents[0].outlineId).to.be.equal(document.children[0].id);
  });

  it("it should change outline notes", () => {
    var document = new OutlineDocument({
      id: uuid(),
      children: [{
        id: uuid()
      }]
    });
    document.children[0].notes = "notes";
    expect(document.children[0].notes).to.be.equal("notes");
    expect(document.uncommittedEvents.length).to.be.equal(1);
    expect(document.uncommittedEvents[0].constructor.name).to.be.equal("OutlineNotesChanged");
    expect(document.uncommittedEvents[0].outlineDocumentId).to.be.equal(document.id);
    expect(document.uncommittedEvents[0].outlineId).to.be.equal(document.children[0].id);
  });

  it("it should complete outline", () => {
    var document = new OutlineDocument({
      id: uuid(),
      children: [{
        id: uuid()
      }]
    });
    document.children[0].complete();
    expect(document.children[0].completed).to.be.true;
    expect(document.uncommittedEvents.length).to.be.equal(1);
    expect(document.uncommittedEvents[0].constructor.name).to.be.equal("OutlineCompleted");
    expect(document.uncommittedEvents[0].outlineDocumentId).to.be.equal(document.id);
    expect(document.uncommittedEvents[0].outlineId).to.be.equal(document.children[0].id);
  });

  it("it should incomplete outline", () => {
    var document = new OutlineDocument({
      id: uuid(),
      children: [{
        id: uuid(),
        completed: true
      }]
    });
    document.children[0].incomplete();
    expect(document.children[0].completed).to.be.false;
    expect(document.uncommittedEvents.length).to.be.equal(1);
    expect(document.uncommittedEvents[0].constructor.name).to.be.equal("OutlineIncompleted");
    expect(document.uncommittedEvents[0].outlineDocumentId).to.be.equal(document.id);
    expect(document.uncommittedEvents[0].outlineId).to.be.equal(document.children[0].id);
  });

  it("it should add tag", () => {
    var document = new OutlineDocument({
      id: uuid(),
      children: [{
        id: uuid()
      }]
    });
    document.children[0].addTag("important");
    expect(document.children[0].tags.includes("important")).to.be.true;
    expect(document.uncommittedEvents.length).to.be.equal(1);
    expect(document.uncommittedEvents[0].constructor.name).to.be.equal("OutlineTagAdded");
    expect(document.uncommittedEvents[0].outlineDocumentId).to.be.equal(document.id);
    expect(document.uncommittedEvents[0].outlineId).to.be.equal(document.children[0].id);
  });

  it("it should remove tag", () => {
    var document = new OutlineDocument({
      id: uuid(),
      children: [{
        id: uuid(),
        tags: [ "important" ]
      }]
    });
    document.children[0].removeTag("important");
    expect(document.children[0].tags.includes("important")).to.be.false;
    expect(document.uncommittedEvents.length).to.be.equal(1);
    expect(document.uncommittedEvents[0].constructor.name).to.be.equal("OutlineTagRemoved");
    expect(document.uncommittedEvents[0].outlineDocumentId).to.be.equal(document.id);
    expect(document.uncommittedEvents[0].outlineId).to.be.equal(document.children[0].id);
  });

});