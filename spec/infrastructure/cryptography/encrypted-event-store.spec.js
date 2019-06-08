import { expect } from "chai";
import { Logger } from "d8s/infrastructure/logging";
import { ObjectSerializer } from "d8s/infrastructure/util";
import { InMemoryEventStore } from "d8s/infrastructure/events";
import { EncryptedEventStore, EncryptionService } from "d8s/infrastructure/cryptography";

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
      "fwtyt/x+HBAie1oHzUZ1zLId8EdCuLnoGeS+lj4bplM=",
      new EncryptionService(
        new ObjectSerializer()
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