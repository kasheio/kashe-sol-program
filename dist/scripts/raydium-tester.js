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
exports.createPosition = exports.devConfigs = exports.isValidClmm = void 0;
const dotenv = __importStar(require("dotenv"));
const id_json_1 = __importDefault(require("/Users/gp/.config/solana/id.json"));
// Load environment variables from .env file
dotenv.config();
const anchor = __importStar(require("@coral-xyz/anchor"));
const anchor_1 = require("@coral-xyz/anchor");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const mekey_json_1 = __importDefault(require("../tests/keys/mekey.json"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
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
let connection;
let payer;
function sortMints(mintA, mintB) {
    const comparison = mintA.toBuffer().compare(mintB.toBuffer());
    if (comparison > 0) {
        return [mintB, mintA]; // Swap if mintA > mintB
    }
    return [mintA, mintB];
}
function createPool(raydium, params, owner, tokenAmount, solAmount) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        var poolId;
        try {
            const mintA = yield raydium.token.getTokenInfo(params.quoteToken.toBase58());
            const mintB = yield raydium.token.getTokenInfo(params.baseToken);
            const feeConfigs = yield raydium.api.getCpmmConfigs();
            if (raydium.cluster === 'devnet') {
                feeConfigs.forEach((config) => {
                    config.id = (0, raydium_sdk_v2_1.getCpmmPdaAmmConfigId)(raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM, config.index).publicKey.toBase58();
                });
            }
            const { execute, extInfo } = yield raydium.cpmm.createPool({
                // poolId: // your custom publicKey, default sdk will automatically calculate pda pool id
                programId: raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM, // devnet: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM
                poolFeeAccount: raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_FEE_ACC, // devnet:  DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_FEE_ACC
                mintA,
                mintB,
                mintAAmount: new anchor_1.BN(solAmount),
                mintBAmount: new anchor_1.BN(tokenAmount),
                startTime: new anchor_1.BN(0),
                feeConfig: feeConfigs[0],
                associatedOnly: false,
                ownerInfo: {
                    useSOLBalance: true,
                },
                txVersion,
                // optional: set up priority fee here
                // computeBudgetConfig: {
                //   units: 600000,
                //   microLamports: 46591500,
                // },
            });
            poolId = extInfo.address.poolId.toBase58();
            console.log('PoolId from createPool:', poolId);
            const simulationResult = yield execute({
                simulate: true,
                owner
            });
            console.log('Simulation result:', {
                txId: simulationResult.txId
            });
            if ((_a = simulationResult.value) === null || _a === void 0 ? void 0 : _a.err) {
                throw new Error(`Simulation failed: ${JSON.stringify(simulationResult.value.err)}`);
            }
            const { txId } = yield execute({ sendAndConfirm: true });
            console.log('pool created:', txId);
            console.log('pool created', {
                txId,
                poolKeys: Object.keys(extInfo.address).reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: extInfo.address[cur].toString() })), {}),
            });
            return poolId;
        }
        catch (error) {
            console.error("Detailed error:", {
                error: error,
                message: error.message,
                logs: error.logs, // If available
                details: error.details // If available
            });
            if (((_c = (_b = error === null || error === void 0 ? void 0 : error.InstructionError) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.Custom) === 0) {
                console.log('Pool account already exists');
                return poolId;
            }
            throw error;
        }
    });
}
const createPosition = (connection, payer, raydium, poolId, tokenAmount, solAmount) => __awaiter(void 0, void 0, void 0, function* () {
    let poolInfo;
    let poolKeys;
    try {
        if (raydium.cluster === 'mainnet') {
            const data = yield raydium.api.fetchPoolById({ ids: poolId });
            poolInfo = data[0];
            if (!(0, exports.isValidClmm)(poolInfo.programId))
                throw new Error('target pool is not CLMM pool');
        }
        else {
            const data = yield raydium.clmm.getPoolInfoFromRpc(poolId);
            poolInfo = data.poolInfo;
            poolKeys = data.poolKeys;
        }
        console.log(`Program ID: ${poolInfo.programId}`);
        const [sortedMintA, sortedMintB] = sortMints(new web3_js_1.PublicKey(poolInfo.mintA.address), new web3_js_1.PublicKey(poolInfo.mintB.address));
        const tokenIsMintA = sortedMintB.equals(spl_token_1.NATIVE_MINT_2022);
        console.log('Token is:', tokenIsMintA ? 'MintA' : 'MintB');
        console.log('WSOL is:', tokenIsMintA ? 'MintB' : 'MintA');
        const epochInfo = yield raydium.fetchEpochInfo();
        console.log('Calculating liquidity with SOL amount:', solAmount.toString());
        console.log('Token Amount:', tokenAmount.toString());
        const { tick: lowerTick } = raydium_sdk_v2_1.TickUtils.getPriceAndTick({
            poolInfo,
            price: new decimal_js_1.default(0.0000003),
            baseIn: true,
        });
        const { tick: upperTick } = raydium_sdk_v2_1.TickUtils.getPriceAndTick({
            poolInfo,
            price: new decimal_js_1.default(1),
            baseIn: true,
        });
        // Calculate initial liquidity and amounts
        const { liquidity, amountA, amountB } = (0, raydium_sdk_v2_1.getLiquidityFromAmounts)({
            poolInfo,
            tickLower: lowerTick,
            tickUpper: upperTick,
            amountA: tokenIsMintA ? tokenAmount : solAmount,
            amountB: tokenIsMintA ? solAmount : tokenAmount,
            slippage: 0.01, // 1%
            add: true,
            epochInfo,
            amountHasFee: false
        });
        console.log('Liquidity:', liquidity.toString());
        console.log('AmountA:', amountA.amount.toString());
        console.log('AmountB:', amountB.amount.toString());
        // Then use for openPositionFromLiquidity
        const { execute, signers, instructionTypes, extInfo } = yield raydium.clmm.openPositionFromLiquidity({
            poolInfo,
            poolKeys,
            ownerInfo: {
                useSOLBalance: true
            },
            amountMaxA: amountA.amount,
            amountMaxB: amountB.amount,
            tickLower: lowerTick,
            tickUpper: upperTick,
            liquidity,
            associatedOnly: true,
            withMetadata: 'create',
            // computeBudgetConfig: undefined,
            // txTipConfig: undefined,
            txVersion,
            computeBudgetConfig: {
                units: 400000,
                microLamports: 10000
            }
        });
        const txSignature = yield execute({
            connection,
            signers: [payer, ...signers], // combine your payer with any extra signers returned
            // you can often pass extra options here, e.g. `confirmOptions` or `computeBudgetConfig`
        });
        console.log('clmm position opened txSignature:', { txSignature });
    }
    catch (error) {
        console.error("Detailed error:", {
            error: error,
            message: error.message,
            logs: error.logs,
            details: error.details
        });
        throw error;
    }
});
exports.createPosition = createPosition;
function testSwap(connection, poolId, payer, raydium, inputMint, tokenAmount, solAmount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var poolInfo;
            var poolKeys;
            if (raydium.cluster === 'mainnet') {
                const data = yield raydium.api.fetchPoolById({ ids: poolId });
                poolInfo = data[0];
                if (!(0, exports.isValidClmm)(poolInfo.programId))
                    throw new Error('target pool is not CLMM pool');
            }
            else {
                const data = yield raydium.clmm.getPoolInfoFromRpc(poolId);
                poolInfo = data.poolInfo;
                poolKeys = data.poolKeys;
            }
            let clmmPoolInfo;
            let tickCache;
            const inputAmount = new anchor_1.BN(2);
            if (raydium.cluster === 'mainnet') {
                // note: api doesn't support get devnet pool info, so in devnet else we go rpc method
                // if you wish to get pool info from rpc, also can modify logic to go rpc method directly
                const data = yield raydium.api.fetchPoolById({ ids: poolId });
                poolInfo = data[0];
                if (!(0, exports.isValidClmm)(poolInfo.programId))
                    throw new Error('target pool is not CLMM pool');
                clmmPoolInfo = yield raydium_sdk_v2_1.PoolUtils.fetchComputeClmmInfo({
                    connection: raydium.connection,
                    poolInfo,
                });
                tickCache = yield raydium_sdk_v2_1.PoolUtils.fetchMultiplePoolTickArrays({
                    connection: raydium.connection,
                    poolKeys: [clmmPoolInfo],
                });
            }
            else {
                const data = yield raydium.clmm.getPoolInfoFromRpc(poolId);
                poolInfo = data.poolInfo;
                poolKeys = data.poolKeys;
                clmmPoolInfo = data.computePoolInfo;
                tickCache = data.tickData;
            }
            if (inputMint !== poolInfo.mintA.address && inputMint !== poolInfo.mintB.address)
                throw new Error('input mint does not match pool');
            const baseIn = inputMint === poolInfo.mintB.address;
            const { minAmountOut, remainingAccounts } = yield raydium_sdk_v2_1.PoolUtils.computeAmountOutFormat({
                poolInfo: clmmPoolInfo,
                tickArrayCache: tickCache[poolId],
                amountIn: inputAmount,
                tokenOut: poolInfo[baseIn ? 'mintB' : 'mintA'],
                slippage: 0.01,
                epochInfo: yield raydium.fetchEpochInfo(),
            });
            const { execute } = yield raydium.clmm.swap({
                poolInfo,
                poolKeys,
                inputMint: poolInfo[baseIn ? 'mintA' : 'mintB'].address,
                amountIn: inputAmount,
                amountOutMin: minAmountOut.amount.raw,
                observationId: clmmPoolInfo.observationId,
                ownerInfo: {
                    useSOLBalance: true, // if wish to use existed wsol token account, pass false
                },
                remainingAccounts,
                txVersion,
                // optional: set up priority fee here
                // computeBudgetConfig: {
                //   units: 600000,
                //   microLamports: 465915,
                // },
                // optional: add transfer sol to tip account instruction. e.g sent tip to jito
                // txTipConfig: {
                //   address: new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5'),
                //   amount: new BN(10000000), // 0.01 sol
                // },
            });
            const { txId } = yield execute();
            console.log('swapped in clmm pool txId:', txId);
            // process.exit() // if you don't want to end up node execution, comment this line
        }
        catch (error) {
            console.error("Detailed error:", {
                error: error,
                message: error.message,
                logs: error.logs,
                details: error.details
            });
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
        // Create connection using other environment variables
        let cnx = new anchor.web3.Connection(process.env.ANCHOR_PROVIDER_URL || anchor.web3.clusterApiUrl('devnet'));
        // Create provider manually
        const provider = new anchor.AnchorProvider(cnx, wallet, { commitment: 'processed' });
        // Set the provider
        anchor.setProvider(provider);
        let anchor_provider = anchor.getProvider();
        console.log("anchor_provider: ", anchor_provider);
        connection = anchor_provider.connection;
        console.log("Connected to Solana network:", connection.rpcEndpoint);
        payer = web3_js_1.Keypair.fromSecretKey(new Uint8Array(mekey_json_1.default));
        console.log("payer: ", payer.publicKey.toBase58());
        // wrapSol(connection, payer);
        const program = anchor.workspace.Token2022Kashe;
        const poolLockTime = 0;
        const startTime = Math.floor(Date.now() / 1000) + poolLockTime * 60 * 60;
        const cluster = 'devnet';
        const ft_contract_addr = "3c8bN9oTVCb3PSrYRh9KRgcu2royXYe6hpvnfgq2pm58"; //CHICKEEN TOKEN
        const baseToken = ft_contract_addr;
        const tokenAmount = new anchor_1.BN('100000000000000'); // custom token
        const solAmount = new anchor_1.BN('1000000000'); // WSOL
        const quoteToken = spl_token_1.NATIVE_MINT_2022;
        // const mintPubkey = new PublicKey(ft_contract_addr);
        // SETUP RAYDIUM
        const config = {
            owner: payer,
            connection,
            cluster,
            disableFeatureCheck: true,
            disableLoadToken: false,
            blockhashCommitment: 'finalized'
        };
        const raydium = yield raydium_sdk_v2_1.Raydium.load(config);
        //raydium, params, owner, tokenAmount, solAmount
        const poolId = yield createPool(raydium, {
            baseToken,
            quoteToken,
            startTime,
        }, payer, tokenAmount, solAmount);
        console.log(`poolId: ${poolId}`);
        const testSwapResult = yield testSwap(connection, poolId, payer, raydium, ft_contract_addr, tokenAmount, solAmount);
        const createPositionResult = yield (0, exports.createPosition)(connection, payer, raydium, poolId, tokenAmount, solAmount);
        console.log('done');
    });
}
function transDecoder() {
    return __awaiter(this, void 0, void 0, function* () {
        const base64Tx = "AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNU8CK4bHqQ9sAJ6XW797WFF2yopMosh8RBkktMXIWOjUWL+1GCmO8INv2Cwpta3Wfg6VfYpty4l13Aj5QaWwAgAIABxVFXFuMc3et/b4TrPoUxPuZhRkn0VMDGwapIuV5sJi3RjEIdtRJuc3wZ7FLyzjNVR8TWrpdSpO+X9CQm7AHyvmdUUvz51hJ5zOiWUrrEBrl8cy9aYFIsKbL2O32erigLG305h6yeAmCjXZkdCQaOIuWEBEmK28q7oHeLj8Fq4txifBPufDEojtygv3W3Bh1IT6UrkJQ7NLafn9nKUXXdIQczbYsX+GJmK8d6+3yLreYi6caamj1WgBt+C/tSGM2ZOC0UmsIpROikV8El7XjVEVETi5WzZp9eFJQ0eXEUrra28OIg0I7mMnB2mHNf3CtVmeHxKcpyH7zP5NeV2suhGkXnQvXvdp5MtgRT7++ppTc5MIua1yd96lye7uAK0ILjCDtQf1ES6ifb0TSb9znm/cdBWfoY41M4B5yMj0+2D57wntAtSrWhVTmmM9JzAyjQa7yNIIrsIlb+y5sgX7OrjT1YRGfFzFEUv1qSNQ1H/wrGzX0fw1mutWzT6odvHsWUGJcvg7ZDD31b1ooRtiKv7JkHgDLLWHLO4Yp4uxXl+ndE7dlVsr4m6Qcs1hmf4SJZI4+ZgJv3Ck+I7fUDEYgRg6nAwZGb+UhFzL/7K26csOb57yM5bvF9xJrLEObOkAAAACl1cqeBM9dtZC3FLov4yyxWRM/wcGStyJX/QfTnLBAHsJzpBDzmh14iMUco6VGUnJ5JdUmYvy9vVSA7Oxsk9U/BpuIV/6rgYT7aH9jRhjANdrEOdwa6ztVmKDwAAAAAAHTvcRpHL2fr41YfLbfrwgR+v0bqIKPM+OUlp+zGcaOPQbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzrVLI9FU6q5U2sAfK/hr8y3rEM2XkEdzkH+idzgbQkwcOAAkDgDEhAAAAAAAOAAUCwCcJAA8NABACERIDBAUGExUUFiDpktGOz2hAvAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAABQCAAd8AwAAAEVcW4xzd639vhOs+hTE+5mFGSfRUwMbBqki5XmwmLdGIAAAAAAAAAA1bnJBTk1CZTdUS200cmk0ZDdNWXhXNlY2MXNIVGJ5cfABK1QCAAAApQAAAAAAAAAG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqRMEBxEAFgEBDxQAAAEIAgkKCwwHDQMEFhQTFxUREjtN/65SfR3JLkQ7+f+8xAYAQDD5/7DBBgAAAAAAAAAAAAAAAAAAAAAAAOQLVAIAAACAlvJiAgAAAAEBARMDBwAAAQkBGY8fTDpFImPUE7LNF+vLwaDliHNk5iYaEqgXkuoWWj4AAwMFBw==";
        const txBytes = Buffer.from(base64Tx, "base64");
        // 2. Deserialize as a versioned transaction
        const versionedTx = web3_js_1.VersionedTransaction.deserialize(txBytes);
        // 3. (Optional) Inspect the transaction
        console.log("Versioned Transaction:", versionedTx);
        const transactionID = bytes_1.bs58.encode(versionedTx.signatures[0]);
        console.log('Transaction ID:', transactionID);
        // For instance, you can see the compiled message and its instructions:
        const message = versionedTx.message;
        console.log("Message:", message);
        // Each 'compiledInstruction' references program IDs, accounts, and data
        // by "indexes", which map to the addresses in `message.staticAccountKeys`
        // or dynamic account keys from any lookup tables if used.
        console.log("Compiled Instructions:", message.compiledInstructions);
        // If you want to look up the actual addresses, you might also connect
        // to the cluster (devnet, testnet, mainnet) and fetch the address lookup tables.
        // Example:
        //   const connection = new Connection(clusterApiUrl("devnet"));
        // If your transaction references address lookup tables, you’d also do:
        // await message.resolveAddressTableLookups(connection);
        // Then you’d have all the fully-resolved account keys in:
        // message.staticAccountKeys + message.addressTableLookups
    });
}
// async function wrapSol(connection: Connection, wallet: Keypair): Promise<PublicKey> {
//     try {
//         const newAccount = Keypair.generate();
//         const rent = await connection.getMinimumBalanceForRentExemption(165);
//         const tx = new Transaction().add(
//             SystemProgram.createAccount({
//                 fromPubkey: wallet.publicKey,
//                 newAccountPubkey: newAccount.publicKey,
//                 space: 165,
//                 lamports: rent + 5*LAMPORTS_PER_SOL,
//                 programId: TOKEN_2022_PROGRAM_ID
//             }),
//             createInitializeAccountInstruction(
//                 newAccount.publicKey,
//                 NATIVE_MINT_2022,
//                 wallet.publicKey,
//                 TOKEN_2022_PROGRAM_ID
//             ),
//             createSyncNativeInstruction(
//                 newAccount.publicKey,
//                 TOKEN_2022_PROGRAM_ID
//             )
//         );
//         await sendAndConfirmTransaction(connection, tx, [wallet, newAccount]);
//         return newAccount.publicKey;
//     } catch (error) {
//         console.error("SOL wrap failed:", error);
//         throw error;
//     }
// }
main();
// transDecoder();
//# sourceMappingURL=raydium-tester.js.map