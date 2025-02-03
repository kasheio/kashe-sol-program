"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
// Load environment variables from .env file
dotenv.config();
const anchor = __importStar(require("@coral-xyz/anchor"));
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const mekey_json_1 = __importDefault(require("../tests/keys/mekey.json"));
const user1_json_1 = __importDefault(require("../tests/keys/user1.json"));
const user2_json_1 = __importDefault(require("../tests/keys/user2.json"));
const storage_1 = require("@google-cloud/storage");
const bucketName = process.env.BUCKET;
const storage = new storage_1.Storage({
    keyFilename: `subtle-striker-443420-h0-9ec708d80a59.json`,
    projectId: "subtle-striker-443420-h0"
});
const bucket = storage.bucket(bucketName);
let connection;
let mykey;
let payer;
let feeAccount;
let program;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const walletData = JSON.parse(process.env.ANCHOR_WALLET);
        const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(walletData));
        const wallet = new anchor.Wallet(keypair);
        let cnx = new anchor.web3.Connection(process.env.ANCHOR_PROVIDER_URL || anchor.web3.clusterApiUrl('devnet'));
        const provider = new anchor.AnchorProvider(cnx, wallet, { commitment: 'processed' });
        anchor.setProvider(provider);
        let anchor_provider = anchor.getProvider();
        console.log("anchor_provider: ", anchor_provider);
        connection = anchor_provider.connection;
        console.log("Connected to Solana network:", connection.rpcEndpoint);
        mykey = web3_js_1.Keypair.fromSecretKey(new Uint8Array(mekey_json_1.default));
        payer = web3_js_1.Keypair.fromSecretKey(new Uint8Array(user1_json_1.default));
        feeAccount = web3_js_1.Keypair.fromSecretKey(new Uint8Array(user2_json_1.default));
        console.log("player: ", payer.publicKey.toBase58());
        console.log("feeAccount: ", feeAccount.publicKey.toBase58());
        program = anchor.workspace.Token2022Kashe;
        const poolinfo = yield getPoolInfo();
        console.log('done');
    });
}
function getPoolInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mintAddr = new web3_js_1.PublicKey('FyqXFU9M365dXocrnjvwafG5mvmembBj9EAK2i5o5hc5');
            // Get the bonding curve PDA
            const [bondingCurve] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("bonding_curve"), mintAddr.toBuffer()], program.programId);
            // Get the sol pool PDA
            const [solPool] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("sol_pool"), mintAddr.toBuffer()], program.programId);
            // Get the token pool ATA
            const tokenPool = yield (0, spl_token_1.getAssociatedTokenAddress)(mintAddr, solPool, true, spl_token_1.TOKEN_2022_PROGRAM_ID);
            // Fetch the bonding curve account data
            const bondingCurveAccount = yield program.account.bondingCurve.fetch(bondingCurve);
            // Fetch SOL balance
            const solBalance = yield connection.getBalance(solPool);
            // Fetch token balance
            const tokenAccount = yield connection.getTokenAccountBalance(tokenPool);
            console.log('Bonding Curve Info:');
            console.log('SOL Pool Address:', solPool.toBase58());
            console.log('Token Pool Address:', tokenPool.toBase58());
            console.log('SOL Balance:', solBalance / web3_js_1.LAMPORTS_PER_SOL, 'SOL');
            console.log('Token Balance:', tokenAccount.value.uiAmount);
            console.log('Real SOL Reserves:', bondingCurveAccount.realSolReserves.toString());
            console.log('Real Token Reserves:', bondingCurveAccount.realTokenReserves.toString());
            console.log('Bonding Curve Complete:', bondingCurveAccount.complete);
            console.log('Bonding Curve Creator:', bondingCurveAccount.creator.toBase58());
            return {
                solPool,
                tokenPool,
                solBalance,
                tokenBalance: tokenAccount.value.uiAmount,
                bondingCurveAccount
            };
        }
        catch (error) {
            if (error instanceof anchor.web3.SendTransactionError) {
                console.error("Transaction failed:", error.logs);
            }
            else {
                console.error("Error getting pool info:", error);
            }
            throw error;
        }
    });
}
main();
//# sourceMappingURL=bonding-curve-info.js.map