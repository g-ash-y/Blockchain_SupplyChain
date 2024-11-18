import { useState } from 'react'
import { Contract, BrowserProvider } from "ethers";
import { contractAddress } from "./deployed_addresses.json";
import { abi } from "./SupplyChain.json";
import "./App.css"

function App() {
  const [formData, setFormData] = useState({
    itemId: 0,
    itemName: '',
    mfDate: '', // Manufacturing Date as YYYY-MM-DD
    expDate: '', // Expiry Date as YYYY-MM-DD
    totalQty: 0,
  });

  const [queryId, setQueryId] = useState('');
  const [output, setOutput] = useState('');
  const [connected, setConnected] = useState(false);

  const provider = new BrowserProvider(window.ethereum);

  // Function to connect MetaMask
  async function connectMetaMask() {
    try {
      const signer = await provider.getSigner();
      alert(`Successfully Connected: ${signer.address}`);
      setConnected(true);
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
      alert('MetaMask connection failed.');
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

      const mfDate = formatDate(formData.mfDate); // Convert YYYY-MM-DD to DDMMYYYY
      const expDate = formatDate(formData.expDate);

      const trx = await instance.addItem(
        formData.itemId,
        formData.itemName,
        mfDate,
        expDate,
        formData.totalQty
      );

      console.log('Transaction Hash:', trx.hash);
      alert('Item successfully added.');
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Failed to add item.');
    }
  };

  // View item details
  const viewItem = async () => {
    try {
      const signer = await provider.getSigner();
      const instance = new Contract(contractAddress, abi, signer);

      const result = await instance.viewItemBasicDetails(queryId);
      setOutput(
        `Item ID: ${result[0]}, Name: ${result[1]}, Total Qty: ${result[2]}, Remaining Qty: ${result[3]}`
      );
    } catch (err) {
      console.error('Error fetching item details:', err);
      alert('Failed to fetch item details.');
    }
  };

  // Utility function to format dates
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}${month}${year}`;
  };

  return (
    <div>
      <h1>Supply Chain DApp</h1>
      {!connected && (
        <button onClick={connectMetaMask}>Connect MetaMask</button>
      )}

      <h2>Add Item</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addItem();
        }}
      >
        <div>
          <label htmlFor="itemId">Item ID:</label>
          <input
            type="number"
            id="itemId"
            name="itemId"
            value={formData.itemId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="mfDate">Manufacturing Date:</label>
          <input
            type="date"
            id="mfDate"
            name="mfDate"
            value={formData.mfDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="expDate">Expiry Date:</label>
          <input
            type="date"
            id="expDate"
            name="expDate"
            value={formData.expDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="totalQty">Total Quantity:</label>
          <input
            type="number"
            id="totalQty"
            name="totalQty"
            value={formData.totalQty}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Item</button>
      </form>

      <h2>View Item</h2>
      <div>
        <label htmlFor="queryId">Item ID:</label>
        <input
          type="number"
          id="queryId"
          name="queryId"
          value={queryId}
          onChange={(e) => setQueryId(e.target.value)}
        />
        <button onClick={viewItem}>View</button>
      </div>
      <p>{output}</p>
    </div>
  );

}

export default App
