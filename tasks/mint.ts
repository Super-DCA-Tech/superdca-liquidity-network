import { task } from "hardhat/config";
import { ethers } from "ethers";

const SUPER_DCA_TOKEN_ADDRESS = "0xb1599CDE32181f48f89683d3C5Db5C5D2C7C93cc";

const SuperDCAABI = [
    "function mint(uint256 amount) public",
];

task("mint", "Mint new tokens")
  .addParam("amount", "The amount tokens to mint")
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    const superDCA = new ethers.Contract(SUPER_DCA_TOKEN_ADDRESS, SuperDCAABI, deployer);
    let tx = await superDCA.mint(taskArgs.amount, {gasLimit: 10000000});
    await tx.wait();
    console.log("Minted:", tx.hash)
  });

