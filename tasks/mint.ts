import { task } from "hardhat/config";
import { ethers } from "ethers";

const SUPER_DCA_TOKEN_ADDRESS = "0x1470BCf159639AA63914353F93c09E5BeF1113f0";

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

