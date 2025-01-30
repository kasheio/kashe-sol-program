const { Connection, PublicKey } = require('@solana/web3.js');
const { 
    Raydium, 
    DEVNET_PROGRAM_ID
} = require('@raydium-io/raydium-sdk-v2');
const { 
    TOKEN_2022_PROGRAM_ID,
    NATIVE_MINT_2022 
} = require('@solana/spl-token');

async function getClmmPoolInfo(poolId) {
    try {
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        
        const config = {
            connection,
            cluster: 'devnet',
            disableFeatureCheck: true,
            blockhashCommitment: 'finalized'
        };

        const raydium = await Raydium.load(config);
        const { poolInfo, poolKeys } = await raydium.clmm.getPoolInfoFromRpc(new PublicKey(poolId));
        
        // In the SDK, vault info is in poolKeys.vault
        console.log('Pool Keys:', {
            vault: poolKeys?.vault, // Should have A and B properties
            id: poolKeys?.id,
            mintA: poolKeys?.mintA,
            mintB: poolKeys?.mintB
        });

        // Vault balances
        const vaultABalance = poolKeys?.vault?.A ? 
            await connection.getTokenAccountBalance(new PublicKey(poolKeys.vault.A)) :
            { value: { uiAmount: 0 } };
        
        const vaultBBalance = poolKeys?.vault?.B ?
            await connection.getTokenAccountBalance(new PublicKey(poolKeys.vault.B)) :
            { value: { uiAmount: 0 } };

        // Format the info object
        const info = {
            poolAddress: poolId,
            version: 'CLMM V2',
            programId: DEVNET_PROGRAM_ID.CLMM.toBase58(),
            tokens: {
                mintA: {
                    address: poolKeys.mintA.address,
                    decimals: poolKeys.mintA.decimals
                },
                mintB: {
                    address: poolKeys.mintB.address,
                    decimals: poolKeys.mintB.decimals
                },
                vaultA: {
                    address: poolKeys.vault.A,
                    balance: vaultABalance.value.uiAmount
                },
                vaultB: {
                    address: poolKeys.vault.B,
                    balance: vaultBBalance.value.uiAmount
                }
            },
            liquidity: {
                amount: poolInfo.liquidity.toString(),
                tickCurrent: poolInfo.tickCurrent,
                sqrtPriceX64: poolInfo.sqrtPriceX64.toString()
            },
            fees: {
                tradeFeeRate: poolInfo.ammConfig.tradeFeeRate,
                protocolFeeRate: poolInfo.ammConfig.protocolFeeRate
            },
            config: {
                tickSpacing: poolInfo.ammConfig.tickSpacing
            }
        };

        return info;

    } catch (error) {
        console.error('Error fetching pool info:', error);
        console.error('Error details:', error.stack);
        throw error;
    }
}

// Example usage
async function main() {
    try {
        const poolId = 'AxtSXRF5kMvbbWhQR7dKWLqN4QSMX6hCqhceDQJC9t1J';
        
        const poolInfo = await getClmmPoolInfo(poolId);
        console.log('Pool Information:', JSON.stringify(poolInfo, null, 2));
    } catch (error) {
        console.error('Failed to fetch pool info:', error);
    }
}

main();