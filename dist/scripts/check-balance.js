"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const mekey_json_1 = __importDefault(require("../tests/keys/mekey.json"));
const user1_json_1 = __importDefault(require("../tests/keys/user1.json"));
const user2_json_1 = __importDefault(require("../tests/keys/user2.json"));
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
function checkBalances() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection("https://api.devnet.solana.com", "confirmed");
        // const connection = new Connection("https://fittest-hardworking-asphalt.solana-mainnet.quiknode.pro/5a7cd31f4e42713ec7866178f5447cb665aa662c", "confirmed");
        // const kasheProdUints = bs58.decode("");
        // const kasheProd = Keypair.fromSecretKey(kasheProdUints);
        const idKey = web3_js_1.Keypair.fromSecretKey(new Uint8Array([109, 119, 128, 121, 165, 100, 12, 228, 105, 55, 176, 157, 122, 212, 52, 206, 85, 232, 60, 59, 217, 192, 27, 139, 213, 120, 148, 23, 203, 107, 140, 249, 170, 78, 108, 109, 55, 20, 56, 91, 99, 155, 22, 9, 75, 44, 198, 221, 113, 73, 176, 210, 134, 204, 224, 84, 94, 139, 191, 64, 51, 95, 125, 197]));
        const mykey = web3_js_1.Keypair.fromSecretKey(new Uint8Array(mekey_json_1.default));
        const payer = web3_js_1.Keypair.fromSecretKey(new Uint8Array(user1_json_1.default));
        const feeAccount = web3_js_1.Keypair.fromSecretKey(new Uint8Array(user2_json_1.default));
        // const kasheProdBalance = await connection.getBalance(kasheProd.publicKey);
        const idKeyBalance = yield connection.getBalance(idKey.publicKey);
        const mykeyBalance = yield connection.getBalance(mykey.publicKey);
        const payerBalance = yield connection.getBalance(payer.publicKey);
        const feeAccountBalance = yield connection.getBalance(feeAccount.publicKey);
        //     console.log(Array.from(kasheProdUints));
        // // or for a prettier format:
        //     console.log(JSON.stringify(Array.from(kasheProdUints), null, 2));
        //     console.log("Id wallet (kasheProd):");
        //     console.log("  kasheProdUints:", kasheProdUints);
        //     console.log("  Secret Key:", bs58.encode(kasheProd.secretKey));
        //     console.log("  Address:", kasheProd.publicKey.toBase58());
        //     console.log("  Balance:", kasheProdBalance / LAMPORTS_PER_SOL, "SOL");
        console.log("Id wallet (mykey):");
        console.log("  Secret Key:", bytes_1.bs58.encode(mykey.secretKey));
        console.log("  Address:", idKey.publicKey.toBase58());
        console.log("  Balance:", idKeyBalance / web3_js_1.LAMPORTS_PER_SOL, "SOL");
        console.log("MyKey wallet (mykey):");
        // console.log("  Secret Key:", bs58.encode(mykey.secretKey));
        console.log("  Address:", mykey.publicKey.toBase58());
        console.log("  Balance:", mykeyBalance / web3_js_1.LAMPORTS_PER_SOL, "SOL");
        console.log("Payer wallet (user1):");
        console.log("  Address:", payer.publicKey.toBase58());
        console.log("  Balance:", payerBalance / web3_js_1.LAMPORTS_PER_SOL, "SOL");
        // console.log("  Payer secret key (Base58):", bs58.encode(payer.secretKey));
        console.log("\nFee Account wallet (user2):");
        console.log("  Address:", feeAccount.publicKey.toBase58());
        console.log("  Balance:", feeAccountBalance / web3_js_1.LAMPORTS_PER_SOL, "SOL");
        // console.log("  feeAccount secret key (Base58):", bs58.encode(feeAccount.secretKey));
    });
}
// const privateKeyUint8 = bs58.decode('');
// console.log(privateKeyUint8);
// const keypair = Keypair.fromSecretKey(privateKeyUint8);
checkBalances().catch(console.error);
//# sourceMappingURL=check-balance.js.map