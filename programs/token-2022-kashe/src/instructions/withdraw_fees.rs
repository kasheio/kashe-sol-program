use anchor_lang::{
    prelude::*,
    solana_program::system_instruction,
};
use crate::consts::FEE_SEED;
use crate::states::InitializeConfiguration;
use crate::error::ErrorCode;  

#[derive(Accounts)]
pub struct WithdrawFees<'info> {
    /// CHECK: This is the fee account PDA that collects protocol fees
    #[account(
        mut,
        seeds = [FEE_SEED],
        bump,
    )]
    pub fee_account: AccountInfo<'info>,

    #[account(mut)]
    pub receiver: Signer<'info>,

    #[account(
        seeds = [InitializeConfiguration::SEEDS],
        bump
    )]
    pub global_configuration: Account<'info, InitializeConfiguration>,

    pub system_program: Program<'info, System>,
}

impl<'info> WithdrawFees<'info> {
    pub fn process(&mut self, bump: u8) -> Result<()> {
        require!(self.receiver.key() == self.global_configuration.authority, ErrorCode::UnauthorizedWithdraw);

        let transfer_instruction = system_instruction::transfer(
            &self.fee_account.to_account_info().key(),
            &self.receiver.to_account_info().key(),
            self.fee_account.lamports(),
        );

        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                self.fee_account.to_account_info(),
                self.receiver.to_account_info(),
                self.system_program.to_account_info(),
            ],
            &[&[
                FEE_SEED,
                &[bump],
            ]],
        )?;

        Ok(())
    }
}