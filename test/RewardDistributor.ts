import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
import { RewardDistributor, MockERC20, MockUniswapV3Staker, INonfungiblePositionManager } from "../typechain";

describe("RewardDistributor", function () {
  let rewardDistributor: RewardDistributor;
  let rewardToken: MockERC20;
  let uniswapV3Staker: MockUniswapV3Staker;
  let nonfungiblePositionManager: INonfungiblePositionManager;
  let owner: Signer;
  let addr1: Signer;
  let addrs: Signer[];
  let poolAddresses: string[];

  async function impersonateAccount(account: string) {
    await ethers.provider.send("hardhat_impersonateAccount", [account]);
    await ethers.provider.send("hardhat_setBalance", [account, "0x100000000000000000000"]);
    return ethers.provider.getSigner(account);
  }

  async function deployRewardDistributor() {
    const RewardToken = await ethers.getContractFactory("MockERC20");
    rewardToken = await RewardToken.deploy("DCA Token", "DCA", 18);
    await rewardToken.deployed();

    const UniswapV3Staker = await ethers.getContractFactory("MockUniswapV3Staker");
    uniswapV3Staker = await UniswapV3Staker.deploy();
    await uniswapV3Staker.deployed();

    poolAddresses = [
      ethers.Wallet.createRandom().address,
      ethers.Wallet.createRandom().address,
      ethers.Wallet.createRandom().address
    ];

    const RewardDistributor = await ethers.getContractFactory("RewardDistributor");
    rewardDistributor = await RewardDistributor.deploy(
      uniswapV3Staker.address,
      rewardToken.address,
      poolAddresses
    );
    await rewardDistributor.deployed();

    await rewardToken.mint(rewardDistributor.address, ethers.utils.parseUnits("5000", 18));
  }

  beforeEach(async function () {
    [owner, addr1, ...addrs] = await ethers.getSigners();
    await deployRewardDistributor();
  });

  it("Should create incentives once a month", async function () {
    await expect(rewardDistributor.createMonthlyIncentives())
      .to.emit(uniswapV3Staker, "IncentiveCreated")
      .withArgs(rewardToken.address, poolAddresses[0], /*other args*/);

    expect(await rewardToken.balanceOf(rewardDistributor.address)).to.equal(0);
    expect(await rewardToken.balanceOf(uniswapV3Staker.address)).to.equal(ethers.utils.parseUnits("5000", 18));

    await expect(rewardDistributor.createMonthlyIncentives()).to.be.revertedWith("Incentives can only be created once per month");

    // Fast forward one month
    await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    await rewardToken.mint(rewardDistributor.address, ethers.utils.parseUnits("5000", 18));
    await expect(rewardDistributor.createMonthlyIncentives())
      .to.emit(uniswapV3Staker, "IncentiveCreated")
      .withArgs(rewardToken.address, poolAddresses[1], /*other args*/);
  });
});
