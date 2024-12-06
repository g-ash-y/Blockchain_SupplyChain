# BLOCKCHAIN-BASED OBJECT TRACKING FOR SECURE AND TRANSPARENT SUPPLY CHAINS

This project is a decentralized application (DApp) designed for secure and transparent tracking of healthcare products across the supply chain. By leveraging blockchain technology, this system ensures the authenticity, traceability, and safety of products, especially critical in healthcare.

## Features:

Product Registration: Register products on the blockchain with unique IDs and essential details.
Supply Chain Tracking: Track each product’s journey from supplier to consumer with immutable records.
Ownership Transfer: Facilitate secure ownership transfers across supply chain participants.
Real-Time Monitoring: IoT sensor data for real-time monitoring of environmental conditions (e.g., temperature).
Verification via QR Code: Consumers can verify product authenticity by scanning a QR code.
Automated Alerts: Smart contracts trigger alerts for anomalies, such as environmental deviations.

## Technology Stack:

Frontend: React, JavaScript, HTML, CSS
Blockchain: Ethereum, Solidity for smart contracts
Storage: IPFS/Swarm for off-chain data
Wallet Integration: MetaMask for transaction signing
Backend: Alchemy or Infura as Ethereum provider

## System Architecture:

Actors: Suppliers, distributors, retailers, and consumers interact through a DApp.
DApp Frontend: User interface for participants to register, transfer, and verify products.
Blockchain: Immutable ledger to record product data and events.
Decentralized Storage: Off-chain storage for large data like product metadata and sensor readings.


# Getting Started
## Prerequisites
- Node.js
- VS Code
- GitHub Desktop
- npm
- MetaMask (for DApp interaction)

## Setup Instructions
Clone the Repository:
```
git clone https://github.com/YourUsername/Blockchain_SupplyChain.git
cd Blockchain_SupplyChain
```
Install Hardhat:
```
npm install --save-dev hardhat
```
Run Hardhat:
```
npx hardhat
```
Install Frontend Dependencies: Navigate to the frontend directory and install dependencies:
```
cd frontend
npm install
```
Deploy the Smart Contract: From the root directory, deploy the smart contract:
```
npx hardhat run scripts/deploy.js --network localhost
```
Start the Frontend: In the frontend directory, start the development server:
```
npm run dev
```
Access the Application: Open http://localhost:5173 to interact with the decentralized application (DApp).
