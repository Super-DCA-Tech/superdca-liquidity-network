# Super DCA Liquidity Network
This repository is a Hardhat project that contains the smart contracts for the Super DCA Liquidity Network. 

## Overview
The Super DCA Liquidity Network is a collection of Uniswap V3 Liquidity Pool Positions that autocompound their fees to increase the liquidity overtime. This implementation is design to permenantly lock liquidity. In this way, Super DCA Liquidity Network serves as an immutable liquidity provider that can be used by other protocols.

## Features
1. Accepts Uniswap V3 Liquidity Pool Positions (NTFs) as deposits
2. Automatically compounds fees back into pools using Gelato Automate and Revert Finance's SelfCompounder
3. After 60 days without withdrawing LPs, the Uniswap V3 Liquidity Pool Positions can never be withdrawn

## Protocol Specifications

### Dependancies
- Uniswap V3 - Automated Market Maker used by the Super DCA Liquidity Network
- Gelato Automate - Executes the transaction that auto-compounds Uniswap LP fees 
- SelfCompounder - Revert Finance's contract that auto-compounds Uniswap LP fees

### Variables
- `uint256[] uniswapNFTs` - Array of Uniswap V3 NFTs that are deposited into the Super DCA Liquidity Network
- `bytes32[] public collectTaskIds` - Array of Gelato Automate taskIds
- `mapping(ISuperToken => uint) public tokens` - Mapping of user balances

### Functions

#### `onERC721Received(address to, address from, uint256 tokenId, bytes calldata data)`
- Called when a Uniswap V3 NFT is deposited into the Super DCA Liquidity Network
- Records the Uniswap V3 NFT in the `uniswapNFTs` array

#### `compound(uint256 uinswapNFTId)`
- Called by Gelato Automate to compounds fees from a Uniswap V3 NFT
- Uses Revert Finance's SelfCompounder to compound fees

#### `_createCollectFeesTask(uint256 tokenId)`
- Creates a Gelato Automate task to collect fees from a Uniswap V3 NFT
- Used by the `onERC721Received` function

#### `_swapForGas(INonfungiblePositionManager.Position memory position)`
- Swaps 1% of the collected fees for gas tokens (e.g. MATIC)
- Will swap the fee token to RIC and then swap RIC to MATIC 
- Assumes that all pools are using the same fee rate (e.g. 0.05%)
