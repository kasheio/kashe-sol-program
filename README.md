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


(5) ['Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb invoke [1]', 'Program log: Instruction: SyncNative', 'Program log: Error: IncorrectProgramId', 'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb consumed 531 of 200000 compute units', 'Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: incorrect program id for instruction']

  Address: CTofg77KrCCdUKoGmcFS67zchX1jQCtz8Zxd3iWZpm9E
Error initializing: AnchorError: AnchorError caused by account: global_configuration. Error Code: AccountDidNotDeserialize. Error Number: 3003. Error Message: Failed to deserialize the account.
    at AnchorError.parse (/Users/gp/CascadeProjects/kashe-sol-program/node_modules/@coral-xyz/anchor/dist/cjs/error.js:139:20)
    at translateError (/Users/gp/CascadeProjects/kashe-sol-program/node_modules/@coral-xyz/anchor/dist/cjs/error.js:225:37)
    at MethodsBuilder.rpc [as _rpcFn] (/Users/gp/CascadeProjects/kashe-sol-program/node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/rpc.js:18:53)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {errorLogs: Array(1), logs: Array(7), error: {…}, _programErrorStack: ProgramErrorStack, stack: 'Error: AnchorError caused by account: global_…ons (node:internal/process/task_queues:105:5)', …}
Uncaught AnchorError AnchorError: AnchorError caused by account: global_configuration. Error Code: AccountDidNotDeserialize. Error Number: 3003. Error Message: Failed to deserialize the account.
    at parse (/Users/gp/CascadeProjects/kashe-sol-program/node_modules/@coral-xyz/anchor/dist/cjs/error.js:139:20)
    at translateError (/Users/gp/CascadeProjects/kashe-sol-program/node_modules/@coral-xyz/anchor/dist/cjs/error.js:225:37)
    at rpc (/Users/gp/CascadeProjects/kashe-sol-program/node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/rpc.js:18:53)
    at processTicksAndRejections (<node_internals>/internal/process/task_queues:105:5)
