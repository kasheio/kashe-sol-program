use anchor_lang::{
    prelude::*,
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount},
    token_2022::Token2022
};

use crate::{
    states::{BondingCurve, InitializeConfiguration},
};
use crate::consts::SOL_POOL_SEED;

#[derive(Accounts)]
pub struct CreatePool<'info> {
    #[account(
        mut,
        seeds = [InitializeConfiguration::SEEDS],
        bump,
    )]
    pub global_configuration: Account<'info, InitializeConfiguration>,

    #[account(        
        init,
        space = BondingCurve::SIZE,
        payer = payer,
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
    #[account(
        mut,
        seeds = [
            SOL_POOL_SEED, mint_addr.key().as_ref()
        ],
        bump,
    )]
    /// CHECK:
    pub sol_pool: AccountInfo<'info>,
    #[account(       
        init,
        payer = payer,       
        associated_token::mint = mint_addr,
        associated_token::authority = sol_pool
    )]
    pub token_pool: Box<InterfaceAccount<'info, TokenAccount>>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> CreatePool<'info> {
    pub fn process(&mut self) -> Result<()> {
        self.bonding_curve.init(self.payer.key())?;

        // emit!(PoolCreated {
        //     mint_addr: self.mint_addr.key(),
        //     sol_pool: self.sol_pool.key(),
        //     token_pool: self.token_pool.key(),
        //     timestamp: Clock::get()?.unix_timestamp,
        // });
        
        Ok(())
    }
}
