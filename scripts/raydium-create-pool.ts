import * as dotenv from "dotenv";
import walletInfo from "/Users/gp/.config/solana/id.json";
// Load environment variables from .env file
dotenv.config();

import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Token2022Kashe } from "../target/types/token_2022_kashe";

import {
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
  NATIVE_MINT_2022,
  NATIVE_MINT,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID as SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeAccountInstruction
} from "@solana/spl-token";

import {
    Cluster,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey
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
    ComputeClmmPoolInfo,
    getCpmmPdaAmmConfigId
} from '@raydium-io/raydium-sdk-v2';

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

async function createPool(connection, raydium, quoteToken, baseToken, walletkey, solAmount, tokenAmount) {
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

        const mintA = await raydium.token.getTokenInfo(quoteAddr);
        const mintB = await raydium.token.getTokenInfo(baseAddr);
        // console.log(`MintA details: ${JSON.stringify(mintA, null, 2)}`);
        // console.log(`MintB details: ${JSON.stringify(mintB, null, 2)}`);

        const feeConfigs = await raydium.api.getCpmmConfigs();
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
                config.id = getCpmmPdaAmmConfigId(DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM, config.index).publicKey.toBase58();
            });
        }

        const { execute, extInfo } = await raydium.cpmm.createPool({
            programId: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM,
            poolFeeAccount: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_FEE_ACC,
            mintA,
            mintB,
            mintAAmount: solAmount,
            mintBAmount: tokenAmount,
            startTime: new BN(0),
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

        const { txId } = await execute({ 
            sendAndConfirm: true,
            payer: walletkey // Changed from payer to wallet
        });
        
        poolId = extInfo.address.poolId.toBase58();
        
        console.log('Pool created successfully:', {
            txId,
            poolId,
            poolKeys: Object.keys(extInfo.address).reduce(
                (acc, cur) => ({
                    ...acc,
                    [cur]: extInfo.address[cur].toString(),
                }),
                {}
            ),
        });

        return poolId;
    } catch (error) {
        console.log(JSON.stringify(error));
        // console.error("Pool creation error:", {
        //     error: error,
        //     message: error.message,
        //     name: error.name,
        //     stack: error.stack
        // });
        throw error;
    }
}

async function main() {
    const secretKey = Uint8Array.from(walletInfo);
    const walletkey = Keypair.fromSecretKey(secretKey);
    const wallet = new anchor.Wallet(walletkey);
    console.log("Address:", wallet.publicKey.toBase58());

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

    let connection = provider.connection;
    // const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(0); // 0 for default account size
    // console.log(`Rent exemption amount: ${rentExemptionAmount / LAMPORTS_PER_SOL} SOL`);

    const cluster = 'devnet';
    const mintAddr = "9DQ3di5nVouVCG8UUbWhoYz4wB6NuTL4ZAHu2if37z7"; //fee13 TOKEN
    const baseToken = new PublicKey(mintAddr);
    
    // const tokenAmount = new BN('267 857 142 857 142 87');
    // const tokenAmount = new BN('267857142857142870');
    const tokenAmount = new BN('241071428571428570');
    const solAmount = new BN('3000000000');
    const quoteToken = NATIVE_MINT;

    // Modified config to include proper wallet format
    const config:RaydiumLoadParams = {
        owner:walletkey as any,
        connection: connection as any,
        cluster,
        disableFeatureCheck: true,
        disableLoadToken: false,
        blockhashCommitment: 'finalized'
    };

    const raydium = await Raydium.load(config);

    try {
        const poolId = await createPool(connection, raydium, quoteToken, baseToken, walletkey, solAmount, tokenAmount);
        console.log(`poolId: ${poolId}`);
    } catch (error) {
        console.error("Error details:", {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw error;
    }

    console.log('done');
}
main();

