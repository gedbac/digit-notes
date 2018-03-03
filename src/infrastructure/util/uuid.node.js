import crypto from "crypto";

export default function uuid() {
  var uuid = "", r;
  for (var i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += "-";
    } else {
      var buffer = crypto.randomBytes(1);
      r = buffer.readUInt8(0);
      uuid += (i === 14 ? "4" : (i === 19 ? (r & 3 | 8) : r)).toString(16);
    }
  }
  return uuid;
}