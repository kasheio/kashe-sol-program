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
const anchor = __importStar(require("@coral-xyz/anchor"));
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
dotenv.config();
const web3_js_2 = require("@solana/web3.js");
const id_json_1 = __importDefault(require("/Users/gp/.config/solana/id.json"));
let program;
function initialize(connection, walletkey) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [globalConfiguration] = web3_js_2.PublicKey.findProgramAddressSync([Buffer.from("global_config")], program.programId);
            const [feeAccount] = web3_js_2.PublicKey.findProgramAddressSync([Buffer.from("kashe_fee")], program.programId);
            // Check if the account already exists
            const accountInfo = yield connection.getAccountInfo(globalConfiguration);
            if (accountInfo !== null) {
                console.log("Global configuration already initialized");
                return;
            }
            const initializeArgu = {
                swapFee: new anchor_1.BN(200),
                bondingCurveLimitation: new anchor_1.BN(40 * web3_js_2.LAMPORTS_PER_SOL),
                bondingCurveSlope: new anchor_1.BN(190 * 1000000),
                authority: walletkey.publicKey
            };
            // Build the transaction
            const txn = yield program.methods
                .initialize(initializeArgu)
                .accountsStrict({
                globalConfiguration,
                feeAccount,
                payer: walletkey.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
                .signers([walletkey])
                .rpc({
                commitment: 'confirmed',
                preflightCommitment: 'confirmed'
            });
            console.log("Initialization transaction signature:", txn);
            // Wait for transaction confirmation
            console.log("Waiting for transaction confirmation...");
            yield connection.confirmTransaction(txn, 'confirmed');
            // Add a small delay to ensure account is fully processed
            yield new Promise(resolve => setTimeout(resolve, 2000));
            // Fetch account with retries
            let configAccount = null;
            let retries = 5;
            while (retries > 0 && configAccount === null) {
                try {
                    configAccount = yield program.account.initializeConfiguration.fetch(globalConfiguration, 'confirmed');
                    console.log("Global configuration:", configAccount);
                    break;
                }
                catch (error) {
                    console.log(`Retrying account fetch... (${retries} attempts remaining)`);
                    yield new Promise(resolve => setTimeout(resolve, 1000));
                    retries--;
                }
                if (retries === 0) {
                    throw new Error("Failed to fetch account after multiple attempts");
                }
            }
        }
        catch (error) {
            if (error instanceof anchor.web3.SendTransactionError) {
                console.error("Transaction failed:", error.logs);
            }
            else {
                console.error("Error initializing:", error);
            }
            throw error;
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // const walletInfoArray = new Uint8Array(walletInfo);
        // const walletkey = Keypair.fromSecretKey(walletInfoArray);
        const walletInfoArray = new Uint8Array(id_json_1.default);
        const walletkey = web3_js_1.Keypair.fromSecretKey(walletInfoArray);
        const wallet = new anchor.Wallet(walletkey);
        console.log("  Address:", wallet.publicKey.toBase58());
        let cnx = new anchor.web3.Connection(process.env.ANCHOR_PROVIDER_URL);
        const provider = new anchor.AnchorProvider(cnx, wallet, { commitment: 'processed' });
        anchor.setProvider(provider);
        let anchor_provider = anchor.getProvider();
        let connection = anchor_provider.connection;
        program = anchor.workspace.Token2022Kashe;
        const [feeAccount] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("kashe_fee")], program.programId);
        console.log(`Fee account: ${feeAccount.toBase58()}`);
        yield initialize(connection, walletkey);
        console.log('done');
    });
}
main();
//# sourceMappingURL=kashe-stage.js.map