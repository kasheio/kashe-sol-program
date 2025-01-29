import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Token2022Kashe } from "../target/types/token_2022_kashe";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import {
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

import mekey from "../tests/keys/mekey.json";
import key1 from "../tests/keys/user1.json";
import key2 from "../tests/keys/user2.json";
import { Storage } from '@google-cloud/storage';

const bucketName = process.env.BUCKET;
const storage = new Storage({
  keyFilename: `subtle-striker-443420-h0-9ec708d80a59.json`,
  projectId:"subtle-striker-443420-h0"
});
const bucket = storage.bucket(bucketName);

let connection: Connection;
let mykey: Keypair;
let payer: Keypair;
let feeAccount: Keypair;
let program: Program<Token2022Kashe>;

async function main() {
    const walletData = JSON.parse(process.env.ANCHOR_WALLET);
    const keypair = Keypair.fromSecretKey(new Uint8Array(walletData));
    const wallet = new anchor.Wallet(keypair);

    let cnx = new anchor.web3.Connection(
      process.env.ANCHOR_PROVIDER_URL || anchor.web3.clusterApiUrl('devnet')
    );
    const provider = new anchor.AnchorProvider(
      cnx,
      wallet,
      { commitment: 'processed' }
    );

    anchor.setProvider(provider);

    let anchor_provider = anchor.getProvider();
    console.log("anchor_provider: ", anchor_provider);

    connection = anchor_provider.connection;

    console.log("Connected to Solana network:", connection.rpcEndpoint);
    mykey = Keypair.fromSecretKey(new Uint8Array(mekey));
    payer = Keypair.fromSecretKey(new Uint8Array(key1));
    feeAccount = Keypair.fromSecretKey(new Uint8Array(key2));
    console.log("player: ", payer.publicKey.toBase58());
    console.log("feeAccount: ", feeAccount.publicKey.toBase58());
    
    program = anchor.workspace.Token2022Kashe as Program<Token2022Kashe>;

    const poolinfo = await getPoolInfo();

    console.log('done');
}

async function getPoolInfo() {
    try {
        const mintAddr = new PublicKey('FyqXFU9M365dXocrnjvwafG5mvmembBj9EAK2i5o5hc5');
        
        // Get the bonding curve PDA
        const [bondingCurve] = PublicKey.findProgramAddressSync(
            [Buffer.from("bonding_curve"), mintAddr.toBuffer()],
            program.programId
        );

        // Get the sol pool PDA
        const [solPool] = PublicKey.findProgramAddressSync(
            [Buffer.from("sol_pool"), mintAddr.toBuffer()],
            program.programId
        );

        // Get the token pool ATA
        const tokenPool = await getAssociatedTokenAddress(
            mintAddr,
            solPool,
            true,
            TOKEN_2022_PROGRAM_ID
        );

        // Fetch the bonding curve account data
        const bondingCurveAccount = await program.account.bondingCurve.fetch(bondingCurve);
        
        // Fetch SOL balance
        const solBalance = await connection.getBalance(solPool);
        
        // Fetch token balance
        const tokenAccount = await connection.getTokenAccountBalance(tokenPool);

        console.log('Bonding Curve Info:');
        console.log('SOL Pool Address:', solPool.toBase58());
        console.log('Token Pool Address:', tokenPool.toBase58());
        console.log('SOL Balance:', solBalance / LAMPORTS_PER_SOL, 'SOL');
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

    } catch (error) {
        if (error instanceof anchor.web3.SendTransactionError) {
            console.error("Transaction failed:", error.logs);
        } else {
            console.error("Error getting pool info:", error);
        }
        throw error;
    }
}

main();
