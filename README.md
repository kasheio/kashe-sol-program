DEVNET
solana config set --url devnet
solana config set --keypair ~/.config/solana/id-devnet.json

MAINNET
solana config set --url mainnet-beta
solana config set --keypair ~/.config/solana/id.json


solana config get


rm -frd /Users/gp/CascadeProjects/kashe-sol-program/dist
rm -frd /Users/gp/CascadeProjects/kashe-sol-program/target
anchor clean
anchor build
anchor deploy --provider.cluster devnet
Run kashe script with initialize
FUND THE FEE ACCOUNT!!!!

----old
To deploy:
anchor clean
anchor build
anchor keys list (to get the program id)
change declare_id in lib.rs
anchor deploy
Run kashe script with initialize
