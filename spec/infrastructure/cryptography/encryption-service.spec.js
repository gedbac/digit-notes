import { expect } from "chai";
import { ObjectSerializer } from "amber-notes/infrastructure/util";
import { EncryptionService } from "amber-notes/infrastructure/cryptography";

describe("Encryption Service",  () => {

  it ("should encrypt and decrypt object", async () => {
    var encryptionService = new EncryptionService(
      new ObjectSerializer()
    );
    var privateKey = "fwtyt/x+HBAie1oHzUZ1zLId8EdCuLnoGeS+lj4bplM=";
    var obj1 = { text: "Hello world!" };
    var { chippertext, iv } =  await encryptionService.encrypt(obj1, privateKey);
    var obj2 = await encryptionService.decrypt(chippertext, iv, privateKey);
    expect(obj1.text).to.be.equal(obj2.text);
  });

  it ("should compute hash", async () => {
    const password = "Krq5z4ZHFJDeYtv3";
    var encryptionService = new EncryptionService(
      new ObjectSerializer()
    );
    var hash = await encryptionService.computeHash(password);

    expect(hash).to.be.equal("dJqtZxgLdwmlM09uezW97Q0RPljKjwY9Lu0NICsnODY=");
  });

});