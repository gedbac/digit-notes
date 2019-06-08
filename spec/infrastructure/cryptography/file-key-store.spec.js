import { expect } from "chai";
import { Logger } from "d8s/infrastructure/logging";
import { ObjectSerializer } from "d8s/infrastructure/util";
import { FileKeyStore, EncryptionService } from "d8s/infrastructure/cryptography";

describe("File Key Store",  () => {

  it ("should store and load keys from file", async () => {
    const password = "Krq5z4ZHFJDeYtv3";
    const secretName = "my";
    const secretValue = "my-secret";
    var keyStore = new FileKeyStore(
      new EncryptionService(
        new ObjectSerializer()
      ),
      "./",
      new Logger("FileKeyStore")
    );
    keyStore.addSecret(secretName, secretValue);
    await keyStore.store(password);
    var keyStore1 = new FileKeyStore(
      new EncryptionService(
        new ObjectSerializer()
      ),
      "./",
      new Logger("FileKeyStore")
    );
    await keyStore1.load(password);
    var secretValue1 = await keyStore1.getSecret(secretName);
    expect(secretValue1).to.be.equal(secretValue);
  });

});