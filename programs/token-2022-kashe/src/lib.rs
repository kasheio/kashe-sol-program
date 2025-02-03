use anchor_lang::prelude::*;

pub mod consts;
pub mod events;
pub mod instructions;
pub mod states;
pub mod utils;
pub mod error;

use crate::error::ErrorCode;

use crate::consts::*;
use crate::instructions::*;

declare_id!("AVVWNz5mJsw87Ph9Zirn6eij5Uj19KtjsYQdocddP3zc");

#[program]
pub mod token_2022_kashe {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, param: InitializeConfigurationParam) -> Result<()> {
        ctx.accounts.process(param)?;
        Ok(())
    }

    pub fn create_pool(ctx: Context<CreatePool>) -> Result<()> {
        ctx.accounts.process()?;
        Ok(())
    }

    pub fn add_liquidity(
        ctx: Context<AddLiquidity>,
        token_amount: u64,
    ) -> Result<()> {
        ctx.accounts.process(token_amount)?;
        Ok(())
    }

    pub fn buy(ctx: Context<Buy>, purchase_amount: u64, total_amount: u64) -> Result<bool> {
        ctx.accounts.process(purchase_amount, total_amount, ctx.bumps.sol_pool)
    }

    pub fn sell(ctx: Context<Sell>, in_amount: u64) -> Result<()> {
        ctx.accounts.process(in_amount, ctx.bumps.sol_pool)?;
        Ok(())
    }

    pub fn withdraw(ctx: Context<WithdrawFromBondingCurve>) -> Result<()> {
        ctx.accounts.process(ctx.bumps.sol_pool)?;
        Ok(())
    }

    pub fn withdraw_fees(ctx: Context<WithdrawFees>) -> Result<()> {
        ctx.accounts.process(ctx.bumps.fee_account)?;
        Ok(())
    }
}