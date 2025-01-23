use anchor_lang::prelude::*;

#[account]
pub struct BondingCurve {
    pub real_token_reserves: u64,
    pub real_sol_reserves: u64,
    pub complete: bool,
    pub creator: Pubkey,
}

impl BondingCurve {
    pub const POOL_SEED_PREFIX: &'static [u8] = b"bonding_curve";

    pub const SIZE: usize = 80;

    pub fn init(
        &mut self,
        creator: Pubkey
    ) -> Result<()> {
        self.real_token_reserves = 0;
        self.real_sol_reserves = 0;
        self.complete = false;
        self.creator = creator;
        Ok(())
    }
}
