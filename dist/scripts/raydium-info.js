var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Connection, PublicKey } = require('@solana/web3.js');
const { Raydium, DEVNET_PROGRAM_ID } = require('@raydium-io/raydium-sdk-v2');
const { TOKEN_2022_PROGRAM_ID, NATIVE_MINT_2022 } = require('@solana/spl-token');
function getClmmPoolInfo(poolId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
            const config = {
                connection,
                cluster: 'devnet',
                disableFeatureCheck: true,
                blockhashCommitment: 'finalized'
            };
            const raydium = yield Raydium.load(config);
            const { poolInfo, poolKeys } = yield raydium.clmm.getPoolInfoFromRpc(new PublicKey(poolId));
            // In the SDK, vault info is in poolKeys.vault
            console.log('Pool Keys:', {
                vault: poolKeys === null || poolKeys === void 0 ? void 0 : poolKeys.vault, // Should have A and B properties
                id: poolKeys === null || poolKeys === void 0 ? void 0 : poolKeys.id,
                mintA: poolKeys === null || poolKeys === void 0 ? void 0 : poolKeys.mintA,
                mintB: poolKeys === null || poolKeys === void 0 ? void 0 : poolKeys.mintB
            });
            // Vault balances
            const vaultABalance = ((_a = poolKeys === null || poolKeys === void 0 ? void 0 : poolKeys.vault) === null || _a === void 0 ? void 0 : _a.A) ?
                yield connection.getTokenAccountBalance(new PublicKey(poolKeys.vault.A)) :
                { value: { uiAmount: 0 } };
            const vaultBBalance = ((_b = poolKeys === null || poolKeys === void 0 ? void 0 : poolKeys.vault) === null || _b === void 0 ? void 0 : _b.B) ?
                yield connection.getTokenAccountBalance(new PublicKey(poolKeys.vault.B)) :
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
        }
        catch (error) {
            console.error('Error fetching pool info:', error);
            console.error('Error details:', error.stack);
            throw error;
        }
    });
}
// Example usage
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const poolId = 'AxtSXRF5kMvbbWhQR7dKWLqN4QSMX6hCqhceDQJC9t1J';
            const poolInfo = yield getClmmPoolInfo(poolId);
            console.log('Pool Information:', JSON.stringify(poolInfo, null, 2));
        }
        catch (error) {
            console.error('Failed to fetch pool info:', error);
        }
    });
}
main();
//# sourceMappingURL=raydium-info.js.map