const bs58 = require('bs58');

// Hex representation of the Program Data Account public key
const hexPubkey = "95b2d964aa5312ecabb16271c9d6f02f37100ada8ad478e5832cbd0993bf0bba";

// Convert hex to a Buffer
const pubkeyBuffer = Buffer.from(hexPubkey, 'hex');

// Encode the buffer to a Base58 string
const base58Pubkey = bs58.encode(pubkeyBuffer);
console.log("Program Data Account:", base58Pubkey);