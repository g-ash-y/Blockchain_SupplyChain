import { useState } from "react";
import { Contract, BrowserProvider } from "ethers";
import { contractAddress } from "./deployed_addresses.json";
import { abi } from "./SupplyChain.json";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    itemId: 0,
    itemName: "",
    mfDate: "",
    expDate: "",
    totalQty: 0,
  });
  const [retailerQty, setRetailerQty] = useState(0);
  const [customerData, setCustomerData] = useState({
    itemId: 0,
    qty: 0,
  });
  const [queryId, setQueryId] = useState("");
  const [output, setOutput] = useState("");
  const [connected, setConnected] = useState(false);
  const [role, setRole] = useState("");

  const provider = new BrowserProvider(window.ethereum);

  // Function to connect MetaMask
  async function connectMetaMask() {
    try {
      const signer = await provider.getSigner();
      alert(`Successfully Connected: ${signer.address}`);
      setConnected(true);
    } catch (err) {
      console.error("Error connecting to MetaMask:", err);
      alert("MetaMask connection failed.");
    }
  }

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Add item (Distributor role)
  const addItem = async () => {
    try {
      const signer = await provider.getSigner();
      const instance = new Contract(contractAddress, abi, signer);

      const mfDate = formatDate(formData.mfDate);
      const expDate = formatDate(formData.expDate);

      const trx = await instance.addItem(
        formData.itemId,
        formData.itemName,
        mfDate,
        expDate,
        formData.totalQty
      );

      alert("Item successfully added.");
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Failed to add item.");
    }
  };

  // Update quantity (Retailer role)
  const updateQuantity = async () => {
    try {
      const signer = await provider.getSigner();
      const instance = new Contract(contractAddress, abi, signer);

      const trx = await instance.updateQuantity(queryId, retailerQty);
      alert("Quantity updated successfully.");
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity.");
    }
  };

  // Claim ownership (Customer role)
  const claimOwnership = async () => {
    try {
      const signer = await provider.getSigner();
      const instance = new Contract(contractAddress, abi, signer);

      const trx = await instance.claimOwnership(
        customerData.itemId,
        customerData.qty
      );
      alert("Ownership claimed successfully.");
    } catch (err) {
      console.error("Error claiming ownership:", err);
      alert("Failed to claim ownership.");
    }
  };

  // View item details
  const viewItem = async () => {
    try {
      const signer = await provider.getSigner();
      const instance = new Contract(contractAddress, abi, signer);

      const result = await instance.viewItemBasicDetails(queryId);
      setOutput(
        `Item ID: ${result[0].toString()}, Name: ${result[1]}, Total Qty: ${result[2].toString()}, Remaining Qty: ${result[3].toString()}`
      );
    } catch (err) {
      console.error("Error fetching item details:", err);
      alert("Failed to fetch item details.");
    }
  };

  // Utility function to format dates
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}${month}${year}`;
  };

  return (
    <div>
      <h1>Supply Chain DApp</h1>
      {!connected && <button onClick={connectMetaMask}>Connect MetaMask</button>}

      {connected && (
        <div>
          <h2>Current Role: {role || "None Selected"}</h2>
          <div>
            <button onClick={() => setRole("Distributor")}>Distributor Panel</button>
            <button onClick={() => setRole("Retailer")}>Retailer Panel</button>
            <button onClick={() => setRole("Customer")}>Customer Panel</button>
          </div>
        </div>
      )}

      {role === "Distributor" && (
        <div>
          <h2>Distributor Panel</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addItem();
            }}
          >
            <label>Item ID:</label>
            <input
              type="number"
              name="itemId"
              value={formData.itemId}
              onChange={handleChange}
              required
            />
            <label>Item Name:</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
            <label>Manufacturing Date:</label>
            <input
              type="date"
              name="mfDate"
              value={formData.mfDate}
              onChange={handleChange}
              required
            />
            <label>Expiry Date:</label>
            <input
              type="date"
              name="expDate"
              value={formData.expDate}
              onChange={handleChange}
              required
            />
            <label>Total Quantity:</label>
            <input
              type="number"
              name="totalQty"
              value={formData.totalQty}
              onChange={handleChange}
              required
            />
            <button type="submit">Add Item</button>
          </form>
          <h3>View Item</h3>
          <label>Item ID:</label>
          <input
            type="number"
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
          />
          <button onClick={viewItem}>View</button>
          <p>{output}</p>
        </div>
      )}

      {role === "Retailer" && (
        <div>
          <h2>Retailer Panel</h2>
          <label>Item ID:</label>
          <input
            type="number"
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
          />
          <label>Quantity:</label>
          <input
            type="number"
            value={retailerQty}
            onChange={(e) => setRetailerQty(Number(e.target.value))}
          />
          <button onClick={updateQuantity}>Update</button>
          <button onClick={viewItem}>View Item</button>
          <p>{output}</p>
        </div>
      )}

      {role === "Customer" && (
        <div>
          <h2>Customer Panel</h2>
          <label>Item ID:</label>
          <input
            type="number"
            value={customerData.itemId}
            onChange={(e) =>
              setCustomerData((prev) => ({ ...prev, itemId: e.target.value }))
            }
          />
          <label>Quantity:</label>
          <input
            type="number"
            value={customerData.qty}
            onChange={(e) =>
              setCustomerData((prev) => ({ ...prev, qty: e.target.value }))
            }
          />
          <button onClick={claimOwnership}>Claim Ownership</button>
          <label>View Item ID:</label>
          <input
            type="number"
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
          />
          <button onClick={viewItem}>View Item</button>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}

export default App;
