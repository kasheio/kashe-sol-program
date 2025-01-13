use anchor_lang::prelude::*;

#[event]
pub struct PoolCreated {
    pub mint_addr: Pubkey,
    pub sol_pool: Pubkey,
    pub token_pool: Pubkey,
    pub timestamp: i64,
}