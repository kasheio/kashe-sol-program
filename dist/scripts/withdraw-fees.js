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
dotenv.config();
const web3_js_1 = require("@solana/web3.js");
const id_json_1 = __importDefault(require("/Users/gp/.config/solana/id.json"));
let program;
function withdrawFees(connection, walletkey) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [feeAccount] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("kashe_fee")], program.programId);
            // Get the balance before withdrawal
            const balanceBefore = yield connection.getBalance(feeAccount);
            const receiverBalanceBefore = yield connection.getBalance(walletkey.publicKey);
            console.log("Fee account balance before withdrawal:", balanceBefore / anchor.web3.LAMPORTS_PER_SOL, "SOL");
            console.log("Receiver balance before withdrawal:", receiverBalanceBefore / anchor.web3.LAMPORTS_PER_SOL, "SOL");
            if (balanceBefore === 0) {
                console.log("No fees to withdraw");
                return;
            }
            const txn = yield program.methods
                .withdrawFees()
                .accountsStrict({
                feeAccount,
                receiver: walletkey.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
                .signers([walletkey])
                .rpc({
                commitment: 'confirmed',
                preflightCommitment: 'confirmed'
            });
            console.log("Withdraw fees transaction signature:", txn);
            // Wait for confirmation and add longer delay
            yield connection.confirmTransaction(txn, 'confirmed');
            yield new Promise(resolve => setTimeout(resolve, 15000)); // 5 second delay
            // Get the balance after withdrawal
            const balanceAfter = yield connection.getBalance(feeAccount);
            const receiverBalanceAfter = yield connection.getBalance(walletkey.publicKey);
            console.log("Fee account balance after withdrawal:", balanceAfter / anchor.web3.LAMPORTS_PER_SOL, "SOL");
            console.log("Receiver balance after withdrawal:", receiverBalanceAfter / anchor.web3.LAMPORTS_PER_SOL, "SOL");
            console.log("Amount transferred:", (receiverBalanceAfter - receiverBalanceBefore) / anchor.web3.LAMPORTS_PER_SOL, "SOL");
            console.log("Withdraw complete");
        }
        catch (error) {
            if (error instanceof anchor.web3.SendTransactionError) {
                console.error("Transaction failed:", error.logs);
            }
            else {
                console.error("Error withdrawing fees:", error);
            }
            throw error;
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield withdrawFees(connection, walletkey);
        console.log('done');
    });
}
main();
//# sourceMappingURL=withdraw-fees.js.map