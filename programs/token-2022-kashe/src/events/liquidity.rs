use anchor_lang::prelude::*;

#[event]
pub struct LiquidityAdded {
    pub mint_addr: Pubkey,
    pub provider: Pubkey,
    pub token_amount: u64,
    pub new_token_reserves: u64,
    pub timestamp: i64,
}
