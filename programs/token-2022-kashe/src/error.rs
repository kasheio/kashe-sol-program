use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Math operation overflowed")]
    MathOverflow,
    #[msg("Total amount must be greater than or equal to purchase amount")]
    InsufficientFunds,
    #[msg("Only pool creator can withdraw funds")]
    UnauthorizedWithdraw
}