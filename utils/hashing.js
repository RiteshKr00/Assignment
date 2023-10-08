const crypto = require("crypto");
module.exports = () => {
  const randomChars = crypto.randomBytes(6).toString("hex");
  const uniqueKey =
    Date.now().toString(16) + Math.random().toString(16).substring(2, 8);
  //   use timestamp unique identifier to avoid collisions
  const new_Chars = randomChars + uniqueKey;
  //produce a 64-character hexadecimal string that represents the SHA-256 hash of the Random Chars.
  const hash = crypto.createHash("sha256").update(new_Chars).digest("hex");
 
  //   base 64 encoding to convert the hash into a shorter, fixed-length
  const b64 = Buffer.from(hash, "utf8").toString("base64");
  //optimum length is 7
  console.log(b64.substring(0, 7));

  return b64.substring(0, 7);
};
