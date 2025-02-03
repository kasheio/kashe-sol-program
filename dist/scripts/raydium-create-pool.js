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
exports.devConfigs = exports.isValidClmm = void 0;
const dotenv = __importStar(require("dotenv"));
const id_json_1 = __importDefault(require("/Users/gp/.config/solana/id.json"));
// Load environment variables from .env file
dotenv.config();
const anchor = __importStar(require("@coral-xyz/anchor"));
const anchor_1 = require("@coral-xyz/anchor");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const VALID_PROGRAM_ID = new Set([raydium_sdk_v2_1.CLMM_PROGRAM_ID.toBase58(), raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CLMM.toBase58()]);
const isValidClmm = (id) => VALID_PROGRAM_ID.has(id);
exports.isValidClmm = isValidClmm;
exports.devConfigs = [
    {
        id: 'CQYbhr6amxUER4p5SC44C63R4qw4NFc9Z4Db9vF4tZwG',
        index: 0,
        protocolFeeRate: 120000,
        tradeFeeRate: 100,
        tickSpacing: 10,
        fundFeeRate: 40000,
        description: 'Best for very stable pairs',
        defaultRange: 0.005,
        defaultRangePoint: [0.001, 0.003, 0.005, 0.008, 0.01],
    },
    {
        id: 'B9H7TR8PSjJT7nuW2tuPkFC63z7drtMZ4LoCtD7PrCN1',
        index: 1,
        protocolFeeRate: 120000,
        tradeFeeRate: 2500,
        tickSpacing: 60,
        fundFeeRate: 40000,
        description: 'Best for most pairs',
        defaultRange: 0.1,
        defaultRangePoint: [0.01, 0.05, 0.1, 0.2, 0.5],
    },
    {
        id: 'GjLEiquek1Nc2YjcBhufUGFRkaqW1JhaGjsdFd8mys38',
        index: 3,
        protocolFeeRate: 120000,
        tradeFeeRate: 10000,
        tickSpacing: 120,
        fundFeeRate: 40000,
        description: 'Best for exotic pairs',
        defaultRange: 0.1,
        defaultRangePoint: [0.01, 0.05, 0.1, 0.2, 0.5],
    },
    {
        id: 'GVSwm4smQBYcgAJU7qjFHLQBHTc4AdB3F2HbZp6KqKof',
        index: 2,
        protocolFeeRate: 120000,
        tradeFeeRate: 500,
        tickSpacing: 10,
        fundFeeRate: 40000,
        description: 'Best for tighter ranges',
        defaultRange: 0.1,
        defaultRangePoint: [0.01, 0.05, 0.1, 0.2, 0.5],
    },
];
const txVersion = raydium_sdk_v2_1.TxVersion.V0;
function createPool(connection, raydium, quoteToken, baseToken, walletkey, solAmount, tokenAmount) {
    return __awaiter(this, void 0, void 0, function* () {
        var poolId;
        try {
            const quoteAddr = quoteToken.toBase58();
            const baseAddr = baseToken.toBase58();
            // console.log(`Creating Pool - quote: ${quoteAddr}, base: ${baseAddr}`);
            // const solAmountInLamports = solAmount.div(new BN(LAMPORTS_PER_SOL));
            // const tokenAmountInLamports = tokenAmount.div(new BN(LAMPORTS_PER_SOL));
            // console.log(`Amount details:`, {
            //     solAmount: solAmountInLamports.toString(),
            //     tokenAmount: tokenAmountInLamports.toString()
            // });
            const mintA = yield raydium.token.getTokenInfo(quoteAddr);
            const mintB = yield raydium.token.getTokenInfo(baseAddr);
            // console.log(`MintA details: ${JSON.stringify(mintA, null, 2)}`);
            // console.log(`MintB details: ${JSON.stringify(mintB, null, 2)}`);
            const feeConfigs = yield raydium.api.getCpmmConfigs();
            // console.log('Fee configs:', JSON.stringify(feeConfigs[0], null, 2));
            // const ata = await getAssociatedTokenAddress(
            //     baseToken, // Mint address
            //     walletkey.publicKey, // Owner
            //     false, // Allow owner off-curve
            //     TOKEN_2022_PROGRAM_ID // Token program ID
            // );
            // const accountInfo = await connection.getAccountInfo(ata);
            // if (!accountInfo) {
            //     console.log("Associated token account does not exist. Creating...");
            //     const createAtaIx = createAssociatedTokenAccountInstruction(
            //         walletkey.publicKey,
            //         ata,
            //         walletkey.publicKey,
            //         baseToken,
            //         TOKEN_2022_PROGRAM_ID
            //     );
            //     const tx = new anchor.web3.Transaction().add(createAtaIx);
            //     const txId = await anchor.web3.sendAndConfirmTransaction(connection, tx, [walletkey]);
            //     console.log(`Created ATA: ${txId}`);
            // }
            if (raydium.cluster === 'devnet') {
                feeConfigs.forEach((config) => {
                    config.id = (0, raydium_sdk_v2_1.getCpmmPdaAmmConfigId)(raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM, config.index).publicKey.toBase58();
                });
            }
            const { execute, extInfo } = yield raydium.cpmm.createPool({
                programId: raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM,
                poolFeeAccount: raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_FEE_ACC,
                mintA,
                mintB,
                mintAAmount: solAmount,
                mintBAmount: tokenAmount,
                startTime: new anchor_1.BN(0),
                feeConfig: feeConfigs[0],
                associatedOnly: false,
                ownerInfo: {
                    useSOLBalance: true,
                },
                txVersion
            });
            // Get the transaction for simulation
            // const simTx = await execute({ 
            //     simulate: true,
            //     payer: walletkey
            // });
            // Simulate using connection
            // const simulationResponse = await connection.simulateTransaction(simTx.signedTx);
            // if (simulationResponse.value.err) {
            //     console.error("Simulation failed with error:", simulationResponse.value.err);
            //     console.error("Simulation logs:", simulationResponse.value.logs);
            //     throw new Error(`Simulation failed: ${JSON.stringify(simulationResponse.value.err)}`);
            // } else {
            //     console.log("Simulation succeeded. Logs:", simulationResponse.value.logs);
            // }
            const { txId } = yield execute({
                sendAndConfirm: true,
                payer: walletkey // Changed from payer to wallet
            });
            poolId = extInfo.address.poolId.toBase58();
            console.log('Pool created successfully:', {
                txId,
                poolId,
                poolKeys: Object.keys(extInfo.address).reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: extInfo.address[cur].toString() })), {}),
            });
            return poolId;
        }
        catch (error) {
            console.log(JSON.stringify(error));
            // console.error("Pool creation error:", {
            //     error: error,
            //     message: error.message,
            //     name: error.name,
            //     stack: error.stack
            // });
            throw error;
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const secretKey = Uint8Array.from(id_json_1.default);
        const walletkey = web3_js_1.Keypair.fromSecretKey(secretKey);
        const wallet = new anchor.Wallet(walletkey);
        console.log("Address:", wallet.publicKey.toBase58());
        // Create connection using other environment variables
        let cnx = new anchor.web3.Connection(process.env.ANCHOR_PROVIDER_URL || anchor.web3.clusterApiUrl('devnet'));
        // Create provider manually
        const provider = new anchor.AnchorProvider(cnx, wallet, { commitment: 'processed' });
        // Set the provider
        anchor.setProvider(provider);
        let connection = provider.connection;
        // const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(0); // 0 for default account size
        // console.log(`Rent exemption amount: ${rentExemptionAmount / LAMPORTS_PER_SOL} SOL`);
        const cluster = 'devnet';
        const mintAddr = "9DQ3di5nVouVCG8UUbWhoYz4wB6NuTL4ZAHu2if37z7"; //fee13 TOKEN
        const baseToken = new web3_js_1.PublicKey(mintAddr);
        // const tokenAmount = new BN('267 857 142 857 142 87');
        // const tokenAmount = new BN('267857142857142870');
        const tokenAmount = new anchor_1.BN('241071428571428570');
        const solAmount = new anchor_1.BN('3000000000');
        const quoteToken = spl_token_1.NATIVE_MINT;
        // Modified config to include proper wallet format
        const config = {
            owner: walletkey,
            connection: connection,
            cluster,
            disableFeatureCheck: true,
            disableLoadToken: false,
            blockhashCommitment: 'finalized'
        };
        const raydium = yield raydium_sdk_v2_1.Raydium.load(config);
        try {
            const poolId = yield createPool(connection, raydium, quoteToken, baseToken, walletkey, solAmount, tokenAmount);
            console.log(`poolId: ${poolId}`);
        }
        catch (error) {
            console.error("Error details:", {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
            throw error;
        }
        console.log('done');
    });
}
main();
//# sourceMappingURL=raydium-create-pool.js.map