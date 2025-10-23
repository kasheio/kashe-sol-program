import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import * as anchor from "@coral-xyz/anchor";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {
  createAssociatedTokenAccount,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMint,
  createUpdateFieldInstruction,
  getAssociatedTokenAddress,
  getMintLen,
  ExtensionType,
  LENGTH_SIZE,
  mintTo,
  NATIVE_MINT,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import mekey from "../tests/keys/mekey.json";
import key1 from "../tests/keys/user1.json";

let connection: Connection;
let payer: Keypair;
let mintAddr: Keypair;
let userNativeAta: PublicKey;
let userAta:PublicKey;

async function tokenMint() {
    try {
        userNativeAta = await getAssociatedTokenAddress(
            NATIVE_MINT,
            payer.publicKey
        );
        console.log(userNativeAta);

        // Token metadata configuration
        const tokenName = "Kashe";
        const tokenSymbol = "KASHE";
        const tokenUri = "https://media.kashe.io/metadata.json";

        const decimals = 9;
        mintAddr = Keypair.generate();

        // Calculate the space needed for metadata extension
        const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
        const metadataLen = pack({
            mint: mintAddr.publicKey,
            name: tokenName,
            symbol: tokenSymbol,
            uri: tokenUri,
            additionalMetadata: [],
        }).length;

        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const lamports = await connection.getMinimumBalanceForRentExemption(
            mintLen + metadataExtension + metadataLen
        );

        // Create mint account with metadata extension
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: payer.publicKey,
                newAccountPubkey: mintAddr.publicKey,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(
                mintAddr.publicKey,
                payer.publicKey,
                mintAddr.publicKey,
                TOKEN_2022_PROGRAM_ID
            ),
            createInitializeMintInstruction(
                mintAddr.publicKey,
                decimals,
                payer.publicKey,
                null,
                TOKEN_2022_PROGRAM_ID
            ),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                metadata: mintAddr.publicKey,
                mint: mintAddr.publicKey,
                mintAuthority: payer.publicKey,
                updateAuthority: payer.publicKey,
                name: tokenName,
                symbol: tokenSymbol,
                uri: tokenUri,
            })
        );

        const sig = await sendAndConfirmTransaction(
            connection,
            transaction,
            [payer, mintAddr],
            { commitment: "finalized" }
        );
        console.log("Mint created with metadata:", sig);
        console.log("Mint address:", mintAddr.publicKey.toBase58());

        // Create an ATA for the payer to hold the minted token
        userAta = await createAssociatedTokenAccount(
            connection,
            payer,
            mintAddr.publicKey,
            payer.publicKey,
            { commitment: "finalized" },
            TOKEN_2022_PROGRAM_ID
        );
        console.log("userAta: ", userAta);

        // Mint some tokens to the ATA of the payer
        const mintto_sig = await mintTo(
            connection,
            payer,
            mintAddr.publicKey,
            userAta,
            payer,
            10 ** 18,
            [],
            { commitment: "finalized" },
            TOKEN_2022_PROGRAM_ID
        );
        console.log("Minted tokens:", mintto_sig);
    } catch (error) {
        console.error("Error in tokenMint:", error);
        throw error;
    }
}

async function main() {
    let anchor_provider_env = anchor.AnchorProvider.env();
    console.log("anchor_provider_env.wallet.publicKey.toBase58()", anchor_provider_env.wallet.publicKey.toBase58());    
    // console.log("anchor_provider_env.publicKey.toBase58()", anchor_provider_env.publicKey.toBase58());    
    anchor.setProvider(anchor_provider_env);

    let anchor_provider = anchor.getProvider();
    // console.log("anchor_provider: ", anchor_provider);
    connection = anchor_provider.connection;
    console.log("Connected to Solana network:", connection.rpcEndpoint);
    payer = Keypair.fromSecretKey(new Uint8Array(key1));
    console.log("payer: ", payer.publicKey.toBase58());
   
    await tokenMint();
    console.log("mintAddr: ", bs58.encode(mintAddr.secretKey));
    console.log("userAta: ", userAta.toBase58());
    console.log("userNativeAta: ", userNativeAta.toBase58());
    console.log('done');
}

main();

