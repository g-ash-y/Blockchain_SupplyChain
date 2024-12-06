require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Add this to load environment variables from .env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "holesky", // Set Holesky as the default network
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    holesky: {
      url: "https://rpc.testnet.holesky.org", // Holesky testnet RPC URL
      accounts: ["0x12e3f734e3d21aa5fa56fe1ee9dafefa97a8419df88d5f149e07cec3deda3362"], // Add your private key here (use .env for security)
      chainId: 164, // Holesky chain ID
    },
  },
  solidity: "0.8.0",
};
