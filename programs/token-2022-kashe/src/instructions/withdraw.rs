use anchor_lang::prelude::*;
use anchor_spl::{token_2022::Token2022, token_interface::{Mint, TokenAccount, transfer_checked, TransferChecked}};

#[derive(Accounts)]
pub struct WithdrawFromBondingCurve<'info> {
    #[account(
        mut,
        seeds = [BondingCurve::POOL_SEED_PREFIX, mint_addr.key().as_ref()],
        bump,
    )]
    pub bonding_curve: Box<Account<'info, BondingCurve>>,

    #[account(mut)]
    pub mint_addr: InterfaceAccount<'info, Mint>,

    /// CHECK:
    #[account(
        mut,
        seeds = [b"sol_pool", mint_addr.key().as_ref()],
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

    #[account(mut)]
    pub receiver: Signer<'info>,
    
    #[account(
        mut,
        associated_token::mint = mint_addr,
        associated_token::authority = receiver,
        associated_token::token_program = token_program 
    )]
    pub receiver_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

impl<'info> WithdrawFromBondingCurve<'info> {
    pub fn process(&mut self, bump: u8) -> Result<()> {
        require!(self.bonding_curve.complete, ProgramError::InvalidAccountData);

        // Transfer all SOL
        let transfer_instruction = system_instruction::transfer(
            &self.sol_pool.key(),
            &self.receiver.key(),
            self.bonding_curve.real_sol_reserves,
        );

        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                self.sol_pool.clone(),
                self.receiver.to_account_info(),
                self.system_program.to_account_info(),
            ],
            &[&[
                b"sol_pool",
                &self.mint_addr.key().to_bytes(),
                &[bump],
            ]],
        )?;

        // Transfer all tokens
        transfer_checked(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                TransferChecked {
                    authority: self.sol_pool.to_account_info(),
                    from: self.token_pool.to_account_info(),
                    to: self.receiver_ata.to_account_info(),
                    mint: self.mint_addr.to_account_info(),
                },
                &[&[
                    b"sol_pool",
                    &self.mint_addr.key().to_bytes(),
                    &[bump],
                ]],
            ),
            self.bonding_curve.real_token_reserves,
            self.mint_addr.decimals,
        )?;

        Ok(())
    }
}