use anchor_lang::prelude::*;

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
}

#[event]
pub struct BondingCurveSold {
    pub mint_addr: Pubkey,
    pub seller: Pubkey,
    pub token_amount: u64,
    pub sol_amount: u64,
    pub sol_reserves: u64,
    pub token_reserves: u64,
    pub fees_paid: u64,
    pub timestamp: i64,
}

#[event]
pub struct BondingCurveCompleted {
    pub mint_addr: Pubkey,
    pub final_sol_reserves: u64,
    pub final_token_reserves: u64,
    pub timestamp: i64,
}