import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// Tests against a fork of Polygon network
const dcaHolderAddress = "0x3226c9eac0379f04ba2b1e1e1fcd52ac26309aea";
const dcaTokenAddress = "0x263026E7e53DBFDce5ae55Ade22493f828922965";

describe("DCALiquidityNetwork", function () {
  let dcaToken, dcaToken, dcaHolder;

  async function impersonateAccount(account: string) {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [account],
    });

    // Set a balance for the account
    await hre.network.provider.send("hardhat_setBalance", [
      account,
      "0x100000000000000000000"
    ]);

    return ethers.provider.getSigner(account);
  }

  // Deploy the contracts using the fixture
  async function deployDCALiquidityNetwork() {
    
    // Deploy DCAProtocolToken
    const DCAProtocolToken = await ethers.getContractFactory("DCAProtocolToken");
    dcaToken = await DCAProtocolToken.deploy();

    // Impersonate dcaHolder
    dcaHolder = await impersonateAccount(dcaHolderAddress);

    // Get the dca token instance
    dcaToken = await ethers.getContractAt("ERC20", dcaTokenAddress);
    
    return { dcaToken, dcaToken, dcaHolder };
  }

  it("Should burn dca and mint DCA", async function () {
    // Deploy the contracts
    const { dcaToken, dcaToken, dcaHolder } = await loadFixture(deployDCALiquidityNetwork);

    // Get the initial dca balance of the dcaHolder
    const dcaBalance = await dcaToken.balanceOf(dcaHolderAddress);

    // Get the initial total supply of dca
    const dcaTotalSupply = await dcaToken.totalSupply();

    // Burn dca and mint DCA
    await dcaToken.connect(dcaHolder).approve(dcaToken.address, dcaBalance);
    await dcaToken.connect(dcaHolder).supportDCA(dcaBalance);

    // Check the DCA balance of the dcaHolder
    const dcaBalance = await dcaToken.balanceOf(dcaHolderAddress);
    expect(dcaBalance).to.equal(dcaBalance);

    // Check the dca balance of the dcaHolder
    const dcaBalanceAfter = await dcaToken.balanceOf(dcaHolderAddress);
    expect(dcaBalanceAfter).to.equal(0);

    // Check the total supply of DCA
    const totalSupply = await dcaToken.totalSupply();
    expect(totalSupply).to.equal(dcaBalance);

  });

    
});
