import * as dotenv from "dotenv";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Token2022Kashe } from "../target/types/token_2022_kashe";
dotenv.config();

import {
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";

import walletInfo from "/Users/gp/.config/solana/id.json";

let program: Program<Token2022Kashe>;

async function withdrawFees(connection: Connection, walletkey: Keypair) {
    try {
        const [feeAccount] = PublicKey.findProgramAddressSync(
            [Buffer.from("kashe_fee")],
            program.programId
        );

        // Get the balance before withdrawal
        const balanceBefore = await connection.getBalance(feeAccount);
        const receiverBalanceBefore = await connection.getBalance(walletkey.publicKey);
        console.log("Fee account balance before withdrawal:", balanceBefore / anchor.web3.LAMPORTS_PER_SOL, "SOL");
        console.log("Receiver balance before withdrawal:", receiverBalanceBefore / anchor.web3.LAMPORTS_PER_SOL, "SOL");

        if (balanceBefore === 0) {
            console.log("No fees to withdraw");
            return;
        }

        const txn = await program.methods
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
        await connection.confirmTransaction(txn, 'confirmed');
        await new Promise(resolve => setTimeout(resolve, 15000)); // 5 second delay

        // Get the balance after withdrawal
        const balanceAfter = await connection.getBalance(feeAccount);
        const receiverBalanceAfter = await connection.getBalance(walletkey.publicKey);
        
        console.log("Fee account balance after withdrawal:", balanceAfter / anchor.web3.LAMPORTS_PER_SOL, "SOL");
        console.log("Receiver balance after withdrawal:", receiverBalanceAfter / anchor.web3.LAMPORTS_PER_SOL, "SOL");
        console.log("Amount transferred:", (receiverBalanceAfter - receiverBalanceBefore) / anchor.web3.LAMPORTS_PER_SOL, "SOL");
        console.log("Withdraw complete");

    } catch (error) {
        if (error instanceof anchor.web3.SendTransactionError) {
            console.error("Transaction failed:", error.logs);
        } else {
            console.error("Error withdrawing fees:", error);
        }
        throw error;
    }
}

async function main() {
    const walletInfoArray = new Uint8Array(walletInfo);
    const walletkey = Keypair.fromSecretKey(walletInfoArray);
    const wallet = new anchor.Wallet(walletkey);
    console.log("  Address:", wallet.publicKey.toBase58());

    let cnx = new anchor.web3.Connection(process.env.ANCHOR_PROVIDER_URL);

    const provider = new anchor.AnchorProvider(
      cnx,
      wallet,
      { commitment: 'processed' } 
    );

    anchor.setProvider(provider);
    let anchor_provider = anchor.getProvider();
    let connection: Connection = anchor_provider.connection;

    program = anchor.workspace.Token2022Kashe as Program<Token2022Kashe>;

    await withdrawFees(connection, walletkey);
   
    console.log('done');
}

main();
