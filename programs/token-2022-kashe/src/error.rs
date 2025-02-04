use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Math overflowed")]
    MathOverflow,
    #[msg("Amount too small")]
    InsufficientFunds,
    #[msg("Not completed yet")]
    BondingCurveNotComplete,
    #[msg("Not pool creator")]
    UnauthorizedWithdraw
}