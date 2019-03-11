import { expect } from "chai";
import { ObjectSerializer } from "amber-notes/infrastructure/util";
import { EncryptionOptions, EncryptionService } from "amber-notes/infrastructure/cryptography";

describe("Encryption Service",  () => {

  it ("should encrypt and decrypt object", async () => {
    var encryptionService = new EncryptionService(
      new ObjectSerializer(),
      new EncryptionOptions({
        privateKey: "fwtyt/x+HBAie1oHzUZ1zLId8EdCuLnoGeS+lj4bplM="
      })
    );
    var obj1 = { text: "Hello world!" };
    var { chippertext, iv } =  await encryptionService.encrypt(obj1);
    var obj2 = await encryptionService.decrypt(chippertext, iv);
    expect(obj1.text).to.be.equal(obj2.text);
  });

});