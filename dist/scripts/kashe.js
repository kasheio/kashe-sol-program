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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const anchor_1 = require("@coral-xyz/anchor");
const bytes_1 = require("@coral-xyz/anchor/dist/cjs/utils/bytes");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const spl_token_metadata_1 = require("@solana/spl-token-metadata");
const mekey_json_1 = __importDefault(require("../tests/keys/mekey.json"));
const user1_json_1 = __importDefault(require("../tests/keys/user1.json"));
const user2_json_1 = __importDefault(require("../tests/keys/user2.json"));
const storage_1 = require("@google-cloud/storage");
const uuid_1 = require("uuid");
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
let mintAddr;
let userNativeAta;
let userAta;
function airdrop(publicKey, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 1 - Request Airdrop
            const signature = yield connection.requestAirdrop(publicKey, amount);
            // 2 - Fetch the latest blockhash
            const { blockhash, lastValidBlockHeight } = yield connection.getLatestBlockhash();
            // 3 - Confirm transaction success
            yield connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature,
            });
        }
        catch (error) {
            console.error("Error getting airdrop:", error);
            throw error;
        }
    });
}
function requestAirdrop() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const airdropAmount = Math.pow(10, 11);
            console.log(`Requesting airdrop to admin for 1 SOL : ${payer.publicKey.toBase58()}`);
            yield airdrop(mykey.publicKey, airdropAmount);
            yield airdrop(payer.publicKey, airdropAmount);
            yield airdrop(feeAccount.publicKey, airdropAmount);
            const adminBalance = (yield connection.getBalance(feeAccount.publicKey)) / Math.pow(10, 9);
            console.log("admin wallet balance : ", adminBalance, "SOL");
        }
        catch (error) {
            console.error("Error requesting airdrop:", error);
            throw error;
        }
    });
}
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [globalConfiguration] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("global_config")], program.programId);
            const [feeAccount] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("kashe_fee")], program.programId);
            // Check if the account already exists
            const accountInfo = yield connection.getAccountInfo(globalConfiguration);
            if (accountInfo !== null) {
                console.log("Global configuration already initialized");
                return;
            }
            const initializeArgu = {
                swapFee: new anchor_1.BN(200),
                bondingCurveLimitation: new anchor_1.BN(2 * web3_js_1.LAMPORTS_PER_SOL),
                bondingCurveSlope: new anchor_1.BN(190 * 1000000)
            };
            // Build the transaction
            const txn = yield program.methods
                .initialize(initializeArgu)
                .accountsStrict({
                globalConfiguration,
                feeAccount,
                payer: payer.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
                .signers([payer])
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
function tokenMint() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            userNativeAta = yield (0, spl_token_1.getAssociatedTokenAddress)(spl_token_1.NATIVE_MINT, payer.publicKey);
            console.log(userNativeAta);
            mintAddr = web3_js_1.Keypair.generate();
            const mintsig = yield (0, spl_token_1.createMint)(connection, payer, payer.publicKey, null, 9, mintAddr, { commitment: "finalized" }, spl_token_1.TOKEN_2022_PROGRAM_ID);
            console.log(mintsig.toBase58());
            // Create an ATA for the payer to hold the minted token
            userAta = yield (0, spl_token_1.createAssociatedTokenAccount)(connection, payer, mintAddr.publicKey, payer.publicKey, { commitment: "finalized" }, spl_token_1.TOKEN_2022_PROGRAM_ID);
            console.log("userAta: ", userAta);
            // Mint some tokens to the ATA of the payer
            const mintto_sig = yield (0, spl_token_1.mintTo)(connection, payer, mintAddr.publicKey, userAta, payer, Math.pow(10, 15), [], { commitment: "finalized" }, spl_token_1.TOKEN_2022_PROGRAM_ID);
            console.log(mintto_sig);
        }
        catch (error) {
            console.error("Error in tokenMint:", error);
            throw error;
        }
    });
}
function createPool() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [globalConfiguration] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("global_config")], program.programId);
            const [bondingCurve] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("bonding_curve"), mintAddr.publicKey.toBuffer()], program.programId);
            const [solPool] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("sol_pool"), mintAddr.publicKey.toBuffer()], program.programId);
            const tokenPool = yield (0, spl_token_1.getAssociatedTokenAddress)(mintAddr.publicKey, solPool, true, spl_token_1.TOKEN_2022_PROGRAM_ID);
            console.log(mintAddr.publicKey.toBase58());
            console.log({
                globalConfiguration: globalConfiguration,
                bondingCurve: bondingCurve,
                mintAddr: mintAddr.publicKey,
                userAta: userAta,
                solPool: solPool,
                tokenPool: tokenPool,
                feeAccount: feeAccount,
                tokenProgram: spl_token_1.TOKEN_2022_PROGRAM_ID,
            });
            // Add your test here.
            const tx = yield program.methods
                .createPool(new anchor_1.BN(Math.pow(10, 7))) //   create Pool Fee 0.01 sol
                .accounts({
                globalConfiguration: globalConfiguration,
                bondingCurve: bondingCurve,
                mintAddr: mintAddr.publicKey,
                userAta: userAta,
                solPool: solPool,
                tokenPool: tokenPool,
                feeAccount: feeAccount.publicKey,
                tokenProgram: spl_token_1.TOKEN_2022_PROGRAM_ID,
                associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
            })
                .signers([payer])
                .transaction();
            tx.feePayer = payer.publicKey;
            tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
            console.log(yield connection.simulateTransaction(tx));
            const sig = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, tx, [payer]);
            console.log(sig);
        }
        catch (error) {
            console.error("Error in createPool:", error);
            throw error;
        }
    });
}
function addLiquidity() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [globalConfiguration] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("global_config")], program.programId);
            const [bondingCurve] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("bonding_curve"), mintAddr.publicKey.toBuffer()], program.programId);
            const [solPool] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("sol_pool"), mintAddr.publicKey.toBuffer()], program.programId);
            const tokenPool = yield (0, spl_token_1.getAssociatedTokenAddress)(mintAddr.publicKey, solPool, true, spl_token_1.TOKEN_2022_PROGRAM_ID);
            console.log('Global Configuration:', globalConfiguration.toBase58());
            console.log('Bonding Curve:', bondingCurve.toBase58());
            console.log('Mint Address:', mintAddr.publicKey.toBase58());
            console.log('User ATA:', userAta.toBase58());
            console.log('SOL Pool:', solPool.toBase58());
            console.log('Token Pool:', tokenPool.toBase58());
            const mintAddrBalance = yield connection.getBalance(mintAddr.publicKey);
            const userAtaBalance = yield connection.getBalance(userAta);
            const solPoolBalance = yield connection.getBalance(solPool);
            const tokenPoolBalance = yield connection.getBalance(tokenPool);
            console.log('Mint Address Balance:', mintAddrBalance);
            console.log('User ATA Balance:', userAtaBalance);
            console.log('SOL Pool Balance:', solPoolBalance);
            console.log('Token Pool Balance:', tokenPoolBalance);
            // Add your test here.
            const tx = yield program.methods
                .addLiquidity(new anchor_1.BN(5 * Math.pow(10, 13))) //   token deposit
                .accounts({
                globalConfiguration: globalConfiguration,
                bondingCurve: bondingCurve,
                mintAddr: mintAddr.publicKey,
                userAta: userAta,
                solPool: solPool,
                tokenPool: tokenPool,
                tokenProgram: spl_token_1.TOKEN_2022_PROGRAM_ID,
            })
                .signers([payer])
                .transaction();
            tx.feePayer = payer.publicKey;
            tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
            const simulationResult = yield connection.simulateTransaction(tx);
            console.log('Simulation Result:', JSON.stringify(simulationResult, null, 2));
            if (simulationResult.value.err) {
                console.error('Transaction simulation failed:', simulationResult.value.err);
                throw new Error('Transaction simulation failed');
            }
            const sig = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, tx, [payer]);
            console.log(sig);
            console.log("Init Configure : ", yield program.account.initializeConfiguration.fetch(globalConfiguration));
            console.log("Bonding Curve : ", yield program.account.bondingCurve.fetch(bondingCurve));
        }
        catch (error) {
            console.error("Error in addLiquidity:", error);
            throw error;
        }
    });
}
// async function buy() {
//     try{
//         const [globalConfiguration] = PublicKey.findProgramAddressSync(
//             [Buffer.from("global_config")],
//             program.programId
//           );
//           const [bondingCurve] = PublicKey.findProgramAddressSync(
//             [Buffer.from("bonding_curve"), mintAddr.publicKey.toBuffer()],
//             program.programId
//           );
//           const [solPool] = PublicKey.findProgramAddressSync(
//             [Buffer.from("sol_pool"), mintAddr.publicKey.toBuffer()],
//             program.programId
//           );
//           // await airdrop(solPool, 10 ** 11);
//           const tokenPool = await getAssociatedTokenAddress(
//             mintAddr.publicKey,
//             solPool,
//             true,
//             TOKEN_2022_PROGRAM_ID
//           );
//           const bunding = await program.account.bondingCurve.fetch(bondingCurve);
//           const price = bunding.virtualSolReserves.div(bunding.virtualTokenReserves);
//           console.log(
//             await program.account.initializeConfiguration.fetch(globalConfiguration)
//           );
//           console.log(
//             "bunding == > ",
//             bunding.virtualSolReserves,
//             bunding.virtualTokenReserves
//           );
//           console.log("bunding == > ", price);
//           console.log(solPool);
//           // Add your test here.
//           const tx = await program.methods
//             .buy(new BN(2 * 10 ** 8)) //   buy 0.1 sol
//             .accounts({
//               globalConfiguration: globalConfiguration,
//               bondingCurve: bondingCurve,
//               mintAddr: mintAddr.publicKey,
//               userAta: userAta,
//               solPool: solPool,
//               tokenPool: tokenPool,
//               feeAccount: feeAccount.publicKey,
//               tokenProgram: TOKEN_2022_PROGRAM_ID,
//             } as any)
//             .signers([payer])
//             .transaction();
//           tx.feePayer = payer.publicKey;
//           tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
//           console.log(await connection.simulateTransaction(tx));
//           const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
//           console.log(sig);
//     }catch (error) {
//         console.error("Error in buy:", error);
//         throw error;
//     }
// }
// async function sell() {
//     try{
//         const [globalConfiguration] = PublicKey.findProgramAddressSync(
//             [Buffer.from("global_config")],
//             program.programId
//           );
//           const [bondingCurve] = PublicKey.findProgramAddressSync(
//             [Buffer.from("bonding_curve"), mintAddr.publicKey.toBuffer()],
//             program.programId
//           );
//           const [solPool] = PublicKey.findProgramAddressSync(
//             [Buffer.from("sol_pool"), mintAddr.publicKey.toBuffer()],
//             program.programId
//           );
//           const tokenPool = await getAssociatedTokenAddress(
//             mintAddr.publicKey,
//             solPool,
//             true,
//             TOKEN_2022_PROGRAM_ID
//           );
//           const bunding = await program.account.bondingCurve.fetch(bondingCurve);
//           const price = bunding.virtualSolReserves.div(bunding.virtualTokenReserves);
//           console.log(
//             "bunding == > ",
//             bunding.virtualSolReserves,
//             bunding.virtualTokenReserves
//           );
//           console.log("bunding == > ", price);
//           // Add your test here.
//           const tx = await program.methods
//             .sell(new BN(10 ** 8)) //   sell 0.1 token
//             .accounts({
//               globalConfiguration: globalConfiguration,
//               bondingCurve: bondingCurve,
//               mintAddr: mintAddr.publicKey,
//               userAta: userAta,
//               solPool: solPool,
//               tokenPool: tokenPool,
//               feeAccount: feeAccount.publicKey,
//               tokenProgram: TOKEN_2022_PROGRAM_ID,
//             } as any)
//             .signers([payer])
//             .transaction();
//           tx.feePayer = payer.publicKey;
//           tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
//           console.log(await connection.simulateTransaction(tx));
//           const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
//           console.log(sig);
//     }catch (error) {
//         console.error("Error in sell:", error);
//         throw error;
//     }
// }
// async function removeLiquidity() {
//     try{
//         userNativeAta = await getAssociatedTokenAddress(
//             NATIVE_MINT,
//             payer.publicKey
//           );
//           const [globalConfiguration] = PublicKey.findProgramAddressSync(
//             [Buffer.from("global_config")],
//             program.programId
//           );
//           const [bondingCurve] = PublicKey.findProgramAddressSync(
//             [Buffer.from("bonding_curve"), mintAddr.publicKey.toBuffer()],
//             program.programId
//           );
//           const [solPool] = PublicKey.findProgramAddressSync(
//             [Buffer.from("sol_pool"), mintAddr.publicKey.toBuffer()],
//             program.programId
//           );
//           const tokenPool = await getAssociatedTokenAddress(
//             mintAddr.publicKey,
//             solPool,
//             true,
//             TOKEN_2022_PROGRAM_ID
//           );
//           console.log("solPool : ", solPool);
//           console.log("tokenPool : ", tokenPool);
//           //  coin mint address
//           const tx = await program.methods
//             .removeLiquidity()
//             .accounts({
//               globalConfiguration: globalConfiguration,
//               bondingCurve: bondingCurve,
//               ammCoinMint: mintAddr.publicKey,
//               solPool: solPool,
//               tokenPool: tokenPool,
//               userTokenCoin: userAta,
//               userTokenPc: userNativeAta,
//               userWallet: payer.publicKey,
//               tokenProgram: TOKEN_2022_PROGRAM_ID,
//               splTokenProgram: TOKEN_PROGRAM_ID,
//               associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
//               systemProgram: SYSTEM_PROGRAM_ID,
//               sysvarRent: SYSVAR_RENT_PUBKEY,
//             } as any)
//             .preInstructions([
//               ComputeBudgetProgram.setComputeUnitLimit({
//                 units: 1_000_000,
//               }),
//             ])
//             .signers([payer])
//             .transaction();
//           tx.feePayer = payer.publicKey;
//           tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
//           console.log(await connection.simulateTransaction(tx));
//           const sig = await sendAndConfirmTransaction(connection, tx, [payer], {
//             skipPreflight: true,
//           });
//           console.log("Successfully Removed liquidity : ", sig);
//     }catch (error) {
//         console.error("Error in removeLiquidity:", error);
//         throw error;
//     }
// }
// async function publishIdl() {
//   let anchor_provider = anchor.getProvider();
//   // Enhanced logging for connection details
//   console.log("Connection Endpoint:", anchor_provider.connection.rpcEndpoint);
//   console.log("Payer Public Key:", payer.publicKey.toBase58());
//   // Load the IDL
//   const idlPath = path.join(__dirname, "../../target/idl/token_2022_kashe.json");
//   const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
//   // Get the program ID
//   const programId = new anchor.web3.PublicKey("EJX3Gyp9K23mpVNXG9PYmd3Yw9cpHGmKK6YPLLMM2dy");
//   // Create the IDL account
//   const [idlPda] = anchor.web3.PublicKey.findProgramAddressSync(
//     [Buffer.from("idl"), programId.toBuffer()],
//     new anchor.web3.PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
//   );
//   let tx;
//   try {
//     // Enhanced network connectivity check
//     console.log("Connection Endpoint:", anchor_provider.connection.rpcEndpoint);
//     console.log("Attempting to get payer balance...");
//     let payerBalance;
//     try {
//       payerBalance = await anchor_provider.connection.getBalance(payer.publicKey);
//       console.log("Payer Balance:", payerBalance / LAMPORTS_PER_SOL, "SOL");
//     } catch (balanceError) {
//       console.error("Failed to get payer balance:", balanceError);
//       // Additional network diagnostics
//       try {
//         // Check if we can get the latest blockhash as a network connectivity test
//         const { blockhash } = await anchor_provider.connection.getLatestBlockhash('confirmed');
//         console.log("Blockhash retrieved successfully:", blockhash);
//       } catch (blockhashError) {
//         console.error("Network connectivity issue:", blockhashError);
//       }
//       // Attempt to use a fallback RPC endpoint if available
//       const fallbackEndpoints = [
//         'https://api.mainnet-beta.solana.com',
//         'https://api.devnet.solana.com',
//         'https://api.testnet.solana.com'
//       ];
//       for (const endpoint of fallbackEndpoints) {
//         try {
//           console.log(`Attempting to connect to fallback endpoint: ${endpoint}`);
//           const fallbackConnection = new anchor.web3.Connection(endpoint, 'confirmed');
//           payerBalance = await fallbackConnection.getBalance(payer.publicKey);
//           console.log(`Successfully retrieved balance from ${endpoint}`);
//           console.log("Fallback Payer Balance:", payerBalance / LAMPORTS_PER_SOL, "SOL");
//           break;
//         } catch (fallbackError) {
//           console.error(`Failed to connect to ${endpoint}:`, fallbackError);
//         }
//       }
//       // If no balance could be retrieved, throw the original error
//       if (payerBalance === undefined) {
//         throw balanceError;
//       }
//     }
//     // Prepare the transaction
//     const tx = new anchor.web3.Transaction().add(
//       anchor.web3.SystemProgram.createAccount({
//         fromPubkey: payer.publicKey,
//         newAccountPubkey: idlPda,
//         space: Buffer.byteLength(JSON.stringify(idl)),
//         lamports: await anchor_provider.connection.getMinimumBalanceForRentExemption(
//           Buffer.byteLength(JSON.stringify(idl))
//         ),
//         programId: new anchor.web3.PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
//       })
//     );
//     // Set recent blockhash to ensure transaction validity
//     tx.recentBlockhash = (await anchor_provider.connection.getLatestBlockhash()).blockhash;
//     tx.feePayer = payer.publicKey;
//     // Rest of the transaction preparation and sending logic...
//   } catch (error) {
//     console.error("Transaction Preparation Error:", error);
//     throw error;
//   }
//   // Write the IDL to the account
//   const instruction = new anchor.web3.TransactionInstruction({
//     keys: [
//       { pubkey: idlPda, isSigner: false, isWritable: true },
//       { pubkey: payer.publicKey, isSigner: true, isWritable: false }
//     ],
//     programId: new anchor.web3.PublicKey("BPFLoaderUpgradeab1e11111111111111111111111"),
//     data: Buffer.from(JSON.stringify(idl))
//   });
//   tx.add(instruction);
//   try {
//     // Send the transaction with comprehensive error handling
//     const txSig = await anchor_provider.connection.sendTransaction(tx, [payer], { 
//       skipPreflight: false,  // Enable preflight checks
//       preflightCommitment: 'confirmed'  // Set preflight commitment level
//     });
//     console.log("Transaction Signature:", txSig);
//     // Wait for confirmation with timeout
//     const confirmationResponse = await Promise.race([
//       anchor_provider.connection.confirmTransaction(txSig, 'confirmed'),
//       new Promise((_, reject) => 
//         setTimeout(() => reject(new Error('Transaction confirmation timed out')), 30000)
//       )
//     ]);
//     // Type-safe error checking with explicit type guard
//     const isConfirmationResponse = (obj: unknown): obj is { value: { err: any } } => {
//       return (
//         typeof obj === 'object' && 
//         obj !== null && 
//         'value' in obj && 
//         typeof (obj as any).value === 'object'
//       );
//     };
//     if (isConfirmationResponse(confirmationResponse)) {
//       if (confirmationResponse.value.err) {
//         console.error("Transaction Confirmation Error:", confirmationResponse.value.err);
//         throw new Error("Transaction failed");
//       }
//     } else {
//       console.error("Unexpected confirmation response:", confirmationResponse);
//       throw new Error("Invalid transaction confirmation");
//     }
//     console.log("IDL Published Successfully:", txSig);
//   } catch (error) {
//     console.error("Transaction Sending Error:", error);
//     throw error;
//   }
// }
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // let anchor_provider_env = anchor.AnchorProvider.env();
        // console.log("anchor_provider_env.wallet.publicKey.toBase58()", anchor_provider_env.wallet.publicKey.toBase58());    
        // // console.log("anchor_provider_env.publicKey.toBase58()", anchor_provider_env.publicKey.toBase58());    
        // anchor.setProvider(anchor_provider_env);
        // let anchor_provider = anchor.getProvider();
        // // console.log("anchor_provider: ", anchor_provider);
        // connection = anchor_provider.connection;
        const walletData = JSON.parse(process.env.ANCHOR_WALLET);
        const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(walletData));
        const wallet = new anchor.Wallet(keypair);
        // Create connection using other environment variables
        let cnx = new anchor.web3.Connection(process.env.ANCHOR_PROVIDER_URL || anchor.web3.clusterApiUrl('devnet'));
        // Create provider manually
        const provider = new anchor.AnchorProvider(cnx, wallet, { commitment: 'processed' } // or whatever options you need
        );
        // Set the provider
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
        // await publishIdl();
        // await requestAirdrop();
        // await airdrop(new PublicKey('5fkp8siwumxpGxH2UnrNVCGzwEr7aYn7qqXzkfVKYeaZ'),1);
        yield initialize();
        // await tokenMint();
        // console.log("mintAddr: ", bs58.encode(mintAddr.secretKey));
        // console.log("userAta: ", userAta.toBase58());
        // console.log("userNativeAta: ", userNativeAta.toBase58());
        // mintAddr = Keypair.fromSecretKey(
        //     bs58.decode(
        //         "3EqrSSF96KMj5aYjMVH44mH6br4d7RMoG2tC3hhPuLAJcjo3mYUEtdn42md4Krt8WQkD1iTfXNptuh1hXwq1nNis"
        //     )
        // );
        // userAta = new PublicKey(
        //     "9QSXaK9Xbh5HYVZQe8VCsxA7vaFnsNDktaRN9faQNwG9"
        // );
        // userNativeAta = new PublicKey(
        //     "2PJXikmzkd6jz5bsDeTCVN2SYuZihfhKAsGCoRRuLJ4U"
        // );
        // await createPool();
        // await addLiquidity();
        // await buy();
        // await sell();
        // await removeLiquidity();
        console.log('done');
    });
}
function tokenMintKashe(name, symbol, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            // METADATA START
            let transaction;
            let transactionSignature;
            // Generate new keypair for Mint Account
            let mintAddr = web3_js_1.Keypair.generate();
            const mint = mintAddr.publicKey;
            const decimals = 9;
            const mintAuthority = payer.publicKey;
            const updateAuthority = payer.publicKey;
            const metaData = {
                mint: mint,
                name: name,
                symbol: symbol,
                uri: uri,
                additionalMetadata: [["description", "A Kashe Token"]],
            };
            const metadataExtension = spl_token_1.TYPE_SIZE + spl_token_1.LENGTH_SIZE;
            const metadataLen = (0, spl_token_metadata_1.pack)(metaData).length;
            const mintLen = (0, spl_token_1.getMintLen)([spl_token_1.ExtensionType.MetadataPointer]);
            const lamports = yield connection.getMinimumBalanceForRentExemption(mintLen + metadataExtension + metadataLen);
            const createAccountInstruction = web3_js_1.SystemProgram.createAccount({
                fromPubkey: payer.publicKey,
                newAccountPubkey: mint,
                space: mintLen,
                lamports,
                programId: spl_token_1.TOKEN_2022_PROGRAM_ID,
            });
            const initializeMetadataPointerInstruction = (0, spl_token_1.createInitializeMetadataPointerInstruction)(mint, updateAuthority, mint, spl_token_1.TOKEN_2022_PROGRAM_ID);
            const initializeMintInstruction = (0, spl_token_1.createInitializeMintInstruction)(mint, decimals, mintAuthority, null, spl_token_1.TOKEN_2022_PROGRAM_ID);
            const initializeMetadataInstruction = (0, spl_token_metadata_1.createInitializeInstruction)({
                programId: spl_token_1.TOKEN_2022_PROGRAM_ID,
                metadata: mint,
                updateAuthority: updateAuthority,
                mint: mint,
                mintAuthority: mintAuthority,
                name: metaData.name,
                symbol: metaData.symbol,
                uri: metaData.uri,
            });
            const updateFieldInstruction = (0, spl_token_metadata_1.createUpdateFieldInstruction)({
                programId: spl_token_1.TOKEN_2022_PROGRAM_ID,
                metadata: mint,
                updateAuthority: updateAuthority,
                field: metaData.additionalMetadata[0][0],
                value: metaData.additionalMetadata[0][1],
            });
            // First transaction: Create and initialize mint
            transaction = new web3_js_1.Transaction().add(createAccountInstruction, initializeMetadataPointerInstruction, initializeMintInstruction, initializeMetadataInstruction, updateFieldInstruction);
            transactionSignature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [payer, mintAddr], {
                commitment: 'confirmed',
                preflightCommitment: 'confirmed'
            });
            console.log("\nCreate Mint Account:", `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`);
            // Wait for mint account initialization
            // After the first transaction that creates the mint account
            // Add a more robust confirmation check
            console.log("Waiting for mint account initialization...");
            yield new Promise(resolve => setTimeout(resolve, 2000)); // Add delay
            let mintInfo = null;
            let retries = 5;
            while (retries > 0 && mintInfo === null) {
                try {
                    mintInfo = yield (0, spl_token_1.getMint)(connection, mintAddr.publicKey, 'confirmed', spl_token_1.TOKEN_2022_PROGRAM_ID);
                    break;
                }
                catch (e) {
                    console.log(`Waiting for mint account to be available... (${retries} retries left)`);
                    yield new Promise(resolve => setTimeout(resolve, 1000));
                    retries--;
                }
            }
            if (!mintInfo) {
                throw new Error("Failed to initialize mint account");
            }
            // Custom logging function to handle BigInt
            const formatMintInfo = {
                address: mintInfo.address.toString(),
                mintAuthority: ((_a = mintInfo.mintAuthority) === null || _a === void 0 ? void 0 : _a.toString()) || null,
                supply: mintInfo.supply.toString(),
                decimals: mintInfo.decimals,
                isInitialized: mintInfo.isInitialized,
                freezeAuthority: ((_b = mintInfo.freezeAuthority) === null || _b === void 0 ? void 0 : _b.toString()) || null,
                extensions: mintInfo.extensions
            };
            console.log("\nMint Info:", formatMintInfo);
            const metadataPointer = (0, spl_token_1.getMetadataPointerState)(mintInfo);
            console.log("\nMetadata Pointer:", JSON.stringify(metadataPointer, null, 2));
            console.log("Waiting for metadata to be available...");
            yield new Promise(resolve => setTimeout(resolve, 3000)); // Initial delay
            let metadata = null;
            let metadataRetries = 5;
            while (metadataRetries > 0) {
                try {
                    metadata = yield (0, spl_token_1.getTokenMetadata)(connection, mint);
                    if (metadata) {
                        console.log("\nMetadata:", JSON.stringify(metadata, null, 2));
                        break;
                    }
                }
                catch (e) {
                    console.log(`Waiting for metadata to be available... (${metadataRetries} retries left)`);
                    yield new Promise(resolve => setTimeout(resolve, 4000));
                    metadataRetries--;
                }
            }
            if (!metadata) {
                throw new Error("Failed to retrieve token metadata");
            }
            // Create ATA in a separate transaction
            console.log("Creating Associated Token Account...");
            let payerTokenAta = yield (0, spl_token_1.getAssociatedTokenAddress)(mint, payer.publicKey, false, spl_token_1.TOKEN_2022_PROGRAM_ID, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
            const createAtaInstruction = (0, spl_token_1.createAssociatedTokenAccountInstruction)(payer.publicKey, payerTokenAta, payer.publicKey, mint, spl_token_1.TOKEN_2022_PROGRAM_ID, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
            const ataTransaction = new web3_js_1.Transaction().add(createAtaInstruction);
            const ataSignature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, ataTransaction, [payer], {
                commitment: 'confirmed',
                preflightCommitment: 'confirmed'
            });
            console.log("ATA created:", ataSignature);
            // Wait for ATA creation to be confirmed
            yield connection.confirmTransaction(ataSignature, 'confirmed');
            // Mint tokens in a separate transaction
            const amount = BigInt('1000000000000000000'); // 1 billion tokens when decimals = 9
            const mintToInstruction = (0, spl_token_1.createMintToInstruction)(mint, payerTokenAta, mintAuthority, amount, [], spl_token_1.TOKEN_2022_PROGRAM_ID);
            // Prevent further minting
            const setAuthorityInstruction = (0, spl_token_1.createSetAuthorityInstruction)(mint, mintAuthority, spl_token_1.AuthorityType.MintTokens, null, [], spl_token_1.TOKEN_2022_PROGRAM_ID);
            const mintTransaction = new web3_js_1.Transaction().add(mintToInstruction, setAuthorityInstruction);
            const mintSignature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, mintTransaction, [payer], {
                commitment: 'confirmed',
                preflightCommitment: 'confirmed'
            });
            // const setAuthorityTransaction = new Transaction().add(setAuthorityInstruction);
            // const setAuthoritySignature = await sendAndConfirmTransaction(
            //   connection,
            //   setAuthorityTransaction,
            //   [payer],
            //   {
            //     commitment: 'confirmed',
            //     preflightCommitment: 'confirmed'
            //   }
            // );
            console.log("Mint successful:", mintSignature);
            return mintAddr;
        }
        catch (error) {
            console.error("Error in tokenMint:", error);
            throw error;
        }
    });
}
function createAndUploadTokenMetadata(metadataJSON) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const tokenMetadataJson = {
            //     "name": metadataJSON.name,
            //     "symbol": metadataJSON.symbol,
            //     "description": metadataJSON.description || "ACustom Kashe Token",
            //     "image": metadataJSON.imgUrl,
            //     "external_url": "https://kashe.io",
            //     "attributes": [
            //         {
            //             "trait_type": "Category",
            //             "value": "Cryptocurrency"
            //         }
            //     ]
            // };
            const tokenMetadataJsonBuffer = Buffer.from(JSON.stringify(metadataJSON));
            const filename_metadata = (0, uuid_1.v4)() + '.json';
            const metadata_file = bucket.file(filename_metadata);
            yield metadata_file.save(tokenMetadataJsonBuffer, { metadata: { contentType: 'application/json' } });
            const metadataURI = 'https://media.kashe.io/' + filename_metadata;
            return { success: true, metadataURI };
        }
        catch (error) {
            return { success: false, error };
        }
    });
}
function createAndMintToken(metadataJSON, metadataURI) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create Solana Token and Mint 1B and Create Bonding Curve Pool And Add Liquidity
            // Get the wallet data from environment variable and convert it to Keypair
            const walletData = JSON.parse(process.env.ANCHOR_WALLET);
            const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(walletData));
            const wallet = new anchor.Wallet(keypair);
            // Create connection using other environment variables
            let cnx = new anchor.web3.Connection(process.env.ANCHOR_PROVIDER_URL || anchor.web3.clusterApiUrl('devnet'));
            // Create provider manually
            const provider = new anchor.AnchorProvider(cnx, wallet, { commitment: 'processed' } // or whatever options you need
            );
            // Set the provider
            anchor.setProvider(provider);
            let anchor_provider = anchor.getProvider();
            console.log("anchor_provider: ", anchor_provider);
            connection = anchor_provider.connection;
            payer = web3_js_1.Keypair.fromSecretKey(new Uint8Array(bytes_1.bs58.decode(process.env.PAYER_KEY)));
            console.log("payer publicKey: ", payer.publicKey.toBase58());
            feeAccount = web3_js_1.Keypair.fromSecretKey(new Uint8Array(user2_json_1.default));
            console.log("feeAccount publicKey: ", feeAccount.publicKey.toBase58());
            console.log("Connected to Solana network:", connection.rpcEndpoint);
            program = anchor.workspace.Token2022Kashe;
            const mintAddr = yield tokenMintKashe(metadataJSON.name, metadataJSON.symbol, metadataURI);
            const ft_contract_addr = mintAddr.publicKey.toString();
            console.log("mintAddr: ", ft_contract_addr);
            return { success: true, ft_contract_addr };
        }
        catch (error) {
            return { success: false, error };
        }
    });
}
function createKasheKoin() {
    return __awaiter(this, void 0, void 0, function* () {
        const metadataJSON = {
            "name": "Kashe Koin",
            "symbol": "KASHE",
            "description": "The Koin Of Kashe",
            "image": "https://media.kashe.io/KasheKoinLogo.png",
            "external_url": "https://kashe.io",
            "attributes": [
                {
                    "trait_type": "Category",
                    "value": "Cryptocurrency"
                }
            ]
        };
        // UPLOAD TOKEN METADATA JSON
        const metadataUpload = yield createAndUploadTokenMetadata(metadataJSON);
        if (!metadataUpload.success)
            return { success: false, error: { message: 'Error Uploading Metadata', type: 'Query', code: 6000, trace_id: '56525345543' } };
        const metadataURI = metadataUpload.metadataURI;
        // MINT TOKEN
        const mintResult = yield createAndMintToken(metadataJSON, metadataURI);
        if (!mintResult.success)
            return { success: false, error: { message: 'Error Minting Token', type: 'Query', code: 6000, trace_id: '6235666244' } };
        const ft_contract_addr = mintResult.ft_contract_addr;
        console.log("ft_contract_addr: ", ft_contract_addr);
    });
}
main();
// createKasheKoin();
//# sourceMappingURL=kashe.js.map