import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [account, setAccount] = useState("0x123...mock");
  const [productId, setProductId] = useState('');
  const [productData, setProductData] = useState(null);
  const [productName, setProductName] = useState('');
  const [productOrigin, setProductOrigin] = useState('');

  const connectWallet = async () => {
    // Mock wallet connection
    alert("Wallet connected (mock)");
  };

  const fetchProductData = async () => {
    // Mock fetching product data
    if (!productId) return;
    const mockProductData = {
      id: productId,
      name: "Mock Product",
      origin: "Mock Origin",
      currentLocation: "Mock Location",
      owner: "0xMockOwnerAddress",
    };
    setProductData(mockProductData);
  };

  const addProduct = async () => {
    // Mock adding a product
    if (!productName || !productOrigin) return;
    alert(`Product "${productName}" from "${productOrigin}" added (mock).`);
    setProductName('');
    setProductOrigin('');
  };

  useEffect(() => {
    // Mock wallet auto-connection
    setAccount("0x123...mock");
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Blockchain Product Tracker (Mock)</h1>
        <button onClick={connectWallet}>
          {account ? `Connected: ${account}` : "Connect Wallet"}
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
              <p>Product ID: {productData.id}</p>
              <p>Product Name: {productData.name}</p>
              <p>Origin: {productData.origin}</p>
              <p>Current Location: {productData.currentLocation}</p>
              <p>Owner: {productData.owner}</p>
            </div>
          )}
        </div>

        <div className="add-product">
          <h2>Add New Product</h2>
          <input
            type="text"
            placeholder="Enter Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Product Origin"
            value={productOrigin}
            onChange={(e) => setProductOrigin(e.target.value)}
          />
          <button onClick={addProduct}>Add Product</button>
        </div>
      </main>
    </div>
  );
};

export default App;
