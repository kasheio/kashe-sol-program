import * as dotenv from "dotenv";
dotenv.config();

import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Token2022Kashe } from "../target/types/token_2022_kashe";


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

async function initialize() {
  try {
      const [globalConfiguration] = PublicKey.findProgramAddressSync(
          [Buffer.from("global_config")],
          program.programId
      );
      const [feeAccount] = PublicKey.findProgramAddressSync(
          [Buffer.from("kashe_fee")],
          program.programId
      );

      // Check if the account already exists
      const accountInfo = await connection.getAccountInfo(globalConfiguration);
      if (accountInfo !== null) {
          console.log("Global configuration already initialized");
          return;
      }

      const initializeArgu = {
          swapFee: new BN(200),
          bondingCurveLimitation: new BN(60 * LAMPORTS_PER_SOL),
          bondingCurveSlope: new BN(190 * 1000000)
      };

      // Build the transaction
      const txn = await program.methods
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
      await connection.confirmTransaction(txn, 'confirmed');

      // Add a small delay to ensure account is fully processed
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Fetch account with retries
      let configAccount = null;
      let retries = 5;
      while (retries > 0 && configAccount === null) {
          try {
              configAccount = await program.account.initializeConfiguration.fetch(
                  globalConfiguration,
                  'confirmed'
              );
              console.log("Global configuration:", configAccount);
              break;
          } catch (error) {
              console.log(`Retrying account fetch... (${retries} attempts remaining)`);
              await new Promise(resolve => setTimeout(resolve, 1000));
              retries--;
          }
          if (retries === 0) {
              throw new Error("Failed to fetch account after multiple attempts");
          }
      }

  } catch (error) {
      if (error instanceof anchor.web3.SendTransactionError) {
          console.error("Transaction failed:", error.logs);
      } else {
          console.error("Error initializing:", error);
      }
      throw error;
  }
}

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

    await initialize();
   
    console.log('done');
}

main();
