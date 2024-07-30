import { ethers } from "hardhat";

async function main() {
  const DCA = await ethers.getContractFactory("SuperDCAToken");
  const dca = await DCA.deploy();
  console.log("Super DCA Token deployed to:", dca.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
