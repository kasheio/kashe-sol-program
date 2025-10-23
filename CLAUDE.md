# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Solana program (smart contract) implementing a token bonding curve mechanism for SPL Token-2022 tokens. The program enables users to create token pools with automatic market-making functionality using a constant product formula with virtual reserves.

**Program ID (Mainnet):** `A75Rd9gwDREAjGUCYN3cpPM9faLbmm7iWu6trMP84URk`

## Development Commands

### Building and Deployment
```bash
# Clean build artifacts
anchor clean

# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet (configured in Anchor.toml)
anchor deploy
```

### Configuration Management
```bash
# Switch to devnet
solana config set --url devnet
solana config set --keypair ~/.config/solana/id-devnet.json

# Switch to mainnet
solana config set --url mainnet-beta
solana config set --keypair ~/.config/solana/id.json

# Check current configuration
solana config get
```

### Testing
```bash
# Run tests (skips local validator)
npm run test

# Run tests without rebuilding/redeploying
npm run skip
```

### Code Quality
```bash
# Check formatting
npm run lint

# Auto-fix formatting
npm run lint:fix
```

## Architecture

### Core Program Structure

The program is organized into four main modules:

1. **consts.rs** - Global constants including seeds, BPS decimals, and configuration parameters
2. **states/** - Account state definitions (BondingCurve, InitializeConfiguration)
3. **instructions/** - Business logic for all operations (initialize, create_pool, buy, sell, add_liquidity, withdraw, withdraw_fees)
4. **utils/** - Calculation utilities, primarily the bonding curve pricing algorithm

### Bonding Curve Mechanism

The program uses a **constant product AMM with virtual reserves**:
- Formula: `(sol_reserves + virtual_sol) * token_reserves = k`
- Virtual SOL reserve: 5 SOL (defined in `calc_swap_quote.rs:67`)
- This virtual reserve adjusts initial price sensitivity

Key pricing functions in `utils/calc_swap_quote.rs`:
- `get_tokens_received()` - Calculate token output for SOL input
- `get_sell_price()` - Calculate SOL output for token input
- `calc_swap_quote()` - Main entry point that routes to appropriate function

### Account Architecture

**Global Accounts:**
- `global_config` - PDA storing swap fees, bonding curve parameters, and authority
- `fee_account` - PDA (seed: "kashe_fee") that accumulates trading fees

**Per-Token Accounts:**
- `bonding_curve` - PDA (seed: ["bonding_curve", mint]) storing reserves and completion state
- `sol_pool` - PDA (seed: ["sol_pool", mint]) holding SOL liquidity
- `token_pool` - ATA owned by sol_pool PDA, holding token liquidity

### Key Instructions

**initialize** - One-time setup of global configuration
- Sets swap fee (in basis points, e.g., 200 = 2%)
- Sets bonding curve limitation (SOL threshold to mark curve complete)
- Sets bonding curve slope (currently unused in calculations)
- Creates fee_account PDA

**create_pool** - Creates bonding curve for a specific token mint
- Initializes bonding_curve account with zero reserves
- Creates sol_pool PDA and token_pool ATA

**buy** - Purchase tokens with SOL
- Takes `purchase_amount` (SOL for swap) and `total_amount` (must be >= purchase_amount)
- Calculates token output using bonding curve
- Deducts fees (sent to fee_account), remainder goes to pool
- Marks curve complete when sol_reserves exceed `bonding_curve_limitation`
- Emits `BondingCurveBought` event

**sell** - Sell tokens for SOL
- Uses bonding curve to calculate SOL output
- Transfers tokens to pool, SOL to seller (minus fees)
- Emits `BondingCurveSold` event

**add_liquidity** - Add tokens to existing pool
- Creator can bootstrap liquidity after pool creation

**withdraw** - Creator withdraws all liquidity when curve is complete
- Only callable by `bonding_curve.creator`
- Requires `bonding_curve.complete == true`
- Transfers all SOL and tokens from pool to creator

**withdraw_fees** - Authority withdraws accumulated fees from fee_account

### Important Implementation Details

1. **Fee Calculation:** Fees are calculated as `(amount * swap_fee) / BPS_DECIMALS` where BPS_DECIMALS = 10000

2. **Bonding Curve Completion:** When `real_sol_reserves > bonding_curve_limitation`, the curve is marked complete and only the creator can withdraw liquidity

3. **Token Program:** Uses Token-2022 (Token Extensions program), not the legacy Token program

4. **Event Emission:** The buy instruction emits detailed events including reserves, fees, and completion status (some other event emissions are commented out)

## Deployment Workflow

1. Build program: `anchor build`
2. Get program ID: `anchor keys list`
3. Update `declare_id!()` in `lib.rs` if needed
4. Deploy: `anchor deploy`
5. Run initialization script (e.g., `scripts/kashe-prod.ts`)
6. **IMPORTANT:** Fund the fee_account PDA before allowing trades

## Scripts Organization

- `kashe-prod.ts` / `kashe-stage.ts` - Main deployment scripts with initialization
- `bonding-curve-info.ts` - Query bonding curve state
- `withdraw-fees.ts` - Withdraw accumulated fees
- `raydium-*.ts` - Integration scripts for Raydium pool creation
- `gptest.ts` - General testing script

## Configuration Notes

- Uses Anchor 0.30.1
- Package manager: pnpm 9.14.4
- Main cluster configured in `Anchor.toml` (currently mainnet)
- Fee account must be funded with SOL for rent exemption before operations
