import * as dotenv from "dotenv";
dotenv.config();

import * as anchor from "@coral-xyz/anchor";
import {
  getMint,
  getMetadataPointerState,
  getTokenMetadata,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

async function readTokenMetadata(mintAddress: string, cluster?: string) {
  try {
    // Setup connection
    let connection: Connection;

    if (cluster === "mainnet") {
      connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    } else if (cluster === "devnet") {
      connection = new Connection("https://api.devnet.solana.com", "confirmed");
    } else {
      const anchor_provider = anchor.AnchorProvider.env();
      connection = anchor_provider.connection;
    }

    console.log("Connected to:", connection.rpcEndpoint);
    console.log("\n");

    const mintPubkey = new PublicKey(mintAddress);

    // Try Token-2022 first
    let programId = TOKEN_2022_PROGRAM_ID;
    let mint;

    try {
      mint = await getMint(
        connection,
        mintPubkey,
        "confirmed",
        TOKEN_2022_PROGRAM_ID
      );
      console.log("✓ Token Program: Token-2022 (Token Extensions)");
    } catch (e) {
      // Try legacy Token Program
      try {
        mint = await getMint(
          connection,
          mintPubkey,
          "confirmed",
          TOKEN_PROGRAM_ID
        );
        programId = TOKEN_PROGRAM_ID;
        console.log("✓ Token Program: Legacy Token Program");
      } catch (e2) {
        console.error("❌ Could not find mint account in either token program");
        throw e2;
      }
    }

    console.log("\n=== MINT INFO ===");
    console.log("Mint Address:", mintPubkey.toBase58());
    console.log("Supply:", mint.supply.toString());
    console.log("Decimals:", mint.decimals);
    console.log("Mint Authority:", mint.mintAuthority?.toBase58() || "None");
    console.log("Freeze Authority:", mint.freezeAuthority?.toBase58() || "None");

    // Check for Token-2022 extensions
    if (programId.equals(TOKEN_2022_PROGRAM_ID)) {
      console.log("\n=== TOKEN-2022 EXTENSIONS ===");

      // Check for metadata pointer
      const metadataPointer = getMetadataPointerState(mint);
      if (metadataPointer) {
        console.log("✓ Metadata Pointer Extension Found");
        console.log("  Metadata Address:", metadataPointer.metadataAddress?.toBase58() || "None");

        // Try to read metadata
        try {
          const metadata = await getTokenMetadata(
            connection,
            mintPubkey,
            "confirmed",
            TOKEN_2022_PROGRAM_ID
          );

          if (metadata) {
            console.log("\n=== METADATA (Token-2022) ===");
            console.log("Name:", metadata.name);
            console.log("Symbol:", metadata.symbol);
            console.log("URI:", metadata.uri);
            console.log("Update Authority:", metadata.updateAuthority?.toBase58() || "None");

            if (metadata.additionalMetadata && metadata.additionalMetadata.length > 0) {
              console.log("\nAdditional Metadata:");
              metadata.additionalMetadata.forEach(([key, value]) => {
                console.log(`  ${key}: ${value}`);
              });
            }

            // Try to fetch the URI content
            if (metadata.uri) {
              console.log("\n=== FETCHING URI CONTENT ===");
              try {
                const response = await fetch(metadata.uri);
                const jsonData = await response.json();
                console.log("URI Content:");
                console.log(JSON.stringify(jsonData, null, 2));
              } catch (e) {
                console.log("⚠ Could not fetch URI content:", e.message);
              }
            }
          }
        } catch (e) {
          console.log("⚠ No metadata found via Token-2022 extension");
        }
      } else {
        console.log("✗ No Metadata Pointer Extension");
      }
    }

    // Check for Metaplex metadata (works for both Token and Token-2022)
    console.log("\n=== CHECKING METAPLEX METADATA ===");
    try {
      // Metaplex metadata PDA
      const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          METADATA_PROGRAM_ID.toBuffer(),
          mintPubkey.toBuffer(),
        ],
        METADATA_PROGRAM_ID
      );

      const accountInfo = await connection.getAccountInfo(metadataPDA);
      if (accountInfo) {
        console.log("✓ Metaplex Metadata Account Found");
        console.log("Metadata PDA:", metadataPDA.toBase58());

        // Basic parsing (you'd need @metaplex-foundation/mpl-token-metadata for full parsing)
        console.log("Account Data Length:", accountInfo.data.length, "bytes");
        console.log("\nNote: Install @metaplex-foundation/mpl-token-metadata for detailed parsing");
      } else {
        console.log("✗ No Metaplex metadata account found");
      }
    } catch (e) {
      console.log("⚠ Error checking Metaplex metadata:", e.message);
    }

  } catch (error) {
    console.error("Error reading token metadata:", error);
    throw error;
  }
}

async function main() {
  // Get mint address from command line argument
  const mintAddress = process.argv[2];
  const cluster = process.argv[3]; // Optional: "mainnet" or "devnet"

  if (!mintAddress) {
    console.log("Usage: npx tsx scripts/read-token-metadata.ts <MINT_ADDRESS> [mainnet|devnet]");
    console.log("\nExamples:");
    console.log("- npx tsx scripts/read-token-metadata.ts pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn mainnet");
    console.log("- npx tsx scripts/read-token-metadata.ts 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU devnet");
    process.exit(1);
  }

  await readTokenMetadata(mintAddress, cluster);
}

main();
