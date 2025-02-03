import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import mekey from "../tests/keys/mekey.json";
import key1 from "../tests/keys/user1.json";
import key2 from "../tests/keys/user2.json";
// import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

async function checkBalances() {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    
    const idKey = Keypair.fromSecretKey(new Uint8Array([109, 119, 128, 121, 165, 100, 12, 228, 105, 55, 176, 157, 122, 212, 52, 206, 85, 232, 60, 59, 217, 192, 27, 139, 213, 120, 148, 23, 203, 107, 140, 249, 170, 78, 108, 109, 55, 20, 56, 91, 99, 155, 22, 9, 75, 44, 198, 221, 113, 73, 176, 210, 134, 204, 224, 84, 94, 139, 191, 64, 51, 95, 125, 197]));
    const mykey = Keypair.fromSecretKey(new Uint8Array(mekey));
    const payer = Keypair.fromSecretKey(new Uint8Array(key1));
    const feeAccount = Keypair.fromSecretKey(new Uint8Array(key2));

    const idKeyBalance = await connection.getBalance(idKey.publicKey);
    const mykeyBalance = await connection.getBalance(mykey.publicKey);
    const payerBalance = await connection.getBalance(payer.publicKey);
    const feeAccountBalance = await connection.getBalance(feeAccount.publicKey);

    console.log("Id wallet (mykey):");
    // console.log("  Secret Key:", bs58.encode(mykey.secretKey));
    console.log("  Address:", idKey.publicKey.toBase58());
    console.log("  Balance:", idKeyBalance / LAMPORTS_PER_SOL, "SOL");

    console.log("MyKey wallet (mykey):");
    // console.log("  Secret Key:", bs58.encode(mykey.secretKey));
    console.log("  Address:", mykey.publicKey.toBase58());
    console.log("  Balance:", mykeyBalance / LAMPORTS_PER_SOL, "SOL");
    
    console.log("Payer wallet (user1):");
    console.log("  Address:", payer.publicKey.toBase58());
    console.log("  Balance:", payerBalance / LAMPORTS_PER_SOL, "SOL");
    // console.log("  Payer secret key (Base58):", bs58.encode(payer.secretKey));
    
    console.log("\nFee Account wallet (user2):");
    console.log("  Address:", feeAccount.publicKey.toBase58());
    console.log("  Balance:", feeAccountBalance / LAMPORTS_PER_SOL, "SOL");
    // console.log("  feeAccount secret key (Base58):", bs58.encode(feeAccount.secretKey));
}

// const privateKeyUint8 = bs58.decode('');
// console.log(privateKeyUint8);
// const keypair = Keypair.fromSecretKey(privateKeyUint8);

checkBalances().catch(console.error);
