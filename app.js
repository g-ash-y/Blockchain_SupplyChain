import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store'; // Assuming Redux is set up in your project
import SupplyChainContract from './contracts/SupplyChain.json'; // Adjust this path as needed

import SupplierDashboard from './components/SupplierDashboard';
import MedicalShopDashboard from './components/MedicalShopDashboard';
import QRScanner from './components/QRScanner'; // Example for consumer product verification

function App() {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [userRole, setUserRole] = useState(''); // 'supplier', 'retailer', etc.

    useEffect(() => {
        loadWeb3();
        loadBlockchainData();
    }, []);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log('MetaMask connected');
            } catch (error) {
                console.error('User denied MetaMask connection');
            }
        } else {
            console.log('Please install MetaMask');
        }
    };

    const loadBlockchainData = async () => {
        if (web3) {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            // Load the smart contract
            const networkId = await web3.eth.net.getId();
            const networkData = SupplyChainContract.networks[networkId];
            if (networkData) {
                const supplyChainContract = new web3.eth.Contract(
                    SupplyChainContract.abi,
                    networkData.address
                );
                setContract(supplyChainContract);
                console.log("Smart contract loaded");

                // Fetch user role from the blockchain (example method, adjust as per contract)
                const role = await supplyChainContract.methods.getUserRole(accounts[0]).call();
                setUserRole(role); // Assume contract has a method to get user role
            } else {
                console.log('Smart contract not deployed to detected network');
            }
        }
    };

    const connectWallet = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            loadBlockchainData();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    return (
        <Provider store={store}>
            <Router>
                <div className="App">
                    <header>
                        <h1>Blockchain Supply Chain DApp</h1>
                        <button onClick={connectWallet}>
                            {account ? `Connected: ${account}` : 'Connect Wallet'}
                        </button>
                    </header>
                    <Switch>
                        <Route path="/supplier">
                            <SupplierDashboard contract={contract} account={account} />
                        </Route>
                        <Route path="/medical-shop">
                            <MedicalShopDashboard contract={contract} account={account} />
                        </Route>
                        <Route path="/verify">
                            <QRScanner contract={contract} />
                        </Route>
                        {/* Add more routes as per user roles */}
                        <Route path="/">
                            <div>
                                <h2>Welcome to the Supply Chain DApp</h2>
                                <p>Select your role to get started.</p>
                            </div>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
