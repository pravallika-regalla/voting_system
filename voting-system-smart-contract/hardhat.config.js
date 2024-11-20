require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 31334, // Set a unique chain ID
    },
  },
  solidity: {
    version: "0.8.27", // Match the pragma in your contracts
  },
};
