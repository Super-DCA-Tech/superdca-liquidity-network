import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import * as tdly from "@tenderly/hardhat-tenderly";

require("@nomiclabs/hardhat-etherscan");

require("hardhat-deploy");

require("./tasks/uniswap");
require("./tasks/mint");

tdly.setup();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.POLYGON_NODE_URL || "",
        accounts: [],
        enabled: true, 
        chainId: 137,
        blockNumber: 43558066,
      },
    },
    // polygon: {
    //   chainId: 137,
    //   url: process.env.POLYGON_NODE_URL || "",
    //   accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    // },
    optimism: {
      chainId: 10,
      url: process.env.OPTIMISM_NODE_URL || "https://mainnet.optimism.io",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    base: {
      chainId: 8453,
      url: process.env.BASE_NODE_URL || "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    base_Sepolia: {
      chainId: 84532,
      url: process.env.BASE_NODE_URL || "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrum: {
      chainId: 42161,
      url: process.env.ARBITRUM_NODE_URL || "https://arb1.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    // sepolia: {
    //   chainId: 11155111,
    //   url: process.env.SEPOLIA_NODE_URL,
    //   accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    // },
    // tenderly: {
    //   chainId: Number(process.env.TENDERLY_NETWORK_ID),
    //   accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    //   url: process.env.TENDERLY_NODE_URL,
    // },
  },
  tenderly: {
    username: String(process.env.TENDERLY_USERNAME), 
    project: "dca-protocol",
    forkNetwork: process.env.TENDERLY_NETWORK_ID, 
    privateVerification: false,
  },
  gasReporter: {
    enabled: true
  },
  etherscan: {
      apiKey: {
        // ... (keep existing apiKeys if any)
        base_Sepolia: process.env.ETHERSCAN_API_KEY || '' // Add this line
      },
      customChains: [
        {
          network: "base_Sepolia",
          chainId: 84532,
          urls: {
            apiURL: "https://api-sepolia.basescan.org/api",
            browserURL: "https://sepolia.basescan.org"
          }
        }
      ]
    }
};

export default config;
