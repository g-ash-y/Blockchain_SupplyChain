import { useState } from 'react'
import { Contract, BrowserProvider } from "ethers";
import { contractAddress } from "./deployed_addresses.json";
import { abi } from "./SupplyChain.json";
import "./App.css"

function App() {
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    itemId: 0,
    itemName: '',
    mfDate: '',
    expDate: '',
    totalQty: 0,
    qty: 0,
  });
  const [queryId, setQueryId] = useState(0);
  const [itemDetails, setItemDetails] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectMetaMask = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);

      const instance = new ethers.Contract(contractAddress, abi, signer);
      setContract(instance);

      alert(`Connected to MetaMask as ${signer.address}`);
      setConnectionStatus(true);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  const handleRoleChange = (newRole) => setRole(newRole);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = async () => {
    try {
      const { itemId, itemName, mfDate, expDate, totalQty } = formData;
      const mfDateNum = parseInt(mfDate.replace(/-/g, ''));
      const expDateNum = parseInt(expDate.replace(/-/g, ''));
      const tx = await contract.addItem(itemId, itemName, mfDateNum, expDateNum, totalQty);
      await tx.wait();
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const accessItem = async () => {
    try {
      const { itemId, qty } = formData;
      const tx = await contract.accessItem(itemId, qty);
      await tx.wait();
      alert('Item accessed successfully!');
    } catch (error) {
      console.error('Error accessing item:', error);
    }
  };

  const claimItem = async () => {
    try {
      const { itemId, qty } = formData;
      const tx = await contract.claimOwnership(itemId, qty);
      await tx.wait();
      alert('Item claimed successfully!');
    } catch (error) {
      console.error('Error claiming item:', error);
    }
  };

  const viewItemDetails = async () => {
    try {
      const basicDetails = await contract.viewItemBasicDetails(queryId);
      const dateDetails = await contract.viewItemDates(queryId);
      setItemDetails(
        `Item ID: ${basicDetails[0]}, Name: ${basicDetails[1]}, Total Qty: ${basicDetails[2]}, Remaining Qty: ${basicDetails[3]}\n
        MfD: ${dateDetails[0]}-${dateDetails[1]}-${dateDetails[2]}, ExpD: ${dateDetails[3]}-${dateDetails[4]}-${dateDetails[5]}\n
        Current Owner: ${dateDetails[6]}`
      );
    } catch (error) {
      console.error('Error viewing item details:', error);
    }
  };

  return (
    <div>
      <button onClick={connectMetaMask}>
        {connectionStatus ? 'Connected' : 'Connect MetaMask'}
      </button>
      <br></br>
      <br></br>
      <hr></hr>
      <br></br>
      <h2>Select Role</h2>
      <button onClick={() => handleRoleChange('distributor')}>Distributor</button>
      <button onClick={() => handleRoleChange('retailer')}>Retailer</button>
      <button onClick={() => handleRoleChange('customer')}>Customer</button>
      <h3>Current Role: {role}</h3>

      {role === 'distributor' && (
        <>
          <h2>Add Item</h2>
          <input type="number" name="itemId" placeholder="Item ID" onChange={handleChange} />
          <input type="text" name="itemName" placeholder="Item Name" onChange={handleChange} />
          <input type="date" name="mfDate" onChange={handleChange} />
          <input type="date" name="expDate" onChange={handleChange} />
          <input type="number" name="totalQty" placeholder="Total Quantity" onChange={handleChange} />
          <button onClick={addItem}>Add Item</button>
        </>
      )}

      {role === 'retailer' && (
        <>
          <h2>Access Item</h2>
          <input type="number" name="itemId" placeholder="Item ID" onChange={handleChange} />
          <input type="number" name="qty" placeholder="Quantity" onChange={handleChange} />
          <button onClick={accessItem}>Access Item</button>
        </>
      )}

      {role === 'customer' && (
        <>
          <h2>Claim Item</h2>
          <input type="number" name="itemId" placeholder="Item ID" onChange={handleChange} />
          <input type="number" name="qty" placeholder="Quantity" onChange={handleChange} />
          <button onClick={claimItem}>Claim Item</button>
        </>
      )}

      <h2>View Item Details</h2>
      <input type="number" placeholder="Item ID" onChange={(e) => setQueryId(e.target.value)} />
      <button onClick={viewItemDetails}>View</button>
      <pre>{itemDetails}</pre>
    </div>
  );

}

export default App
