import { useState } from 'react'
import { Contract, BrowserProvider } from "ethers";
import { contractAddress } from "./deployed_addresses.json";
import { abi } from "./SupplyChain.json";
import "./App.css"

function App() {
    const [distributorData, setDistributorData] = useState({
      itemId: 0,
      itemName: "",
      mfDate: "",
      expDate: "",
      totalQty: 0,
    });
  
    const [retailerData, setRetailerData] = useState({
      itemId: 0,
      qty: 0,
    });
  
    const [customerData, setCustomerData] = useState({
      itemId: 0,
      qty: 0,
    });
  
    const [viewItemId, setViewItemId] = useState(0);
    const [itemDetails, setItemDetails] = useState("");
    const [role, setRole] = useState(""); // Tracks current role (distributor, retailer, customer)
  
    const provider = new BrowserProvider(window.ethereum);
  
    const handleChange = (setter) => (event) => {
      const { name, value } = event.target;
      setter((prevState) => ({ ...prevState, [name]: value }));
    };
  
    const submitTransaction = async (action) => {
      try {
        const signer = await provider.getSigner();
        const instance = new Contract(contractAddress, abi, signer);
  
        if (role === "distributor" && action === "addItem") {
          const { itemId, itemName, mfDate, expDate, totalQty } = distributorData;
          const trx = await instance.addItem(
            itemId,
            itemName,
            parseInt(mfDate.replace(/-/g, "")),
            parseInt(expDate.replace(/-/g, "")),
            totalQty
          );
          alert(`Item Added Successfully! Transaction Hash: ${trx.hash}`);
        }
  
        if (role === "retailer" && action === "accessItem") {
          const { itemId, qty } = retailerData;
          const trx = await instance.accessItem(itemId, qty);
          alert(`Item Accessed Successfully! Transaction Hash: ${trx.hash}`);
        }
  
        if (role === "customer" && action === "claimOwnership") {
          const { itemId, qty } = customerData;
          const trx = await instance.claimOwnership(itemId, qty);
          alert(`Ownership Claimed Successfully! Transaction Hash: ${trx.hash}`);
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Transaction Failed. Check the console for more details.");
      }
    };
  
    const viewItem = async () => {
      try {
        const signer = await provider.getSigner();
        const instance = new Contract(contractAddress, abi, signer);
        const [basicDetails, dateDetails] = await Promise.all([
          instance.viewItemBasicDetails(viewItemId),
          instance.viewItemDates(viewItemId),
        ]);
  
        setItemDetails(`
          Item ID: ${basicDetails[0]}
          Name: ${basicDetails[1]}
          Total Quantity: ${basicDetails[2]}
          Remaining Quantity: ${basicDetails[3]}
          Manufacturing Date: ${dateDetails[0]}/${dateDetails[1]}/${dateDetails[2]}
          Expiry Date: ${dateDetails[3]}/${dateDetails[4]}/${dateDetails[5]}
          Current Owner: ${dateDetails[6]}
        `);
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to fetch item details. Check the console for more details.");
      }
    };
  
    return (
      <div className="app">
        <header>
          <h1>Supply Chain Management</h1>
          <p>Track and manage items across distributor, retailer, and customer.</p>
        </header>
  
        <div className="role-selection">
          <label>Select Your Role:</label>
          <select onChange={(e) => setRole(e.target.value)} value={role}>
            <option value="">Select Role</option>
            <option value="distributor">Distributor</option>
            <option value="retailer">Retailer</option>
            <option value="customer">Customer</option>
          </select>
        </div>
  
        {role === "distributor" && (
          <div className="form">
            <h2>Distributor Actions</h2>
            <input
              type="number"
              name="itemId"
              placeholder="Item ID"
              value={distributorData.itemId}
              onChange={handleChange(setDistributorData)}
            />
            <input
              type="text"
              name="itemName"
              placeholder="Item Name"
              value={distributorData.itemName}
              onChange={handleChange(setDistributorData)}
            />
            <input
              type="date"
              name="mfDate"
              placeholder="Manufacturing Date"
              value={distributorData.mfDate}
              onChange={handleChange(setDistributorData)}
            />
            <input
              type="date"
              name="expDate"
              placeholder="Expiry Date"
              value={distributorData.expDate}
              onChange={handleChange(setDistributorData)}
            />
            <input
              type="number"
              name="totalQty"
              placeholder="Total Quantity"
              value={distributorData.totalQty}
              onChange={handleChange(setDistributorData)}
            />
            <button onClick={() => submitTransaction("addItem")}>Add Item</button>
          </div>
        )}
  
        {role === "retailer" && (
          <div className="form">
            <h2>Retailer Actions</h2>
            <input
              type="number"
              name="itemId"
              placeholder="Item ID"
              value={retailerData.itemId}
              onChange={handleChange(setRetailerData)}
            />
            <input
              type="number"
              name="qty"
              placeholder="Quantity"
              value={retailerData.qty}
              onChange={handleChange(setRetailerData)}
            />
            <button onClick={() => submitTransaction("accessItem")}>
              Access Item
            </button>
          </div>
        )}
  
        {role === "customer" && (
          <div className="form">
            <h2>Customer Actions</h2>
            <input
              type="number"
              name="itemId"
              placeholder="Item ID"
              value={customerData.itemId}
              onChange={handleChange(setCustomerData)}
            />
            <input
              type="number"
              name="qty"
              placeholder="Quantity"
              value={customerData.qty}
              onChange={handleChange(setCustomerData)}
            />
            <button onClick={() => submitTransaction("claimOwnership")}>
              Claim Ownership
            </button>
          </div>
        )}
  
        <div className="view-section">
          <h2>View Item Details</h2>
          <input
            type="number"
            placeholder="Enter Item ID"
            value={viewItemId}
            onChange={(e) => setViewItemId(e.target.value)}
          />
          <button onClick={viewItem}>View Details</button>
          {itemDetails && <pre>{itemDetails}</pre>}
        </div>
      </div>
    );

}

export default App
