import { task } from "hardhat/config";
import { nearestUsableTick } from "@uniswap/v3-sdk";
import { ethers } from "ethers";

const QuoterV2ABI = require("@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json").abi;
const bn = require("bignumber.js");
// Optimism
const UNISWAP_V3_FACTORY =  "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24"; // Base Sepolia
const UNISWAP_QUOTER_V2 = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
const UNISWAP_NFP_MANAGER = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const UNISWAP_STAKER = "0xe34139463bA50bD61336E0c446Bd8C0867c6fE65";

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

function encodePriceSqrt(reserve1: any, reserve0: any) {
  return ethers.BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString(),
  );
}


task("createIncentive", "Create a new UniswapV3 Incentive")
  .addParam("pool", "Address of the pool")
  .addParam("reward", "Address of the reward token")
  .addParam("amount", "Reward amount")
  .addParam("start", "Start time in seconds since epoch")
  .addParam("end", "End time in seconds since epoch")
  .addParam("refundee", "Refundee address")
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();

    const staker = await hre.ethers.getContractAt("IUniswapV3Staker", UNISWAP_STAKER);

    // Approve the staker contract to spend the reward tokens
    const tokenContract = await hre.ethers.getContractAt("IERC20", taskArgs.reward);
    const approveTx = await tokenContract.connect(deployer).approve(UNISWAP_STAKER, ethers.utils.parseUnits(taskArgs.amount, 18));
    await approveTx.wait();
    console.log("Approved reward token:", approveTx.hash);

    // Create the incentive key
    const incentiveKey = {
      rewardToken: taskArgs.reward,
      pool: taskArgs.pool,
      startTime: taskArgs.start,
      endTime: taskArgs.end,
      refundee: taskArgs.refundee
    };

    // Create the incentive
    const tx = await staker.connect(deployer).createIncentive(
      incentiveKey,
      ethers.utils.parseUnits(taskArgs.amount, 18)
    );
    await tx.wait();
    console.log("Incentive created:", tx.hash);
  });

task("quote", "Get a quote for a UniswapV3 pool")
  .addParam("token0", "Token0 for the pool")
  .addParam("token1", "Token1 for the pool")
  .addParam("amount", "The amount of token0 to deposit")
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    
    const quoter = new ethers.Contract(UNISWAP_QUOTER_V2, QuoterV2ABI, deployer);

    const params = {
      tokenIn: taskArgs.token0,
      tokenOut: taskArgs.token1,
      fee: 500,
      amountIn: taskArgs.amount,
      sqrtPriceLimitX96: 0,
    };

    const quote = await quoter.callStatic.quoteExactInputSingle(params);

    console.log("Quoted amount out:", quote.amountOut.toString());
  });

task("createPool", "Create a new pool on UniswapV3")
  .addParam("token0", "Token0 for the pool")
  .addParam("token1", "Token1 for the pool")
  .addParam("fee", "The pool fee to use (e.g. 500, 0.05%)")
  .addParam("reserve0", "The reserve of token0")
  .addParam("reserve1", "The reserve of token1")
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    

    const factory = await hre.ethers.getContractAt("IUniswapV3Factory", UNISWAP_V3_FACTORY);
    if (taskArgs.token0 > taskArgs.token1) {
      console.log("token0 must be less than token1");
      return;
    }

    let pool = await factory.getPool(taskArgs.token0, taskArgs.token1, taskArgs.fee);
    if (pool != hre.ethers.constants.AddressZero) {
      console.log("Pool already exists:", pool);
      return;
    }
    let tx = await factory.connect(deployer).createPool(taskArgs.token0, taskArgs.token1, taskArgs.fee, { gasLimit: 10000000 });
    await tx.wait();
    console.log("Pool created:", tx.hash);
    pool = await factory.getPool(taskArgs.token0, taskArgs.token1, taskArgs.fee);
    console.log("Pool address:", pool);
    const poolContract = await hre.ethers.getContractAt("IUniswapV3Pool", pool);
    // Initialize the pool
    const sqrtPriceX96 = encodePriceSqrt(taskArgs.reserve1, taskArgs.reserve0);
    console.log("Initializing pool with sqrtPriceX96:", sqrtPriceX96.toString());

    tx = await poolContract.connect(deployer).initialize(sqrtPriceX96);
    await tx.wait();
    console.log("Pool initialized:", tx.hash);
  });

task("mintLiquidity", "Add liquidity to a UniswapV3 pool")
  .addParam("token0", "Token0 for the pool")
  .addParam("token1", "Token1 for the pool")
  .addParam("fee", "The pool fee to use (e.g. 500, 0.05%)")
  .addParam("amount0", "The amount of token0 to deposit")
  .addParam("amount1", "The amount of token1 to deposit")
  .addParam("ticklower", "The lower tick")
  .addParam("tickupper", "The upper tick")
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();

    const factory = await hre.ethers.getContractAt("IUniswapV3Factory", UNISWAP_V3_FACTORY);
    const pool = await factory.getPool(taskArgs.token0, taskArgs.token1, taskArgs.fee);
    if (pool == hre.ethers.constants.AddressZero) {
      console.log("Pool does not exist:", taskArgs.token0, taskArgs.token1, taskArgs.fee);
      return;
    }
    const poolContract = await hre.ethers.getContractAt("IUniswapV3Pool", pool);

    // Minting Liquidity
    console.log("Minting liquidity");
    const token0Contract = await hre.ethers.getContractAt("IERC20", taskArgs.token0);
    const token1Contract = await hre.ethers.getContractAt("IERC20", taskArgs.token1);

    const nfpManager = await hre.ethers.getContractAt("INonfungiblePositionManager", UNISWAP_NFP_MANAGER);
    let tx = await token0Contract.connect(deployer).approve(UNISWAP_NFP_MANAGER, taskArgs.amount0);
    await tx.wait();
    console.log("Approved token0:", tx.hash);
    tx = await token1Contract.connect(deployer).approve(UNISWAP_NFP_MANAGER, taskArgs.amount1);
    await tx.wait();
    console.log("Approved token1:", tx.hash);

    // Get the correct ticks
    const lowerTick = nearestUsableTick(parseInt(taskArgs.ticklower) + 100, await poolContract.tickSpacing());
    const upperTick = nearestUsableTick(parseInt(taskArgs.tickupper) - 100, await poolContract.tickSpacing());

    const mintParams = {
      token0: taskArgs.token0,
      token1: taskArgs.token1,
      fee: taskArgs.fee,
      tickLower: lowerTick,
      tickUpper: upperTick,
      amount0Desired: taskArgs.amount0,
      amount1Desired: taskArgs.amount1,
      amount0Min: 0,
      amount1Min: 0,
      recipient: deployer.address,
      deadline: 9999999999,
    };

    tx = await nfpManager.connect(deployer).mint(mintParams);
    await tx.wait();
    console.log("Liquidity minted:", tx.hash);
  });
