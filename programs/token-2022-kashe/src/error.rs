use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Math operation overflowed")]
    MathOverflow,
    // Add any other custom errors you need
}