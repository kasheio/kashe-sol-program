// const bs58 = require('bs58');

// // Hex representation of the Program Data Account public key
// const hexPubkey = "95b2d964aa5312ecabb16271c9d6f02f37100ada8ad478e5832cbd0993bf0bba";

// // Convert hex to a Buffer
// const pubkeyBuffer = Buffer.from(hexPubkey, 'hex');

// // Encode the buffer to a Base58 string
// const base58Pubkey = bs58.encode(pubkeyBuffer);
// console.log("Program Data Account:", base58Pubkey);

const { Connection, PublicKey } = require('@solana/web3.js');

// Replace with your preferred RPC endpoint (mainnet-beta, devnet, or testnet)
// const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
const RPC_ENDPOINT = 'https://fittest-hardworking-asphalt.solana-mainnet.quiknode.pro/5a7cd31f4e42713ec7866178f5447cb665aa662c';

async function fetchAllSignatures(connection, walletPubKey) {
  let allSignatures = [];
  let options = { limit: 1000 }; // maximum allowed limit per call
  let lastSignature = null;

  console.log(`Fetching transaction signatures for wallet: ${walletPubKey.toBase58()}`);

  while (true) {
    // If we've already fetched some signatures, set the 'before' option for pagination.
    if (lastSignature) {
      options.before = lastSignature;
    }

    const signatures = await connection.getSignaturesForAddress(walletPubKey, options);

    if (!signatures.length) {
      break;
    }

    allSignatures = allSignatures.concat(signatures);
    lastSignature = signatures[signatures.length - 1].signature;

    console.log(`Fetched ${allSignatures.length} signatures so far...`);
    
    // Optional: add a small delay if you’re hitting rate limits.
    // await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`Total signatures fetched: ${allSignatures.length}`);
  return allSignatures;
}

/**
 * Returns true if the instruction qualifies as "interesting" based on:
 *   1. Account delegation (e.g. stake delegation)
 *   2. Program account creation (System Program createAccount / createAccountWithSeed
 *      or an invocation from one of the BPF loader programs)
 *   3. Program instruction invocation (any instruction not coming from the System or Stake program)
 *      with token transfers (SPL Token transfer or transferChecked) filtered out.
 */
function isInterestingInstruction(ix) {
    // --- Delegation instructions ---
    // For example, stake delegation instructions usually have a parsed type like "delegate" or "delegateStake"
    const isDelegation =
      ix.program === 'stake' &&
      ix.parsed &&
      ix.parsed.type &&
      ix.parsed.type.toLowerCase().includes('delegate');
  
    // --- Program account creations ---
    // Option A: A system program create account instruction.
    const isSystemCreateAccount =
      ix.program === 'system' &&
      ix.parsed &&
      (ix.parsed.type === 'createAccount' || ix.parsed.type === 'createAccountWithSeed');
  
    // Option B: Instructions from BPF loader programs (often used in program deployments).
    const isBpfLoaderInstruction =
      ix.program === 'bpf_loader' ||
      ix.program === 'bpf_loader_upgradeable' ||
      ix.program === 'bpf_loader_deprecated';
  
    const isProgramAccountCreation = isSystemCreateAccount || isBpfLoaderInstruction;
  
    // --- Program instruction invocations ---
    // We consider an instruction as a program invocation if it comes from a program other than System or Stake.
    // However, we filter out common token transfer instructions.
    const isTokenTransfer =
      ix.program === 'spl-token' &&
      ix.parsed &&
      (ix.parsed.type === 'transfer' || ix.parsed.type === 'transferChecked');
  
    const isProgramInvocation = !isTokenTransfer && (ix.program !== 'system' && ix.program !== 'stake');
  
    return isDelegation || isProgramAccountCreation || isProgramInvocation;
  }
  
  /**
   * Analyzes transactions and logs only those that include at least one "interesting" instruction.
   */
  async function analyzeTransactions(connection, signatures, walletPubKey) {
    // Convert wallet public key to string for easy comparison.
    const walletAddressStr = walletPubKey.toBase58();
  
    for (let i = 0; i < signatures.length; i++) {
      const sigInfo = signatures[i];
  
      try {
        // Get parsed transaction details.
        const transaction = await connection.getParsedTransaction(sigInfo.signature, 'confirmed');
        if (!transaction) {
          console.log(`Transaction ${sigInfo.signature} returned null (it might be too old or unavailable).`);
          continue;
        }
  
        // Check that the transaction was initiated by our wallet.
        // Typically, the first account key is the fee payer.
        const feePayer = transaction.transaction.message.accountKeys[0].pubkey;
        if (feePayer !== walletAddressStr) {
          continue;
        }
  
        // Check if any instruction in the transaction is "interesting".
        const instructions = transaction.transaction.message.instructions;
        const hasInterestingInstruction = instructions.some(isInterestingInstruction);
        if (!hasInterestingInstruction) {
          continue;
        }
  
        // Log the transaction details.
        console.log(`\nTransaction ${i + 1}/${signatures.length}`);
        console.log(`Signature: ${sigInfo.signature}`);
        console.log(
          `Block Time: ${
            transaction.blockTime ? new Date(transaction.blockTime * 1000).toLocaleString() : 'N/A'
          }`
        );
  
        // Log each instruction.
        instructions.forEach((ix, index) => {
          console.log(`  Instruction ${index + 1}:`);
          if (ix.parsed) {
            console.log(`    Program: ${ix.program}`);
            console.log(`    Parsed Data: ${JSON.stringify(ix.parsed, null, 2)}`);
          } else {
            console.log(`    Raw Instruction Data: ${JSON.stringify(ix, null, 2)}`);
          }
        });
      } catch (err) {
        console.error(`Error processing transaction ${sigInfo.signature}:`, err);
      }
    }
  }

async function main() {
  const connection = new Connection(RPC_ENDPOINT, 'confirmed');

  // Replace with the wallet address you want to inspect.
  const walletAddress = 'CTofg77KrCCdUKoGmcFS67zchX1jQCtz8Zxd3iWZpm9E';
  const walletPubKey = new PublicKey(walletAddress);

  // Step 1: Fetch all transaction signatures.
  const allSignatures = await fetchAllSignatures(connection, walletPubKey);

  // Step 2: Analyze each transaction.
  await analyzeTransactions(connection, allSignatures, walletPubKey);
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});