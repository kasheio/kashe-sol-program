# TOKEN2022-Pumpfun

This is pumpfun smart contract which use new spl token - token2022 in pumpfun



### Why use token2022

Token 2022 is new version of token program
It's well-known as innovative tech and abundant extended functions
This smart contract help token2022 token launch and trade on this plate form

### Manipulate Bonding Curve

You can set parameter of bonding curve in this platform via initailize and add

### Where does token2022 moves after hitting the bonding curve

After hitting the bonding curve , tokens move to Raydium CLMM pool

<h4> 📞 Cᴏɴᴛᴀᴄᴛ ᴍᴇ Oɴ ʜᴇʀᴇ: 👆🏻 </h4>

<div style={{display : flex ; justify-content : space-evenly}}> 
    <a href="mailto:nakao95911@gmail.com" target="_blank">
        <img alt="Email"
        src="https://img.shields.io/badge/Email-00599c?style=for-the-badge&logo=gmail&logoColor=white"/>
    </a>
     <a href="https://x.com/_wizardev" target="_blank"><img alt="Twitter"
        src="https://img.shields.io/badge/Twitter-000000?style=for-the-badge&logo=x&logoColor=white"/></a>
    <a href="https://discordapp.com/users/471524111512764447" target="_blank"><img alt="Discord"
        src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white"/></a>
    <a href="https://t.me/wizardev" target="_blank"><img alt="Telegram"
        src="https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white"/></a>
</div>

RUSTUP_TOOLCHAIN="nightly-2024-11-19" anchor deploy


To deploy:
anchor clean
anchor build
anchor keys list (to get the program id)
change declare_id in lib.rs
anchor deploy
Run kashe script with initialize

--------- FAILED DEPLOY --------- COST 5 sol

   Compiling bincode v1.3.3
   Compiling bitflags v2.6.0
   Compiling regex v1.11.1
   Compiling darling_macro v0.20.10
   Compiling cipher v0.3.0
   Compiling toml v0.8.19
   Compiling ed25519-dalek v1.0.1
   Compiling hmac v0.12.1
   Compiling darling v0.20.10
   Compiling universal-hash v0.4.1
   Compiling borsh-derive v1.5.3
   Compiling num_enum_derive v0.7.3
   Compiling env_logger v0.9.3
   Compiling serde_with_macros v2.3.3
   Compiling solana-logger v1.18.26
   Compiling cargo_toml v0.19.2
   Compiling polyval v0.5.3
   Compiling ed25519-dalek-bip32 v0.2.0
   Compiling aes v0.7.5
   Compiling num_enum v0.7.3
   Compiling ctr v0.8.0
   Compiling serde_with v2.3.3
   Compiling pbkdf2 v0.11.0
   Compiling aead v0.4.3
   Compiling sha3 v0.9.1
   Compiling spl-program-error-derive v0.4.1
   Compiling aes-gcm-siv v0.10.3
   Compiling spl-discriminator-derive v0.2.0
   Compiling anchor-lang-idl-spec v0.1.0
   Compiling solana-security-txt v1.1.1
   Compiling anchor-derive-space v0.30.1
   Compiling anchor-syn v0.30.1
   Compiling num-derive v0.3.3
   Compiling anchor-lang-idl v0.1.1
   Compiling ark-poly v0.4.2
   Compiling ark-ec v0.4.2
   Compiling anchor-attribute-error v0.30.1
   Compiling anchor-attribute-account v0.30.1
   Compiling anchor-derive-accounts v0.30.1
   Compiling anchor-attribute-access-control v0.30.1
   Compiling anchor-attribute-program v0.30.1
   Compiling anchor-attribute-constant v0.30.1
   Compiling anchor-attribute-event v0.30.1
   Compiling anchor-derive-serde v0.30.1
   Compiling ark-bn254 v0.4.0
   Compiling light-poseidon v0.2.0
   Compiling spl-program-error v0.4.4
   Compiling spl-discriminator v0.2.5
   Compiling spl-token v4.0.3
   Compiling spl-memo v4.0.4
   Compiling mpl-token-metadata v4.1.2
   Compiling anchor-lang v0.30.1
   Compiling solana-zk-token-sdk v1.18.26
   Compiling spl-pod v0.2.5
   Compiling spl-type-length-value v0.4.6
   Compiling spl-token-group-interface v0.2.5
   Compiling spl-tlv-account-resolution v0.6.5
   Compiling spl-token-metadata-interface v0.3.5
   Compiling spl-transfer-hook-interface v0.6.5
   Compiling spl-token-2022 v3.0.4
   Compiling spl-associated-token-account v3.0.4
   Compiling anchor-spl v0.30.1
   Compiling token-2022-kashe v0.1.0 (/Users/gp/CascadeProjects/kashe-sol-program/programs/token-2022-kashe)
warning: unexpected `cfg` condition value: `custom-heap`
  --> programs/token-2022-kashe/src/lib.rs:17:1
   |
17 | #[program]
   | ^^^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `custom-heap` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: `#[warn(unexpected_cfgs)]` on by default
   = note: this warning originates in the macro `$crate::custom_heap_default` which comes from the expansion of the attribute macro `program` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `solana`
  --> programs/token-2022-kashe/src/lib.rs:17:1
   |
17 | #[program]
   | ^^^^^^^^^^
   |
   = note: expected values for `target_os` are: `aix`, `android`, `cuda`, `dragonfly`, `emscripten`, `espidf`, `freebsd`, `fuchsia`, `haiku`, `hermit`, `horizon`, `hurd`, `illumos`, `ios`, `l4re`, `linux`, `macos`, `netbsd`, `none`, `nto`, `nuttx`, `openbsd`, `psp`, `psx`, `redox`, `rtems`, `solaris`, `solid_asp3`, `teeos`, `trusty`, `tvos`, `uefi`, `unknown`, `visionos`, and `vita` and 6 more
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the macro `$crate::custom_heap_default` which comes from the expansion of the attribute macro `program` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `custom-panic`
  --> programs/token-2022-kashe/src/lib.rs:17:1
   |
17 | #[program]
   | ^^^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `custom-panic` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the macro `$crate::custom_panic_default` which comes from the expansion of the attribute macro `program` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `solana`
  --> programs/token-2022-kashe/src/lib.rs:17:1
   |
17 | #[program]
   | ^^^^^^^^^^
   |
   = note: expected values for `target_os` are: `aix`, `android`, `cuda`, `dragonfly`, `emscripten`, `espidf`, `freebsd`, `fuchsia`, `haiku`, `hermit`, `horizon`, `hurd`, `illumos`, `ios`, `l4re`, `linux`, `macos`, `netbsd`, `none`, `nto`, `nuttx`, `openbsd`, `psp`, `psx`, `redox`, `rtems`, `solaris`, `solid_asp3`, `teeos`, `trusty`, `tvos`, `uefi`, `unknown`, `visionos`, and `vita` and 6 more
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the macro `$crate::custom_panic_default` which comes from the expansion of the attribute macro `program` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `anchor-debug`
 --> programs/token-2022-kashe/src/instructions/initialize.rs:8:10
  |
8 | #[derive(Accounts)]
  |          ^^^^^^^^
  |
  = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
  = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
  = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
  = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unused import: `self`
 --> programs/token-2022-kashe/src/instructions/create_pool.rs:3:42
  |
3 |     solana_program::system_instruction::{self},
  |                                          ^^^^
  |
  = note: `#[warn(unused_imports)]` on by default

warning: unexpected `cfg` condition value: `anchor-debug`
  --> programs/token-2022-kashe/src/instructions/create_pool.rs:16:10
   |
16 | #[derive(Accounts)]
   |          ^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `anchor-debug`
 --> programs/token-2022-kashe/src/instructions/add_liquidity.rs:8:10
  |
8 | #[derive(Accounts)]
  |          ^^^^^^^^
  |
  = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
  = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
  = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
  = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unused import: `std::ops::Div`
 --> programs/token-2022-kashe/src/instructions/buy.rs:1:5
  |
1 | use std::ops::Div;
  |     ^^^^^^^^^^^^^

warning: unused import: `native_token::LAMPORTS_PER_SOL`
 --> programs/token-2022-kashe/src/instructions/buy.rs:5:22
  |
5 |     solana_program::{native_token::LAMPORTS_PER_SOL, system_instruction},
  |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `anchor_lang::error::Error`
  --> programs/token-2022-kashe/src/instructions/buy.rs:18:5
   |
18 | use anchor_lang::error::Error;
   |     ^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `anchor_lang::prelude::*`
  --> programs/token-2022-kashe/src/instructions/buy.rs:19:5
   |
19 | use anchor_lang::prelude::*;
   |     ^^^^^^^^^^^^^^^^^^^^^^^

warning: unexpected `cfg` condition value: `anchor-debug`
  --> programs/token-2022-kashe/src/instructions/buy.rs:23:10
   |
23 | #[derive(Accounts)]
   |          ^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unused import: `Div`
 --> programs/token-2022-kashe/src/instructions/sell.rs:1:16
  |
1 | use std::ops::{Div};
  |                ^^^

warning: unused import: `native_token::LAMPORTS_PER_SOL`
 --> programs/token-2022-kashe/src/instructions/sell.rs:5:22
  |
5 |     solana_program::{native_token::LAMPORTS_PER_SOL, system_instruction},
  |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `anchor_lang::error::Error`
  --> programs/token-2022-kashe/src/instructions/sell.rs:18:5
   |
18 | use anchor_lang::error::Error;
   |     ^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `anchor_lang::prelude::*`
  --> programs/token-2022-kashe/src/instructions/sell.rs:19:5
   |
19 | use anchor_lang::prelude::*;
   |     ^^^^^^^^^^^^^^^^^^^^^^^

warning: unexpected `cfg` condition value: `anchor-debug`
  --> programs/token-2022-kashe/src/instructions/sell.rs:23:10
   |
23 | #[derive(Accounts)]
   |          ^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `anchor-debug`
 --> programs/token-2022-kashe/src/instructions/withdraw.rs:7:10
  |
7 | #[derive(Accounts)]
  |          ^^^^^^^^
  |
  = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
  = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
  = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
  = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `anchor-debug`
 --> programs/token-2022-kashe/src/instructions/withdraw_fees.rs:9:10
  |
9 | #[derive(Accounts)]
  |          ^^^^^^^^
  |
  = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
  = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
  = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
  = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unused imports: `Div` and `Mul`
 --> programs/token-2022-kashe/src/utils/calc_swap_quote.rs:1:16
  |
1 | use std::ops::{Div, Mul};
  |                ^^^  ^^^

warning: unused import: `crate::error::ErrorCode`
  --> programs/token-2022-kashe/src/lib.rs:10:5
   |
10 | use crate::error::ErrorCode;
   |     ^^^^^^^^^^^^^^^^^^^^^^^

warning: unexpected `cfg` condition value: `anchor-debug`
  --> programs/token-2022-kashe/src/lib.rs:17:1
   |
17 | #[program]
   | ^^^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the attribute macro `program` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `anchor-debug`
  --> programs/token-2022-kashe/src/lib.rs:17:1
   |
17 | #[program]
   | ^^^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: constant `lamports_per_sol` should have an upper case name
 --> programs/token-2022-kashe/src/utils/calc_swap_quote.rs:2:7
  |
2 | const lamports_per_sol: u64 = 1_000_000_000;
  |       ^^^^^^^^^^^^^^^^ help: convert the identifier to upper case: `LAMPORTS_PER_SOL`
  |
  = note: `#[warn(non_upper_case_globals)]` on by default

warning: `token-2022-kashe` (lib test) generated 30 warnings (5 duplicates) (run `cargo fix --lib -p token-2022-kashe --tests` to apply 11 suggestions)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 31.46s
     Running unittests src/lib.rs (/Users/gp/CascadeProjects/kashe-sol-program/target/debug/deps/token_2022_kashe-82d6418408040251)
(base) gp@Gregorys-MBP-2 kashe-sol-program % anchor clean 
Updating program ids...
Found incorrect program id declaration in "/Users/gp/CascadeProjects/kashe-sol-program/programs/token-2022-kashe/src/lib.rs"
Updated to Xr9FzcWQr2oVSiXXVuLz78eBZPu86xd2mNmES5Ub9Jm

Found incorrect program id declaration in Anchor.toml for the program `token_2022_kashe`
Updated to Xr9FzcWQr2oVSiXXVuLz78eBZPu86xd2mNmES5Ub9Jm

All program id declarations are synced.
(base) gp@Gregorys-MBP-2 kashe-sol-program % anchor build
   Compiling proc-macro2 v1.0.89
   Compiling unicode-ident v1.0.13
   Compiling version_check v0.9.5
   Compiling typenum v1.17.0
   Compiling libc v0.2.164
   Compiling syn v1.0.109
   Compiling serde v1.0.215
   Compiling thiserror v1.0.69
   Compiling serde_json v1.0.133
   Compiling semver v1.0.23
   Compiling cfg-if v1.0.0
   Compiling hashbrown v0.15.1
   Compiling equivalent v1.0.1
   Compiling shlex v1.3.0
   Compiling once_cell v1.20.2
   Compiling toml_datetime v0.6.8
   Compiling winnow v0.6.20
   Compiling indexmap v2.6.0
   Compiling generic-array v0.14.7
   Compiling rustc_version v0.4.1
   Compiling quote v1.0.37
   Compiling syn v2.0.87
   Compiling cpufeatures v0.2.15
   Compiling jobserver v0.1.32
   Compiling autocfg v1.4.0
   Compiling subtle v2.4.1
   Compiling cc v1.2.1
   Compiling ahash v0.8.11
   Compiling ahash v0.7.8
   Compiling toml_edit v0.22.22
   Compiling feature-probe v0.1.1
   Compiling bv v0.11.1
   Compiling crypto-common v0.1.6
   Compiling block-buffer v0.10.4
   Compiling solana-frozen-abi-macro v1.18.26
   Compiling cfg_aliases v0.2.1
   Compiling digest v0.10.7
   Compiling zerocopy v0.7.35
   Compiling rustversion v1.0.18
   Compiling sha2 v0.10.8
   Compiling borsh v1.5.3
   Compiling memoffset v0.9.1
   Compiling num-traits v0.2.19
   Compiling solana-frozen-abi v1.18.26
   Compiling hashbrown v0.11.2
   Compiling proc-macro-crate v3.2.0
   Compiling hashbrown v0.13.2
   Compiling arrayref v0.3.9
   Compiling keccak v0.1.5
   Compiling memchr v2.7.4
   Compiling constant_time_eq v0.3.1
   Compiling bs58 v0.4.0
   Compiling lazy_static v1.5.0
   Compiling either v1.13.0
   Compiling ryu v1.0.18
   Compiling arrayvec v0.7.6
   Compiling log v0.4.22
   Compiling itoa v1.0.11
   Compiling itertools v0.10.5
   Compiling sha3 v0.10.8
   Compiling borsh-derive-internal v0.10.4
   Compiling borsh-schema-derive-internal v0.9.3
   Compiling borsh-schema-derive-internal v0.10.4
   Compiling borsh-derive-internal v0.9.3
   Compiling getrandom v0.2.15
   Compiling anyhow v1.0.93
   Compiling unicode-segmentation v1.12.0
   Compiling heck v0.3.3
   Compiling base64 v0.21.7
   Compiling bs58 v0.5.1
   Compiling solana-security-txt v1.1.1
   Compiling assert_matches v1.5.0
   Compiling blake3 v1.5.1
   Compiling solana-program v1.18.26
   Compiling num-derive v0.3.3
   Compiling anchor-derive-space v0.30.1
   Compiling serde_derive v1.0.215
   Compiling thiserror-impl v1.0.69
   Compiling borsh-derive v1.5.3
   Compiling bytemuck_derive v1.8.0
   Compiling solana-sdk-macro v1.18.26
   Compiling num-derive v0.4.2
   Compiling spl-program-error-derive v0.4.1
   Compiling num_enum_derive v0.7.3
   Compiling spl-discriminator-syn v0.2.0
   Compiling num_enum v0.7.3
   Compiling spl-discriminator-derive v0.2.0
   Compiling bytemuck v1.19.0
   Compiling serde_bytes v0.11.15
   Compiling bincode v1.3.3
   Compiling toml v0.5.11
   Compiling anchor-lang-idl-spec v0.1.0
   Compiling anchor-syn v0.30.1
   Compiling proc-macro-crate v0.1.5
   Compiling anchor-lang-idl v0.1.1
   Compiling borsh-derive v0.9.3
   Compiling borsh-derive v0.10.4
   Compiling borsh v0.10.4
   Compiling borsh v0.9.3
   Compiling anchor-attribute-event v0.30.1
   Compiling anchor-derive-accounts v0.30.1
   Compiling anchor-attribute-constant v0.30.1
   Compiling anchor-attribute-access-control v0.30.1
   Compiling anchor-attribute-account v0.30.1
   Compiling anchor-attribute-error v0.30.1
   Compiling anchor-derive-serde v0.30.1
   Compiling solana-zk-token-sdk v1.18.26
   Compiling spl-program-error v0.4.4
   Compiling spl-discriminator v0.2.5
   Compiling spl-token v4.0.3
   Compiling spl-memo v4.0.4
   Compiling mpl-token-metadata v4.1.2
   Compiling spl-pod v0.2.5
   Compiling spl-type-length-value v0.4.6
   Compiling spl-token-group-interface v0.2.5
   Compiling spl-tlv-account-resolution v0.6.5
   Compiling spl-token-metadata-interface v0.3.5
   Compiling spl-transfer-hook-interface v0.6.5
   Compiling spl-token-2022 v3.0.4
   Compiling anchor-attribute-program v0.30.1
   Compiling spl-associated-token-account v3.0.4
   Compiling anchor-lang v0.30.1
   Compiling anchor-spl v0.30.1
   Compiling token-2022-kashe v0.1.0 (/Users/gp/CascadeProjects/kashe-sol-program/programs/token-2022-kashe)
warning: unused import: `self`
 --> programs/token-2022-kashe/src/instructions/create_pool.rs:3:42
  |
3 |     solana_program::system_instruction::{self},
  |                                          ^^^^
  |
  = note: `#[warn(unused_imports)]` on by default

warning: unused import: `std::ops::Div`
 --> programs/token-2022-kashe/src/instructions/buy.rs:1:5
  |
1 | use std::ops::Div;
  |     ^^^^^^^^^^^^^

warning: unused import: `native_token::LAMPORTS_PER_SOL`
 --> programs/token-2022-kashe/src/instructions/buy.rs:5:22
  |
5 |     solana_program::{native_token::LAMPORTS_PER_SOL, system_instruction},
  |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `anchor_lang::error::Error`
  --> programs/token-2022-kashe/src/instructions/buy.rs:18:5
   |
18 | use anchor_lang::error::Error;
   |     ^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `anchor_lang::prelude::*`
  --> programs/token-2022-kashe/src/instructions/buy.rs:19:5
   |
19 | use anchor_lang::prelude::*;
   |     ^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `Div`
 --> programs/token-2022-kashe/src/instructions/sell.rs:1:16
  |
1 | use std::ops::{Div};
  |                ^^^

warning: unused import: `native_token::LAMPORTS_PER_SOL`
 --> programs/token-2022-kashe/src/instructions/sell.rs:5:22
  |
5 |     solana_program::{native_token::LAMPORTS_PER_SOL, system_instruction},
  |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `anchor_lang::error::Error`
  --> programs/token-2022-kashe/src/instructions/sell.rs:18:5
   |
18 | use anchor_lang::error::Error;
   |     ^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `anchor_lang::prelude::*`
  --> programs/token-2022-kashe/src/instructions/sell.rs:19:5
   |
19 | use anchor_lang::prelude::*;
   |     ^^^^^^^^^^^^^^^^^^^^^^^

warning: unused imports: `Div`, `Mul`
 --> programs/token-2022-kashe/src/utils/calc_swap_quote.rs:1:16
  |
1 | use std::ops::{Div, Mul};
  |                ^^^  ^^^

warning: unused import: `crate::error::ErrorCode`
  --> programs/token-2022-kashe/src/lib.rs:10:5
   |
10 | use crate::error::ErrorCode;
   |     ^^^^^^^^^^^^^^^^^^^^^^^

warning: constant `lamports_per_sol` should have an upper case name
 --> programs/token-2022-kashe/src/utils/calc_swap_quote.rs:2:7
  |
2 | const lamports_per_sol: u64 = 1_000_000_000;
  |       ^^^^^^^^^^^^^^^^ help: convert the identifier to upper case: `LAMPORTS_PER_SOL`
  |
  = note: `#[warn(non_upper_case_globals)]` on by default

warning: `token-2022-kashe` (lib) generated 12 warnings (run `cargo fix --lib -p token-2022-kashe` to apply 11 suggestions)
    Finished release [optimized] target(s) in 58.96s
   Compiling proc-macro2 v1.0.89
   Compiling unicode-ident v1.0.13
   Compiling version_check v0.9.5
   Compiling typenum v1.17.0
   Compiling cfg-if v1.0.0
   Compiling serde v1.0.215
   Compiling libc v0.2.164
   Compiling syn v1.0.109
   Compiling subtle v2.4.1
   Compiling autocfg v1.4.0
   Compiling byteorder v1.5.0
   Compiling generic-array v0.14.7
   Compiling equivalent v1.0.1
   Compiling memchr v2.7.4
   Compiling hashbrown v0.15.1
   Compiling indexmap v2.6.0
   Compiling winnow v0.6.20
   Compiling once_cell v1.20.2
   Compiling anyhow v1.0.93
   Compiling quote v1.0.37
   Compiling thiserror v1.0.69
   Compiling syn v2.0.87
   Compiling serde_json v1.0.133
   Compiling getrandom v0.2.15
   Compiling cpufeatures v0.2.15
   Compiling rand_core v0.6.4
   Compiling ryu v1.0.18
   Compiling semver v1.0.23
   Compiling itoa v1.0.11
   Compiling num-traits v0.2.19
   Compiling getrandom v0.1.16
   Compiling crunchy v0.2.2
   Compiling crypto-common v0.1.6
   Compiling block-buffer v0.10.4
   Compiling opaque-debug v0.3.1
   Compiling either v1.13.0
   Compiling digest v0.10.7
   Compiling ahash v0.8.11
   Compiling crossbeam-utils v0.8.20
   Compiling sha2 v0.10.8
   Compiling paste v1.0.15
   Compiling block-padding v0.2.1
   Compiling num-integer v0.1.46
   Compiling rustc_version v0.4.1
   Compiling rand_core v0.5.1
   Compiling num-bigint v0.4.6
   Compiling digest v0.9.0
   Compiling jobserver v0.1.32
   Compiling wasm-bindgen-shared v0.2.95
   Compiling shlex v1.3.0
   Compiling cc v1.2.1
   Compiling libsecp256k1-core v0.2.2
   Compiling itertools v0.10.5
   Compiling crossbeam-epoch v0.9.18
   Compiling rayon-core v1.12.1
   Compiling crossbeam-deque v0.8.5
   Compiling ahash v0.7.8
   Compiling bumpalo v3.16.0
   Compiling log v0.4.22
   Compiling feature-probe v0.1.1
   Compiling wasm-bindgen-backend v0.2.95
   Compiling libsecp256k1-gen-ecmult v0.2.1
   Compiling bv v0.11.1
   Compiling libsecp256k1-gen-genmult v0.2.1
   Compiling borsh-derive-internal v0.10.4
   Compiling solana-frozen-abi-macro v1.18.26
   Compiling bitmaps v2.1.0
   Compiling keccak v0.1.5
   Compiling im v15.1.0
   Compiling tinyvec_macros v0.1.1
   Compiling rustversion v1.0.18
   Compiling lazy_static v1.5.0
   Compiling cfg_aliases v0.2.1
   Compiling borsh v1.5.3
   Compiling tinyvec v1.8.0
   Compiling ark-serialize-derive v0.4.2
   Compiling ark-ff-asm v0.4.2
   Compiling derivative v2.2.0
   Compiling ark-ff-macros v0.4.2
   Compiling serde_derive v1.0.215
   Compiling zerocopy-derive v0.7.35
   Compiling thiserror-impl v1.0.69
   Compiling zeroize_derive v1.4.2
   Compiling sized-chunks v0.6.5
   Compiling wasm-bindgen-macro-support v0.2.95
   Compiling blake3 v1.5.1
   Compiling rayon v1.10.0
   Compiling zeroize v1.3.0
   Compiling libsecp256k1 v0.6.0
   Compiling borsh-derive-internal v0.9.3
   Compiling zerocopy v0.7.35
   Compiling borsh-schema-derive-internal v0.9.3
   Compiling borsh-schema-derive-internal v0.10.4
   Compiling solana-frozen-abi v1.18.26
   Compiling rand_xoshiro v0.6.0
   Compiling memoffset v0.9.1
   Compiling arrayref v0.3.9
   Compiling bs58 v0.4.0
   Compiling wasm-bindgen v0.2.95
   Compiling wasm-bindgen-macro v0.2.95
   Compiling hashbrown v0.11.2
   Compiling ppv-lite86 v0.2.20
   Compiling hashbrown v0.13.2
   Compiling rand_chacha v0.3.1
   Compiling rand_chacha v0.2.2
   Compiling rand v0.7.3
   Compiling rand v0.8.5
   Compiling unicode-normalization v0.1.24
   Compiling bytemuck_derive v1.8.0
   Compiling ark-std v0.4.0
   Compiling solana-program v1.18.26
   Compiling memmap2 v0.5.10
   Compiling arrayvec v0.7.6
   Compiling rustc-hash v1.1.0
   Compiling constant_time_eq v0.3.1
   Compiling base64 v0.12.3
   Compiling solana-sdk-macro v1.18.26
   Compiling num-derive v0.4.2
   Compiling base64 v0.21.7
   Compiling aho-corasick v1.1.3
   Compiling bytemuck v1.19.0
   Compiling regex-syntax v0.8.5
   Compiling fnv v1.0.7
   Compiling strsim v0.11.1
   Compiling ident_case v1.0.1
   Compiling darling_core v0.20.10
   Compiling signature v1.6.4
   Compiling atty v0.2.14
   Compiling ed25519 v1.5.3
   Compiling unicode-segmentation v1.12.0
   Compiling termcolor v1.4.1
   Compiling humantime v2.1.0
   Compiling heck v0.3.3
   Compiling solana-sdk v1.18.26
   Compiling percent-encoding v2.3.1
   Compiling derivation-path v0.2.0
   Compiling qstring v0.7.2
   Compiling uriparse v0.6.4
   Compiling qualifier_attr v0.2.2
   Compiling chrono v0.4.38
   Compiling siphasher v0.3.11
   Compiling bs58 v0.5.1
   Compiling assert_matches v1.5.0
   Compiling spl-discriminator-syn v0.2.0
   Compiling merlin v3.0.0
   Compiling spl-program-error-derive v0.4.1
   Compiling spl-discriminator-derive v0.2.0
   Compiling solana-security-txt v1.1.1
   Compiling num-derive v0.3.3
   Compiling regex-automata v0.4.9
   Compiling anchor-derive-space v0.30.1
   Compiling serde_spanned v0.6.8
   Compiling toml_datetime v0.6.8
   Compiling toml v0.5.11
   Compiling anchor-lang-idl-spec v0.1.0
   Compiling toml_edit v0.22.22
   Compiling serde_bytes v0.11.15
   Compiling bitflags v2.6.0
   Compiling block-buffer v0.9.0
   Compiling crypto-mac v0.8.0
   Compiling sha2 v0.9.9
   Compiling hmac v0.8.1
   Compiling curve25519-dalek v3.2.1
   Compiling ark-serialize v0.4.2
   Compiling proc-macro-crate v0.1.5
   Compiling hmac-drbg v0.3.0
   Compiling pbkdf2 v0.4.0
   Compiling ark-ff v0.4.2
   Compiling tiny-bip39 v0.8.2
   Compiling sha3 v0.10.8
   Compiling borsh-derive v0.9.3
   Compiling borsh-derive v0.10.4
   Compiling borsh v0.9.3
   Compiling proc-macro-crate v3.2.0
   Compiling borsh v0.10.4
   Compiling bincode v1.3.3
   Compiling regex v1.11.1
   Compiling darling_macro v0.20.10
   Compiling cipher v0.3.0
   Compiling toml v0.8.19
   Compiling env_logger v0.9.3
   Compiling darling v0.20.10
   Compiling ed25519-dalek v1.0.1
   Compiling hmac v0.12.1
   Compiling universal-hash v0.4.1
   Compiling polyval v0.5.3
   Compiling ed25519-dalek-bip32 v0.2.0
   Compiling borsh-derive v1.5.3
   Compiling num_enum_derive v0.7.3
   Compiling serde_with_macros v2.3.3
   Compiling cargo_toml v0.19.2
   Compiling solana-logger v1.18.26
   Compiling aes v0.7.5
   Compiling ctr v0.8.0
   Compiling pbkdf2 v0.11.0
   Compiling aead v0.4.3
   Compiling sha3 v0.9.1
   Compiling anchor-lang-idl v0.1.1
   Compiling aes-gcm-siv v0.10.3
   Compiling serde_with v2.3.3
   Compiling num_enum v0.7.3
   Compiling anchor-syn v0.30.1
   Compiling anchor-attribute-account v0.30.1
   Compiling anchor-attribute-error v0.30.1
   Compiling anchor-derive-serde v0.30.1
   Compiling anchor-attribute-constant v0.30.1
   Compiling anchor-attribute-event v0.30.1
   Compiling anchor-attribute-program v0.30.1
   Compiling anchor-derive-accounts v0.30.1
   Compiling anchor-attribute-access-control v0.30.1
   Compiling ark-poly v0.4.2
   Compiling ark-ec v0.4.2
   Compiling ark-bn254 v0.4.0
   Compiling light-poseidon v0.2.0
   Compiling spl-program-error v0.4.4
   Compiling spl-discriminator v0.2.5
   Compiling spl-token v4.0.3
   Compiling spl-memo v4.0.4
   Compiling mpl-token-metadata v4.1.2
   Compiling anchor-lang v0.30.1
   Compiling solana-zk-token-sdk v1.18.26
   Compiling spl-pod v0.2.5
   Compiling spl-type-length-value v0.4.6
   Compiling spl-token-group-interface v0.2.5
   Compiling spl-tlv-account-resolution v0.6.5
   Compiling spl-token-metadata-interface v0.3.5
   Compiling spl-transfer-hook-interface v0.6.5
   Compiling spl-token-2022 v3.0.4
   Compiling spl-associated-token-account v3.0.4
   Compiling anchor-spl v0.30.1
   Compiling token-2022-kashe v0.1.0 (/Users/gp/CascadeProjects/kashe-sol-program/programs/token-2022-kashe)
warning: unexpected `cfg` condition value: `custom-heap`
  --> programs/token-2022-kashe/src/lib.rs:17:1
   |
17 | #[program]
   | ^^^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `custom-heap` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: `#[warn(unexpected_cfgs)]` on by default
   = note: this warning originates in the macro `$crate::custom_heap_default` which comes from the expansion of the attribute macro `program` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `solana`
  --> programs/token-2022-kashe/src/lib.rs:17:1
   |
17 | #[program]
   | ^^^^^^^^^^
   |
   = note: expected values for `target_os` are: `aix`, `android`, `cuda`, `dragonfly`, `emscripten`, `espidf`, `freebsd`, `fuchsia`, `haiku`, `hermit`, `horizon`, `hurd`, `illumos`, `ios`, `l4re`, `linux`, `macos`, `netbsd`, `none`, `nto`, `nuttx`, `openbsd`, `psp`, `psx`, `redox`, `rtems`, `solaris`, `solid_asp3`, `teeos`, `trusty`, `tvos`, `uefi`, `unknown`, `visionos`, and `vita` and 6 more
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the macro `$crate::custom_heap_default` which comes from the expansion of the attribute macro `program` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `custom-panic`
  --> programs/token-2022-kashe/src/lib.rs:17:1
   |
17 | #[program]
   | ^^^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `custom-panic` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the macro `$crate::custom_panic_default` which comes from the expansion of the attribute macro `program` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `solana`
  --> programs/token-2022-kashe/src/lib.rs:17:1
   |
17 | #[program]
   | ^^^^^^^^^^
   |
   = note: expected values for `target_os` are: `aix`, `android`, `cuda`, `dragonfly`, `emscripten`, `espidf`, `freebsd`, `fuchsia`, `haiku`, `hermit`, `horizon`, `hurd`, `illumos`, `ios`, `l4re`, `linux`, `macos`, `netbsd`, `none`, `nto`, `nuttx`, `openbsd`, `psp`, `psx`, `redox`, `rtems`, `solaris`, `solid_asp3`, `teeos`, `trusty`, `tvos`, `uefi`, `unknown`, `visionos`, and `vita` and 6 more
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the macro `$crate::custom_panic_default` which comes from the expansion of the attribute macro `program` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `anchor-debug`
 --> programs/token-2022-kashe/src/instructions/initialize.rs:8:10
  |
8 | #[derive(Accounts)]
  |          ^^^^^^^^
  |
  = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
  = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
  = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
  = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unused import: `self`
 --> programs/token-2022-kashe/src/instructions/create_pool.rs:3:42
  |
3 |     solana_program::system_instruction::{self},
  |                                          ^^^^
  |
  = note: `#[warn(unused_imports)]` on by default

warning: unexpected `cfg` condition value: `anchor-debug`
  --> programs/token-2022-kashe/src/instructions/create_pool.rs:16:10
   |
16 | #[derive(Accounts)]
   |          ^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `anchor-debug`
 --> programs/token-2022-kashe/src/instructions/add_liquidity.rs:8:10
  |
8 | #[derive(Accounts)]
  |          ^^^^^^^^
  |
  = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
  = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
  = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
  = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unused import: `std::ops::Div`
 --> programs/token-2022-kashe/src/instructions/buy.rs:1:5
  |
1 | use std::ops::Div;
  |     ^^^^^^^^^^^^^

warning: unused import: `native_token::LAMPORTS_PER_SOL`
 --> programs/token-2022-kashe/src/instructions/buy.rs:5:22
  |
5 |     solana_program::{native_token::LAMPORTS_PER_SOL, system_instruction},
  |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `anchor_lang::error::Error`
  --> programs/token-2022-kashe/src/instructions/buy.rs:18:5
   |
18 | use anchor_lang::error::Error;
   |     ^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `anchor_lang::prelude::*`
  --> programs/token-2022-kashe/src/instructions/buy.rs:19:5
   |
19 | use anchor_lang::prelude::*;
   |     ^^^^^^^^^^^^^^^^^^^^^^^

warning: unexpected `cfg` condition value: `anchor-debug`
  --> programs/token-2022-kashe/src/instructions/buy.rs:23:10
   |
23 | #[derive(Accounts)]
   |          ^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unused import: `Div`
 --> programs/token-2022-kashe/src/instructions/sell.rs:1:16
  |
1 | use std::ops::{Div};
  |                ^^^

warning: unused import: `native_token::LAMPORTS_PER_SOL`
 --> programs/token-2022-kashe/src/instructions/sell.rs:5:22
  |
5 |     solana_program::{native_token::LAMPORTS_PER_SOL, system_instruction},
  |                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `anchor_lang::error::Error`
  --> programs/token-2022-kashe/src/instructions/sell.rs:18:5
   |
18 | use anchor_lang::error::Error;
   |     ^^^^^^^^^^^^^^^^^^^^^^^^^

warning: unused import: `anchor_lang::prelude::*`
  --> programs/token-2022-kashe/src/instructions/sell.rs:19:5
   |
19 | use anchor_lang::prelude::*;
   |     ^^^^^^^^^^^^^^^^^^^^^^^

warning: unexpected `cfg` condition value: `anchor-debug`
  --> programs/token-2022-kashe/src/instructions/sell.rs:23:10
   |
23 | #[derive(Accounts)]
   |          ^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `anchor-debug`
 --> programs/token-2022-kashe/src/instructions/withdraw.rs:7:10
  |
7 | #[derive(Accounts)]
  |          ^^^^^^^^
  |
  = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
  = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
  = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
  = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `anchor-debug`
 --> programs/token-2022-kashe/src/instructions/withdraw_fees.rs:9:10
  |
9 | #[derive(Accounts)]
  |          ^^^^^^^^
  |
  = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
  = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
  = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
  = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unused imports: `Div` and `Mul`
 --> programs/token-2022-kashe/src/utils/calc_swap_quote.rs:1:16
  |
1 | use std::ops::{Div, Mul};
  |                ^^^  ^^^

warning: unused import: `crate::error::ErrorCode`
  --> programs/token-2022-kashe/src/lib.rs:10:5
   |
10 | use crate::error::ErrorCode;
   |     ^^^^^^^^^^^^^^^^^^^^^^^

warning: unexpected `cfg` condition value: `anchor-debug`
  --> programs/token-2022-kashe/src/lib.rs:17:1
   |
17 | #[program]
   | ^^^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the attribute macro `program` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: unexpected `cfg` condition value: `anchor-debug`
  --> programs/token-2022-kashe/src/lib.rs:17:1
   |
17 | #[program]
   | ^^^^^^^^^^
   |
   = note: expected values for `feature` are: `cpi`, `default`, `idl-build`, `no-entrypoint`, `no-idl`, and `no-log-ix-name`
   = help: consider adding `anchor-debug` as a feature in `Cargo.toml`
   = note: see <https://doc.rust-lang.org/nightly/rustc/check-cfg/cargo-specifics.html> for more information about checking conditional configuration
   = note: this warning originates in the derive macro `Accounts` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: constant `lamports_per_sol` should have an upper case name
 --> programs/token-2022-kashe/src/utils/calc_swap_quote.rs:2:7
  |
2 | const lamports_per_sol: u64 = 1_000_000_000;
  |       ^^^^^^^^^^^^^^^^ help: convert the identifier to upper case: `LAMPORTS_PER_SOL`
  |
  = note: `#[warn(non_upper_case_globals)]` on by default

warning: `token-2022-kashe` (lib test) generated 30 warnings (5 duplicates) (run `cargo fix --lib -p token-2022-kashe --tests` to apply 11 suggestions)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 31.25s
     Running unittests src/lib.rs (/Users/gp/CascadeProjects/kashe-sol-program/target/debug/deps/token_2022_kashe-82d6418408040251)
(base) gp@Gregorys-MBP-2 kashe-sol-program % anchor deploy
Deploying cluster: https://api.mainnet-beta.solana.com
Upgrade authority: /Users/gp/.config/solana/id.json
Deploying program "token_2022_kashe"...
Program path: /Users/gp/CascadeProjects/kashe-sol-program/target/deploy/token_2022_kashe.so...
Blockhash expired. 4 retries remaining
Blockhash expired. 3 retries remaining
Blockhash expired. 2 retries remaining
Blockhash expired. 1 retries remaining
Blockhash expired. 0 retries remaining
================================================================================
Recover the intermediate account's ephemeral keypair file with
`solana-keygen recover` and the following 12-word seed phrase:
================================================================================
settle gorilla edge tide blossom document direct zone devote cricket crime piano = FbSXFJYW8VVVsazke1tgA6Goo1m7Qdw2YmBqvbRdqUZH
================================================================================
To resume a deploy, pass the recovered keypair as the
[BUFFER_SIGNER] to `solana program deploy` or `solana program write-buffer'.
Or to recover the account's lamports, pass it as the
[BUFFER_ACCOUNT_ADDRESS] argument to `solana program close`.
================================================================================
Error: Data writes to account failed: Custom error: Max retries exceeded
There was a problem deploying: Output { status: ExitStatus(unix_wait_status(256)), stdout: "", stderr: "" }.
(base) gp@Gregorys-MBP-2 kashe-sol-program % solana program close FbSXFJYW8VVVsazke1tgA6Goo1m7Qdw2YmBqvbRdqUZH --buffer recovered-keypair.json
