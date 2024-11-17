// Import the ethers library
const { ethers } = require("hardhat");

async function main() {
    // Retrieve the deployer's signer
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Display the deployer's balance
    const balance = await deployer.getBalance();
    console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

    // Get the contract factory and deploy the SupplyChain contract
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = await SupplyChain.deploy();

    // Wait for the deployment to be mined
    await supplyChain.deployed();

    console.log("SupplyChain contract deployed to address:", supplyChain.address);
}

// Execute the main function
main()
    .then(() => process.exit(0)) // Exit successfully
    .catch((error) => {
        console.error("Error during contract deployment:", error);
        process.exit(1); // Exit with an error code
    });
