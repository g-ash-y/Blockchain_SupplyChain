import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contractABI from './contractABI.json';

const App = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [productId, setProductId] = useState('');
  const [productData, setProductData] = useState(null);

  // Connect to Metamask and set up provider and contract
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();

      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      setProvider(provider);
      setContract(contract);
      setAccount(account);
    } else {
      alert('Please install MetaMask to use this DApp!');
    }
  };

  // Fetch product data from the contract
  const fetchProductData = async () => {
    if (!contract) return;
    try {
      const data = await contract.getProduct(productId);
      setProductData(data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  // Sample function to add a new product (requires appropriate contract function)
  const addProduct = async () => {
    if (!contract) return;
    try {
      const tx = await contract.addProduct(productId, "Healthcare Product");
      await tx.wait();
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Blockchain Healthcare Product Tracker</h1>
        <button onClick={connectWallet}>
          {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
        </button>
      </header>

      <main>
        <div className="product-info">
          <h2>Get Product Information</h2>
          <input
            type="text"
            placeholder="Enter Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <button onClick={fetchProductData}>Fetch Product</button>
          {productData && (
            <div>
              <p>Product ID: {productId}</p>
              <p>Product Name: {productData.name}</p>
              <p>Product Owner: {productData.owner}</p>
            </div>
          )}
        </div>

        <div className="add-product">
          <h2>Add New Product</h2>
          <input
            type="text"
            placeholder="Enter New Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <button onClick={addProduct}>Add Product</button>
        </div>
      </main>
    </div>
  );
};

export default App;
