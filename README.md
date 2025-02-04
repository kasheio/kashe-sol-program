DEVNET
solana config set --url devnet
solana config set --keypair ~/.config/solana/id-devnet.json

MAINNET
solana config set --url mainnet-beta
solana config set --keypair ~/.config/solana/id.json


solana config get

To deploy:
anchor clean
anchor build
anchor keys list (to get the program id)
change declare_id in lib.rs
anchor deploy
Run kashe script with initialize
