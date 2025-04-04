use anchor_lang::prelude::*;

use crate::InitializeConfigurationParam;

#[account]
pub struct InitializeConfiguration {
    pub swap_fee : u64,                                       //  swap basis points
    pub bonding_curve_limitation : u64,                       //  bonding curve limitation
    pub bonding_curve_slope : u64,                            //  bonding curve slope   
    pub authority: Pubkey,   
}

impl InitializeConfiguration {
    pub const SIZE: usize = 64;  // Size of the struct
    pub const SEEDS: &'static [u8] = b"global_config";  // Size of the struct

    pub fn set_value (&mut self , param : InitializeConfigurationParam) -> Result<()> {

        self.bonding_curve_limitation =  param.bonding_curve_limitation;
        self.bonding_curve_slope =  param.bonding_curve_slope;
        self.swap_fee =  param.swap_fee;
        self.authority =  param.authority;

        Ok(())
    }
}