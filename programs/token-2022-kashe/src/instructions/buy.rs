use anchor_lang::{
    prelude::*,
    solana_program::{system_instruction},
};

use anchor_spl::{
     token_2022::Token2022, token_interface::{Mint, TokenAccount, transfer_checked, TransferChecked}
};

use crate::{
    states::{BondingCurve, InitializeConfiguration},
    utils::calc_swap_quote,
};
use crate::error::ErrorCode;
use crate::consts::SOL_POOL_SEED;
use crate::consts::BPS_DECIMALS;
use crate::consts::FEE_SEED;

#[event]
pub struct BondingCurveBought {
    pub mint_addr: Pubkey,
    pub buyer: Pubkey,
    pub sol_amount: u64,
    pub token_amount: u64,
    pub sol_reserves: u64,
    pub token_reserves: u64,
    pub fees_paid: u64,
    pub timestamp: i64,
    pub complete: bool,
}

#[derive(Accounts)]
#[instruction(purchase_amount: u64, total_amount: u64)]
pub struct Buy<'info> {
    #[account(
        mut,
        seeds = [InitializeConfiguration::SEEDS],
        bump,
    )]
    pub global_configuration: Account<'info, InitializeConfiguration>,

    #[account(        
        mut,
        seeds = [BondingCurve::POOL_SEED_PREFIX, mint_addr.key().as_ref()],
        bump,
    )]
    pub bonding_curve: Box<Account<'info, BondingCurve>>,

    #[account(mut)]
    pub mint_addr: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint_addr,
        associated_token::authority = payer,
        associated_token::token_program = token_program 
    )]
    pub user_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK:
    #[account(
        mut,
        seeds = [SOL_POOL_SEED, mint_addr.key().as_ref()],
        bump,
    )]
    pub sol_pool: AccountInfo<'info>,

    #[account(       
        mut,         
        associated_token::mint = mint_addr,
        associated_token::authority = sol_pool,
        associated_token::token_program = token_program 
    )]
    pub token_pool: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK:
    #[account(
        mut,
        seeds = [FEE_SEED],
        bump,
    )]
    pub fee_account: AccountInfo<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

impl<'info> Buy<'info> {
    pub fn process(&mut self, purchase_amount: u64, total_amount: u64, bump: u8) -> Result<()> {
        require_eq!(self.bonding_curve.complete, false);
        
        // Verify total_amount is sufficient
        require!(
            total_amount >= purchase_amount,
            ErrorCode::InsufficientFunds
        );

        // Calculate tokens based on purchase_amount only
        let estimated_out_token = calc_swap_quote(
            purchase_amount,
            self.bonding_curve.real_sol_reserves,
            self.bonding_curve.real_token_reserves,
            true,
        );

        // Calculate fees based on purchase_amount
        let fees = purchase_amount
            .checked_mul(self.global_configuration.swap_fee as u64)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(BPS_DECIMALS)
            .ok_or(ErrorCode::MathOverflow)?;

        let pool_amount = purchase_amount
            .checked_sub(fees)
            .ok_or(ErrorCode::MathOverflow)?;

        // Transfer the total amount to cover both purchase and rent
        let transfer_instruction = system_instruction::transfer(
            &self.payer.to_account_info().key(),
            &self.sol_pool.key().clone(),
            pool_amount
        );

        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                self.payer.to_account_info(),
                self.sol_pool.clone(),
                self.system_program.to_account_info(),
            ],
        )?;

        // Transfer fees
        let transfer_instruction_fee = system_instruction::transfer(
            &self.payer.to_account_info().key(),
            &self.fee_account.to_account_info().key(),
            fees,
        );

        anchor_lang::solana_program::program::invoke(
            &transfer_instruction_fee,
            &[
                self.payer.to_account_info(),
                self.fee_account.clone(),
                self.system_program.to_account_info(),
            ],
        )?;

        // Transfer tokens
        transfer_checked(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                TransferChecked {
                    authority: self.sol_pool.to_account_info(),
                    from: self.token_pool.to_account_info(),
                    to: self.user_ata.to_account_info(),
                    mint: self.mint_addr.to_account_info(),
                },
                &[&[
                    SOL_POOL_SEED,
                    &self.mint_addr.key().to_bytes(),
                    &[bump],
                ]],
            ),
            estimated_out_token,
            self.mint_addr.decimals,
        )?;

        // Update reserves based on purchase_amount only
        self.bonding_curve.real_sol_reserves += pool_amount;
        self.bonding_curve.real_token_reserves -= estimated_out_token;

        if self.bonding_curve.real_sol_reserves > self.global_configuration.bonding_curve_limitation
        {
            self.bonding_curve.complete = true;
            // emit!(BondingCurveCompleted {
            //     mint_addr: self.mint_addr.key(),
            //     final_sol_reserves: self.bonding_curve.real_sol_reserves,
            //     final_token_reserves: self.bonding_curve.real_token_reserves,
            //     timestamp: Clock::get()?.unix_timestamp,
            // });
        }

        emit!(BondingCurveBought {
            mint_addr: self.mint_addr.key(),
            buyer: self.payer.key(),
            sol_amount: purchase_amount, // Use purchase_amount for event
            token_amount: estimated_out_token,
            sol_reserves: self.bonding_curve.real_sol_reserves,
            token_reserves: self.bonding_curve.real_token_reserves,
            fees_paid: fees,
            timestamp: Clock::get()?.unix_timestamp,
            complete: self.bonding_curve.complete,
        });

        Ok(())
    }
}