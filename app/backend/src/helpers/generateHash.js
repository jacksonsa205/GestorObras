const crypto = require("crypto");
const NUMERO_RANDOM = require('./generateNumber');

/** criptografa a senha */
const newhash = crypto
    .createHash("md5")
    .update(NUMERO_RANDOM)
    .digest("hex");

 module.exports = newhash;