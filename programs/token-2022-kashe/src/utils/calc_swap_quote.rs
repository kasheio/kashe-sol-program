use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

fn get_tokens_received(sol_amount: u64, sol_reserves: u64, token_reserves: u64) -> Result<u64, &'static str> {
    if sol_amount == 0 {
        return Ok(0);
    }
    
    // Reduce the virtual reserve component to make price more sensitive to actual reserves
    let virtual_reserve = 5 * LAMPORTS_PER_SOL as u128; // Reduced from 15 SOL to 5 SOL
    
    // Add a weight factor to make real reserves more significant
    let weighted_sol_reserves = (sol_reserves as u128 * 3) + virtual_reserve;
    
    // Calculate the product of virtual reserves using u128 to avoid overflow
    let n: u128 = weighted_sol_reserves * (token_reserves as u128);
    
    // Calculate the new virtual sol reserves after the purchase
    let i: u128 = weighted_sol_reserves + (sol_amount as u128 * 3); // Apply same weight to new amount
    
    // Calculate the new virtual token reserves after the purchase
    let r: u128 = n / i;
    
    // Calculate the amount of tokens to be purchased
    let s: u128 = (token_reserves as u128) - r - 1;
    
    // Convert back to u64 and return the minimum of calculated tokens and real reserves
    let s_u64 = s as u64;
    Ok(if s_u64 < token_reserves {
        s_u64
    } else {
        token_reserves
    })
}

pub fn get_sell_price(
    token_amount: u64,
    sol_reserves: u64,
    token_reserves: u64
) -> Result<u64, &'static str> {    
    if token_amount == 0 {
        return Ok(0);
    }
    
    // Use the same reduced virtual reserve component for consistency
    let virtual_reserve = 5 * LAMPORTS_PER_SOL as u128;
    
    // Apply the same weighting to the reserves for sell operations
    let weighted_sol_reserves = (sol_reserves as u128 * 3) + virtual_reserve;
    
    let n: u128 = weighted_sol_reserves * (token_reserves as u128);
    let d: u128 = token_reserves as u128 + token_amount as u128;
    let f: u128 = n / d;
    
    // Calculate how much SOL to return, removing the weight factor
    // Add a safety check to avoid overflow
    let weighted_return: u128 = weighted_sol_reserves.saturating_sub(f);
    
    // Make sure we don't subtract more than what's available
    if weighted_return <= virtual_reserve {
        return Ok(0);
    }
    
    let lamport_return: u128 = (weighted_return - virtual_reserve) / 3;
    
    Ok(if lamport_return < sol_reserves as u128 {
        lamport_return as u64
    } else {
        sol_reserves
    })
}

pub fn calc_swap_quote(
    in_amount: u64,
    real_sol_reserves: u64,
    real_token_reserves: u64,
    input_sol: bool,
) -> u64 {
    if input_sol {
        get_tokens_received(in_amount, real_sol_reserves, real_token_reserves).unwrap()
    } else {
        get_sell_price(in_amount, real_sol_reserves, real_token_reserves).unwrap()
    }
}