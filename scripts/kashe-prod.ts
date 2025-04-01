import * as dotenv from "dotenv";
import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Token2022Kashe } from "../target/types/token_2022_kashe";
const web3_js_1 = require("@solana/web3.js");

dotenv.config();

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

//import walletInfo from "/Users/gp/.config/solana/id.json";
import walletInfo from "/home/kasheadmin/.config/solana/id.json";

let program: Program<Token2022Kashe>;

async function initialize(connection: Connection, walletkey: Keypair) {
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
          bondingCurveLimitation: new BN(40 * LAMPORTS_PER_SOL),
          bondingCurveSlope: new BN(190 * 1000000),
          authority: walletkey.publicKey
      };

      // Build the transaction
      const txn = await program.methods
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
    const walletInfoArray = new Uint8Array(walletInfo);
    const walletkey = Keypair.fromSecretKey(walletInfoArray);
    const wallet = new anchor.Wallet(walletkey);
    console.log("  Address:", wallet.publicKey.toBase58());

    // let cnx = new anchor.web3.Connection("https://clean-withered-replica.solana-devnet.quiknode.pro/");
    let cnx = new anchor.web3.Connection("https://fittest-hardworking-asphalt.solana-mainnet.quiknode.pro/5a7cd31f4e42713ec7866178f5447cb665aa662c");

    const provider = new anchor.AnchorProvider(
      cnx,
      wallet,
      { commitment: 'processed' } 
    );

    anchor.setProvider(provider);
    let anchor_provider = anchor.getProvider();
    let connection: Connection = anchor_provider.connection;

    program = anchor.workspace.Token2022Kashe as Program<Token2022Kashe>;

    const [feeAccount] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("kashe_fee")], program.programId);
        console.log(`Fee account: ${feeAccount.toBase58()}`);

    await initialize(connection, walletkey);
   
    console.log('done');
}

main();
