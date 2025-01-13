use anchor_lang::prelude::*;

use crate::{
    consts::InitializeConfigurationParam,
    states::InitializeConfiguration,
};

#[derive(Accounts)]
#[instruction(param: InitializeConfigurationParam)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,  // This will initialize if it doesn't exist, or just load if it does
        payer = payer,
        space = InitializeConfiguration::SIZE + 8,
        seeds = [InitializeConfiguration::SEEDS],
        bump
    )]
    pub global_configuration: Account<'info, InitializeConfiguration>,

    /// CHECK:
    pub fee_account: AccountInfo<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn process(&mut self, param: InitializeConfigurationParam) -> Result<()> {
        let bonding_curve_limitation = param.bonding_curve_limitation.clone();
        let bonding_curve_slope = param.bonding_curve_slope.clone();
        let swap_fee = param.swap_fee.clone();

        msg!("Initializing with parameters:");
        msg!("Bonding Curve Limitation: {}", bonding_curve_limitation);
        msg!("Bonding Curve Slope: {}", bonding_curve_slope);  
        msg!("Bonding Swap Fee: {}", swap_fee);
        msg!("Setting global configuration values...");
        self.global_configuration.set_value(param)?;

        Ok(())
    }
}