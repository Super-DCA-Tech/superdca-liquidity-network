# Create Pools
The initial Super DCA liquidity pools are created using the UniswapV3 Factory. This document contains the commands used to set up the pools.



## Initial DCA Price
Super DCA is an experiment in capital efficiency and incentive compatibility so tracking the outcomes of this experiement will have a lot to due with tracking the token price. Therefore, to make tracking easier, the DCA token is initially paired 1:1 with USDC. This will make it easier to track the price of the DCA token as it fluctuates, with 1 USDC serving as the intial reference point for all participants in the experiment.

# Sepolia

## Pools
| Contract | Address |
| --- | --- |
| fUSDC-DCA | 0x871d93A6be6d338592C24285d623a645014702B1 |
| fDAI-DCA |  |

## fUSDC-WETH
```shell
npx hardhat createPool \
--token0 0xe72f289584eDA2bE69Cfe487f4638F09bAc920Db \
--token1 0xfff9976782d46cc05630d1f6ebab18b2324d6b14 \
--fee 500 \
--reserve0 100000000000000000 \
--reserve1 324645811419741 \
--network sepolia

npx hardhat mintLiquidity \
--token0 0xe72f289584eDA2bE69Cfe487f4638F09bAc920Db \
--token1 0xfff9976782d46cc05630d1f6ebab18b2324d6b14 \
--fee 500 \
--amount1 324645811419741000 \
--amount0 100000000000000000000 \
--ticklower -887271 \
--tickupper 887271 \
--network sepolia
```

## USDC-DCA
```shell
npx hardhat createPool \
--token1 0xe72f289584eDA2bE69Cfe487f4638F09bAc920Db \
--token0 0x26AE4b2b875Ec1DC6e4FDc3e9C74E344c3b43A54 \
--fee 3000 \
--reserve1 1000000000000000000000 \
--reserve0 1000000000000000000000 \
--network sepolia

npx hardhat mintLiquidity \
--token1 0xe72f289584eDA2bE69Cfe487f4638F09bAc920Db \
--token0 0x26AE4b2b875Ec1DC6e4FDc3e9C74E344c3b43A54 \
--fee 3000 \
--amount0 1000000000000000000000 \
--amount1 1000000000000000000000 \
--ticklower -887271 \
--tickupper 887271 \
--network sepolia
```

## DAI-DCA
```shell

npx hardhat createPool \
--token1 0x4E89088Cd14064f38E5B2F309cFaB9C864F9a8e6 \
--token0 0x26AE4b2b875Ec1DC6e4FDc3e9C74E344c3b43A54 \
--fee 500 \
--reserve1 1000000000000000000000 \
--reserve0 1000000000000000000000 \
--network sepolia


npx hardhat mintLiquidity \
--token0 0x26AE4b2b875Ec1DC6e4FDc3e9C74E344c3b43A54 \
--token1 0x4E89088Cd14064f38E5B2F309cFaB9C864F9a8e6 \
--fee 500 \
--amount0 1000000000000000000000 \
--amount1 1000000000000000000000 \
--ticklower -887271 \
--tickupper 887271 \
--network sepolia
```

# Optimism

## Pools
| Contract | Address |
| --- | --- |
| USDC-DCA | 0x8C8Db50da771F663556a95a39B71305b56C26229 |
| ETH-DCA | 0x41B2324Ee8cC73b58f7452A6693E0ceE98A7Ac8D |
| OP-DCA | 0x6b42dd47c53040854892E595B7a79eD26EFEED03 | 

## USDC-DCA
```shell
npx hardhat createPool \
--token0 0x7F5c764cBc14f9669B88837ca1490cCa17c31607 \
--token1 0xb1599CDE32181f48f89683d3C5Db5C5D2C7C93cc \
--fee 500 \
--reserve0 1000000000 \
--reserve1 1000000000000000000000 \
--network tenderly
```

## ETH-DCA
* ETH/USDC: 2,985
```shell
npx hardhat createPool \
--token0 0x4200000000000000000000000000000000000006 \
--token1 0xb1599CDE32181f48f89683d3C5Db5C5D2C7C93cc \
--fee 500 \
--reserve0 335024088231943000 \
--reserve1 1000000000000000000000 \
--network tenderly
```

## OP-DCA
* OP/USDC: 2.47
```shell
npx hardhat createPool \
--token0 0x4200000000000000000000000000000000000042 \
--token1 0xb1599CDE32181f48f89683d3C5Db5C5D2C7C93cc \
--fee 500 \
--reserve0 404858299595141700000 \
--reserve1 1000000000000000000000 \
--network tenderly
```

## Localhost
* Fork off Optimism and run the following to add liquidity to a pool for testing
* USDC-DCA
```shell
npx hardhat mintLiquidity \
--token0 0x7F5c764cBc14f9669B88837ca1490cCa17c31607 \
--token1 0xb1599CDE32181f48f89683d3C5Db5C5D2C7C93cc \
--fee 500 \
--amount0 1028000000 \
--amount1 1000000000000000000000 \
--ticklower -887271 \
--tickupper 887271 \
--network tenderly
```
* ETH-DCA
```shell
npx hardhat mintLiquidity \
--token0 0x4200000000000000000000000000000000000006 \
--token1 0xb1599CDE32181f48f89683d3C5Db5C5D2C7C93cc \
--fee 500 \
--amount0 260950000000000000 \
--amount1 1000000000000000000000 \
--ticklower -887271 \
--tickupper 887271 \
--network tenderly
```
* OP-DCA
```shell
npx hardhat mintLiquidity \
--token0 0x4200000000000000000000000000000000000042 \
--token1 0xb1599CDE32181f48f89683d3C5Db5C5D2C7C93cc \
--fee 500 \
--amount0 394471000000000000000 \
--amount1 1000000000000000000000 \
--ticklower -887271 \
--tickupper 887271 \
--network tenderly
```


# Base Sepolia

## Pools
| Contract | Address |
| --- | --- |
| USDC-DCA | 0xb30927b093F8FD3d874fcD8DB2950D769eDc858E |
| ETH-DCA |  |
| ETH-USDC | 0x8DD67c2B910d39CA879CF9Df9FE611D48Cc2F19F | 
|  |  | 

## USDC-DCA
```shell
npx hardhat createPool \
--token0  0x1470BCf159639AA63914353F93c09E5BeF1113f0 \
--token1  0x6B0dacea6a72E759243c99Eaed840DEe9564C194 \
--fee 500 \
--reserve0 1000000000000000000000 \
--reserve1 1000000000000000000000 \
--network base_sepolia
```

## ETH-DCA
* ETH/USDC: 2,388
```shell
npx hardhat createPool \
--token0 0x4200000000000000000000000000000000000006 \
--token1 0x6B0dacea6a72E759243c99Eaed840DEe9564C194 \
--fee 500 \
--reserve0 335024088231943000 \
--reserve1 1000000000000000000000 \
--network base_Sepolia
```