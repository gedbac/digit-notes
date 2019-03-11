import { expect } from "chai";
import { Logger } from "amber-notes/infrastructure/logging";
import { ObjectSerializer } from "amber-notes/infrastructure/util";
import { InMemoryEventStore } from "amber-notes/infrastructure/events";
import { EncryptedEventStore, EncryptionOptions, EncryptionService } from "amber-notes/infrastructure/cryptography";

describe("Encrypted Event Store", () => {

  it("should save and get latest snapshot", async () => {
    var snapshot1 = {
      id: "3672ab14-b531-4563-9d77-e0b0ab4e5745",
      createdOn: 1000
    };
    var encryptedEventStore = new EncryptedEventStore(
      new InMemoryEventStore(
        new Logger("InMemoryEventStore")
      ),
      new EncryptionService(
        new ObjectSerializer(),
        new EncryptionOptions({
          privateKey: "fwtyt/x+HBAie1oHzUZ1zLId8EdCuLnoGeS+lj4bplM="
        })
      ),
      new Logger("EncryptedEventStore")
    );
    await encryptedEventStore.open();
    await encryptedEventStore.addSnapshot("foo", snapshot1);
    var snapshot2 = await encryptedEventStore.getLatestSnapshot("foo");
    await encryptedEventStore.close();
    expect(snapshot1.id).to.be.equal(snapshot2.id);
    expect(snapshot1.createdOn).to.be.equal(snapshot2.createdOn);
  });

});