import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Token2022Kashe } from "../target/types/token_2022_kashe";

import {
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
  NATIVE_MINT_2022,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID as SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeAccountInstruction
} from "@solana/spl-token";

import {
    Cluster,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

import {
    Raydium,
    DEVNET_PROGRAM_ID,
    CLMM_PROGRAM_ID,
    TxVersion,
    getPdaPoolId,
    getLiquidityFromAmounts,
    RaydiumLoadParams,
    TickUtils,
    ReturnTypeFetchMultiplePoolTickArrays,
    ApiV3PoolInfoConcentratedItem,
    PoolUtils,
    ComputeClmmPoolInfo
} from '@raydium-io/raydium-sdk-v2';

import mekey from "../tests/keys/mekey.json";

import Decimal from 'decimal.js'
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

const VALID_PROGRAM_ID = new Set([CLMM_PROGRAM_ID.toBase58(), DEVNET_PROGRAM_ID.CLMM.toBase58()])

export const isValidClmm = (id) => VALID_PROGRAM_ID.has(id)

export const devConfigs = [
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
]

const txVersion = TxVersion.V0;

let connection: Connection;
let payer: Keypair;

function sortMints(mintA, mintB) {
    const comparison = mintA.toBuffer().compare(mintB.toBuffer());
    if (comparison > 0) {
        return [mintB, mintA];  // Swap if mintA > mintB
    }
    return [mintA, mintB];
}

async function createPool(raydium, connection, params, owner) {
    let poolId;
    try {
        // const clmmConfigs = await raydium.api.getClmmConfigs()
        const clmmConfigs = devConfigs; // devnet configs
        const clmmConfigToUse = clmmConfigs[1];

        console.log('Inputs for getPdaPoolId:', {
            programId: DEVNET_PROGRAM_ID.CLMM.toBase58(),
            configId: clmmConfigToUse.id,
            token1: params.baseToken,
            token2: params.quoteToken.toBase58()
        });

        const [sortedMintA, sortedMintB] = sortMints(
            new PublicKey(params.baseToken),
            params.quoteToken
        );
        const baseIsMintA = sortedMintA.equals(new PublicKey(params.baseToken));
        console.log('Base token is:', baseIsMintA ? 'MintA' : 'MintB');
        console.log('WSOL is:', baseIsMintA ? 'MintB' : 'MintA');
    
        const poolIdKeys = await getPdaPoolId(DEVNET_PROGRAM_ID.CLMM, new PublicKey(clmmConfigs[0].id), sortedMintA, sortedMintB);
        poolId = poolIdKeys.publicKey.toBase58();
        console.log('PoolId from getPdaPoolId:', poolId);

        const mintA = await raydium.token.getTokenInfo(params.baseToken);
        const mintB = await raydium.token.getTokenInfo(params.quoteToken.toBase58());

        console.log('Inputs for createPool:', {
            mint1: mintA.address,
            mint2: mintB.address
        });

        // const tokenAccountB = await getOrCreateAssociatedTokenAccount(
        //     connection,
        //     owner,
        //     params.quoteToken,
        //     owner.publicKey,
        //     true,  // allowOwnerOffCurve
        //     'confirmed',
        //     null,
        //     TOKEN_2022_PROGRAM_ID  // Use token-2022 program
        // );

        const solBalance = await connection.getBalance(owner.publicKey);
        console.log('SOL balance:', solBalance / LAMPORTS_PER_SOL, 'SOL');

        // Check token balances
        const tokenABalance = await connection.getTokenAccountBalance(
            await getAssociatedTokenAddress(
                new PublicKey(mintA.address),
                owner.publicKey,
                true,
                TOKEN_2022_PROGRAM_ID
            )
        ).catch(e => console.log('No token A account found'));

        const tokenBBalance = await connection.getTokenAccountBalance(
            await getAssociatedTokenAddress(
                new PublicKey(mintB.address),
                owner.publicKey,
                true,
                TOKEN_2022_PROGRAM_ID
            )
        ).catch(e => console.log('No token B account found'));

        console.log('Token balances:', {
            tokenA: tokenABalance?.value?.uiAmount,
            tokenB: tokenBBalance?.value?.uiAmount
        });

        // if (mintB.address.toString() === NATIVE_MINT_2022.toString()) {
        //     // Calculate the amount needed in lamports
        //     const wsolAmountNeeded = new BN(2 * (10 ** mintB.decimals)); // Adjust this to match your mintBAmount
            
        //     // Create a transaction to wrap SOL
        //     const wrapSolIx = SystemProgram.transfer({
        //         fromPubkey: owner.publicKey,
        //         toPubkey: tokenAccountB.address,
        //         lamports: wsolAmountNeeded.toNumber()
        //     });

        //     const syncNativeIx = createSyncNativeInstruction(
        //         tokenAccountB.address,
        //         TOKEN_2022_PROGRAM_ID
        //     );

        //     const wrapTx = new Transaction().add(wrapSolIx, syncNativeIx);
            
        //     // Send and confirm the wrapping transaction
        //     const wrapTxId = await sendAndConfirmTransaction(
        //         connection,
        //         wrapTx,
        //         [owner],
        //         {
        //             commitment: 'confirmed',
        //             maxRetries: 3
        //         }
        //     );
        //     console.log('Wrapped SOL, txId:', wrapTxId);
            
        //     // Verify the wrapped balance
        //     const wrappedBalance = await connection.getTokenAccountBalance(tokenAccountB.address);
        //     console.log('Wrapped SOL balance:', wrappedBalance.value.uiAmount);
        // }
      
        // Initial Price based on devnet and curve completion at 1 Sol getting you about 300,000 tokens

        var initialPrice;
        if (baseIsMintA){
            initialPrice = new Decimal(300000);            
        }else{
            initialPrice = new Decimal(1).div(300000);
        }

        const ammConfig = {
            id: new PublicKey(clmmConfigToUse.id),
            index: 0,
            // protocolFeeRate: 120000,
            // tradeFeeRate: 100,
            tickSpacing: 10,
            fundFeeRate: 40000,
            fundOwner: '',
            description: ''
        };

        const { execute, extInfo } = await raydium.clmm.createPool({
            programId: DEVNET_PROGRAM_ID.CLMM,
            mint1: {
                address: mintA.address,
                decimals: mintA.decimals,
                programId: TOKEN_2022_PROGRAM_ID.toBase58()
            },
            mint2: {
                address: mintB.address, 
                decimals: mintB.decimals,
                programId: TOKEN_2022_PROGRAM_ID.toBase58()
            },
            ammConfig,
            initialPrice,
            startTime: new BN(0),
            txVersion
        });
        poolId = extInfo.address.poolId.toBase58();

        console.log('PoolId from createPool:', poolId);

        const simulationResult = await execute({ 
            simulate: true,  // This tells Raydium to simulate instead of sending
            owner
        });
        
        console.log('Simulation result:', {
            txId: simulationResult.txId
        });
        
        // If simulation looks good, then execute the real transaction
        if (simulationResult.value?.err) {
            throw new Error(`Simulation failed: ${JSON.stringify(simulationResult.value.err)}`);
        }
        // don't want to wait confirm, set sendAndConfirm to false or don't pass any params to execute
        const { txId } = await execute({ sendAndConfirm: true })
        // console.log('clmm pool created:', { txId: `https://explorer.solana.com/tx/${txId}` })
        
        return poolId;
    } catch (error) {
        console.error("Detailed error:", {
            error: error,
            message: error.message,
            logs: error.logs, // If available
            details: error.details // If available
        });
        if (error?.InstructionError?.[1]?.Custom === 0) {
            console.log('Pool account already exists');
            return poolId;
        }
        throw error;
    }
}

export const createPosition = async (connection, payer, raydium, poolId, tokenAmount, solAmount) => {
    let poolInfo;
    let poolKeys;
    try {
        if (raydium.cluster === 'mainnet') {
            const data = await raydium.api.fetchPoolById({ ids: poolId })
            poolInfo = data[0];
            if (!isValidClmm(poolInfo.programId)) throw new Error('target pool is not CLMM pool')
        } else {
            const data = await raydium.clmm.getPoolInfoFromRpc(poolId);
            poolInfo = data.poolInfo
            poolKeys = data.poolKeys
        }
        console.log(`Program ID: ${poolInfo.programId}`);

        const [sortedMintA, sortedMintB] = sortMints(
            new PublicKey(poolInfo.mintA.address),
            new PublicKey(poolInfo.mintB.address)
        );
        const tokenIsMintA = sortedMintB.equals(NATIVE_MINT_2022);
        console.log('Token is:', tokenIsMintA ? 'MintA' : 'MintB');
        console.log('WSOL is:', tokenIsMintA ? 'MintB' : 'MintA');

        const epochInfo = await raydium.fetchEpochInfo()

        console.log('Calculating liquidity with SOL amount:', solAmount.toString());
        console.log('Token Amount:', tokenAmount.toString());
    
        const { tick: lowerTick } = TickUtils.getPriceAndTick({
            poolInfo,
            price: new Decimal(0.0000003),
            baseIn: true,
        })
    
        const { tick: upperTick } = TickUtils.getPriceAndTick({
            poolInfo,
            price: new Decimal(1),
            baseIn: true,
        })
        // Calculate initial liquidity and amounts
        const { liquidity, amountA, amountB } = getLiquidityFromAmounts({
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
        const {
            execute,
            signers,
            instructionTypes,
            extInfo
        } = await raydium.clmm.openPositionFromLiquidity({
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
        
        const txSignature = await execute({
            connection,
            signers: [payer, ...signers], // combine your payer with any extra signers returned
            // you can often pass extra options here, e.g. `confirmOptions` or `computeBudgetConfig`
        });
       
        console.log('clmm position opened txSignature:', { txSignature})
    } catch (error) {
        console.error("Detailed error:", {
            error: error,
            message: error.message,
            logs: error.logs,
            details: error.details
        });
        throw error;
    }
}
async function testSwap(connection, poolId, payer, raydium, inputMint, tokenAmount, solAmount){
    try {
        var poolInfo;
        var poolKeys;
        
        if (raydium.cluster === 'mainnet') {
            const data = await raydium.api.fetchPoolById({ ids: poolId })
            poolInfo = data[0];
            if (!isValidClmm(poolInfo.programId)) throw new Error('target pool is not CLMM pool')
        } else {
            const data = await raydium.clmm.getPoolInfoFromRpc(poolId);
            poolInfo = data.poolInfo
            poolKeys = data.poolKeys
        }
    
        let clmmPoolInfo: ComputeClmmPoolInfo;
        let tickCache: ReturnTypeFetchMultiplePoolTickArrays
    
        const inputAmount = new BN(2)
    
        if (raydium.cluster === 'mainnet') {
            // note: api doesn't support get devnet pool info, so in devnet else we go rpc method
            // if you wish to get pool info from rpc, also can modify logic to go rpc method directly
            const data = await raydium.api.fetchPoolById({ ids: poolId })
            poolInfo = data[0] as ApiV3PoolInfoConcentratedItem
            if (!isValidClmm(poolInfo.programId)) throw new Error('target pool is not CLMM pool')
    
            clmmPoolInfo = await PoolUtils.fetchComputeClmmInfo({
                connection: raydium.connection,
                poolInfo,
            })
            tickCache = await PoolUtils.fetchMultiplePoolTickArrays({
                connection: raydium.connection,
                poolKeys: [clmmPoolInfo],
            })
        } else {
            const data = await raydium.clmm.getPoolInfoFromRpc(poolId)
            poolInfo = data.poolInfo
            poolKeys = data.poolKeys
            clmmPoolInfo = data.computePoolInfo
            tickCache = data.tickData
        }
    
        if (inputMint !== poolInfo.mintA.address && inputMint !== poolInfo.mintB.address)
            throw new Error('input mint does not match pool')
    
        const baseIn = inputMint === poolInfo.mintB.address
    
        const { minAmountOut, remainingAccounts } = await PoolUtils.computeAmountOutFormat({
            poolInfo: clmmPoolInfo,
            tickArrayCache: tickCache[poolId],
            amountIn: inputAmount,
            tokenOut: poolInfo[baseIn ? 'mintB' : 'mintA'],
            slippage: 0.01,
            epochInfo: await raydium.fetchEpochInfo(),
        })
    
        const { execute } = await raydium.clmm.swap({
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
        })
    
        const { txId } = await execute()
        console.log('swapped in clmm pool txId:',  txId)
        // process.exit() // if you don't want to end up node execution, comment this line
    } catch (error) {
        console.error("Detailed error:", {
            error: error,
            message: error.message,
            logs: error.logs,
            details: error.details
        });
        throw error;
    }
}
async function main() {
    const walletData = JSON.parse(process.env.ANCHOR_WALLET);
    const keypair = Keypair.fromSecretKey(new Uint8Array(walletData));
    const wallet = new anchor.Wallet(keypair);

    // Create connection using other environment variables
    let cnx = new anchor.web3.Connection(
      process.env.ANCHOR_PROVIDER_URL || anchor.web3.clusterApiUrl('devnet')
    );

    // Create provider manually
    const provider = new anchor.AnchorProvider(
      cnx,
      wallet,
      { commitment: 'processed' }
    );

    // Set the provider
    anchor.setProvider(provider);

    let anchor_provider = anchor.getProvider();
    console.log("anchor_provider: ", anchor_provider);

    connection = anchor_provider.connection;

    console.log("Connected to Solana network:", connection.rpcEndpoint);
    payer = Keypair.fromSecretKey(new Uint8Array(mekey));
    console.log("payer: ", payer.publicKey.toBase58());
    
    // wrapSol(connection, payer);

    const program = anchor.workspace.Token2022Kashe as Program<Token2022Kashe>;

    const poolLockTime = 0;
    const startTime = Math.floor(Date.now() / 1000) + poolLockTime * 60 * 60;
    const cluster:Cluster = 'devnet';
    const ft_contract_addr = "HFVwRx2h3HRSWuMyimTNjT6Fwgud3KdVx4e4qEzCG2Rf"; //BRONCO TOKEN
    const baseToken = ft_contract_addr;
    const tokenAmount = new BN('500000000000000') // custom token
    const solAmount = new BN('5000000000') // WSOL
    const quoteToken = NATIVE_MINT_2022;

    // const mintPubkey = new PublicKey(ft_contract_addr);

    // SETUP RAYDIUM
    const config:RaydiumLoadParams = {
        owner:payer,
        connection,
        cluster,
        disableFeatureCheck: true,
        disableLoadToken: false,
        blockhashCommitment: 'finalized'
    };

    const raydium = await Raydium.load(config);
    
    const poolId = await createPool(raydium, connection, {
        baseToken,
        quoteToken,
        startTime,
    }, payer)
    console.log(`poolId: ${poolId}`);

    const testSwapResult = await testSwap(connection, poolId, payer, raydium, ft_contract_addr, tokenAmount, solAmount);

    const createPositionResult = await createPosition(connection, payer, raydium, poolId, tokenAmount, solAmount);
    

    console.log('done');
}
async function transDecoder(){
    const base64Tx = "AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNU8CK4bHqQ9sAJ6XW797WFF2yopMosh8RBkktMXIWOjUWL+1GCmO8INv2Cwpta3Wfg6VfYpty4l13Aj5QaWwAgAIABxVFXFuMc3et/b4TrPoUxPuZhRkn0VMDGwapIuV5sJi3RjEIdtRJuc3wZ7FLyzjNVR8TWrpdSpO+X9CQm7AHyvmdUUvz51hJ5zOiWUrrEBrl8cy9aYFIsKbL2O32erigLG305h6yeAmCjXZkdCQaOIuWEBEmK28q7oHeLj8Fq4txifBPufDEojtygv3W3Bh1IT6UrkJQ7NLafn9nKUXXdIQczbYsX+GJmK8d6+3yLreYi6caamj1WgBt+C/tSGM2ZOC0UmsIpROikV8El7XjVEVETi5WzZp9eFJQ0eXEUrra28OIg0I7mMnB2mHNf3CtVmeHxKcpyH7zP5NeV2suhGkXnQvXvdp5MtgRT7++ppTc5MIua1yd96lye7uAK0ILjCDtQf1ES6ifb0TSb9znm/cdBWfoY41M4B5yMj0+2D57wntAtSrWhVTmmM9JzAyjQa7yNIIrsIlb+y5sgX7OrjT1YRGfFzFEUv1qSNQ1H/wrGzX0fw1mutWzT6odvHsWUGJcvg7ZDD31b1ooRtiKv7JkHgDLLWHLO4Yp4uxXl+ndE7dlVsr4m6Qcs1hmf4SJZI4+ZgJv3Ck+I7fUDEYgRg6nAwZGb+UhFzL/7K26csOb57yM5bvF9xJrLEObOkAAAACl1cqeBM9dtZC3FLov4yyxWRM/wcGStyJX/QfTnLBAHsJzpBDzmh14iMUco6VGUnJ5JdUmYvy9vVSA7Oxsk9U/BpuIV/6rgYT7aH9jRhjANdrEOdwa6ztVmKDwAAAAAAHTvcRpHL2fr41YfLbfrwgR+v0bqIKPM+OUlp+zGcaOPQbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzrVLI9FU6q5U2sAfK/hr8y3rEM2XkEdzkH+idzgbQkwcOAAkDgDEhAAAAAAAOAAUCwCcJAA8NABACERIDBAUGExUUFiDpktGOz2hAvAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAABQCAAd8AwAAAEVcW4xzd639vhOs+hTE+5mFGSfRUwMbBqki5XmwmLdGIAAAAAAAAAA1bnJBTk1CZTdUS200cmk0ZDdNWXhXNlY2MXNIVGJ5cfABK1QCAAAApQAAAAAAAAAG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqRMEBxEAFgEBDxQAAAEIAgkKCwwHDQMEFhQTFxUREjtN/65SfR3JLkQ7+f+8xAYAQDD5/7DBBgAAAAAAAAAAAAAAAAAAAAAAAOQLVAIAAACAlvJiAgAAAAEBARMDBwAAAQkBGY8fTDpFImPUE7LNF+vLwaDliHNk5iYaEqgXkuoWWj4AAwMFBw==";
    const txBytes = Buffer.from(base64Tx, "base64");

  // 2. Deserialize as a versioned transaction
  const versionedTx = VersionedTransaction.deserialize(txBytes);

  // 3. (Optional) Inspect the transaction
  console.log("Versioned Transaction:", versionedTx);

  const transactionID = bs58.encode(versionedTx.signatures[0]);

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

