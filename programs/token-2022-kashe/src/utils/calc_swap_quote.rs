use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

/// Returns the number of tokens a user receives when adding `sol_amount` lamports.
/// The invariant used is:
///     (sol_reserves + virtual_sol) * token_reserves = k
/// where `virtual_sol` is a fixed amount (to adjust price sensitivity).
pub fn get_tokens_received(
    sol_amount: u64,
    sol_reserves: u64,
    token_reserves: u64,
    virtual_sol: u64,
) -> Result<u64, &'static str> {
    if sol_amount == 0 {
        return Ok(0);
    }
    // k = (sol_reserves + virtual_sol) * token_reserves
    let k = (sol_reserves as u128 + virtual_sol as u128) * token_reserves as u128;
    let new_sol = sol_reserves as u128 + sol_amount as u128;
    // New token reserve is determined by the invariant:
    //     (new_sol + virtual_sol) * new_token_reserves = k
    let new_token_reserves = k / (new_sol + virtual_sol as u128);
    // Tokens received is the decrease in the token reserve
    token_reserves
        .checked_sub(new_token_reserves as u64)
        .ok_or("Underflow in token calculation")
}

/// Returns the amount of lamports (SOL) a user receives when selling `token_amount` tokens.
/// The invariant is the same:
///     (sol_reserves + virtual_sol) * token_reserves = k
/// After the sale, the new token reserve is (token_reserves + token_amount), and the new
/// effective SOL reserve (including the virtual amount) is recalculated.
pub fn get_sell_price(
    token_amount: u64,
    sol_reserves: u64,
    token_reserves: u64,
    virtual_sol: u64,
) -> Result<u64, &'static str> {
    if token_amount == 0 {
        return Ok(0);
    }
    // k = (sol_reserves + virtual_sol) * token_reserves
    let k = (sol_reserves as u128 + virtual_sol as u128) * token_reserves as u128;
    let new_token_reserves = token_reserves as u128 + token_amount as u128;
    // New effective SOL reserve from the invariant
    let new_effective_sol = k / new_token_reserves;
    // Actual new SOL reserve after subtracting the virtual reserve
    if new_effective_sol < virtual_sol as u128 {
        return Ok(sol_reserves);
    }
    let new_sol = new_effective_sol - virtual_sol as u128;
    // SOL returned is the reduction in the actual SOL reserve
    sol_reserves
        .checked_sub(new_sol as u64)
        .ok_or("Underflow in SOL calculation")
}

/// A helper that selects the correct function based on whether the input is SOL (buying tokens)
/// or tokens (selling tokens).
pub fn calc_swap_quote(
    in_amount: u64,
    real_sol_reserves: u64,
    real_token_reserves: u64,
    input_sol: bool,
) -> u64 {
    // Define your virtual reserve (for example, 5 SOL in lamports)
    let virtual_sol = 5 * LAMPORTS_PER_SOL;
    if input_sol {
        get_tokens_received(in_amount, real_sol_reserves, real_token_reserves, virtual_sol).unwrap()
    } else {
        get_sell_price(in_amount, real_sol_reserves, real_token_reserves, virtual_sol).unwrap()
    }
}