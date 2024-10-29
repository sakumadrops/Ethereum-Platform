import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Define variables to manage different data points
  const [ethPrice, setEthPrice] = useState(null); // Store ETH price in USD
  const [gasFees, setGasFees] = useState({ safe: null, average: null, fast: null }); // Store gas fees at different speeds
  const [transactions, setTransactions] = useState([]); // Store recent transactions
  const [balance, setBalance] = useState(null); // Store wallet balance in ETH
  const [address, setAddress] = useState(''); // Store the Ethereum wallet address entered by the user
  const [error, setError] = useState(null); // Store error messages
  
  // URLs for the external APIs
  const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
  const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;

  // Using CoinGecko's API to fetch the current ETH price
  const fetchEthPrice = async () => {
    try {
      const response = await fetch(COINGECKO_API_URL);
      if (!response.ok) throw new Error('Failed to fetch Ethereum price');
      const data = await response.json();
      setEthPrice(data.ethereum.usd);
    } catch (err) {
      setError(err.message);
    }
  };

  // Using Etherscan API to fetch gas fees and ETH price when the component loads
  useEffect(() => {
    const GAS_FEES_URL = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`;
  
    const fetchGasFees = async () => {
      try {
        const response = await fetch(GAS_FEES_URL);
        if (!response.ok) throw new Error('Failed to fetch gas fees');
        const data = await response.json();
        setGasFees({
          safe: data.result.SafeGasPrice,
          average: data.result.ProposeGasPrice,
          fast: data.result.FastGasPrice,
        });
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchGasFees();
    fetchEthPrice();
  }, [ETHERSCAN_API_KEY]);
  

  // Using the Etherscan API to fetch the ETH balance of a crypto wallet
  const fetchWalletBalance = async () => {
    try {
      const BALANCE_URL = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;

      const response = await fetch(BALANCE_URL);
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      const balanceInEther = parseFloat(data.result) / 1e18; // Convert balance from Wei to Ether
      setBalance(balanceInEther);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetches the 10 most recent transactions for the entered wallet address
  const fetchRecentTransactions = async () => {
    try {
      const TX_LIST_URL = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

      const response = await fetch(TX_LIST_URL); // Make API request
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json(); // Parse JSON response

      if (data.status === '0') throw new Error(data.message);

      const recentTransactions = data.result.slice(0, 10); // Limit to 10 most recent transactions
      setTransactions(recentTransactions); // Update transactions
    } catch (err) {
      setError(err.message);
    }
  };

  // Activate both the balance and transaction fetch functions when the user clicks the 'Get Wallet Data' button
  const handleFetchData = () => {
    fetchWalletBalance();
    fetchRecentTransactions();
  };

  // Generate the app's user interface
  return (
    <div className="App">
      <h1>Ethereum Hub</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p>Current ETH Price: ${ethPrice}</p>
      <h2>Gas Fees</h2>
      <p>🚶 Safe: {gasFees.safe} Gwei</p>
      <p>⚡ Average: {gasFees.average} Gwei</p>
      <p>🚀 Fast: {gasFees.fast} Gwei</p>

      <div className="wallet-input">
        <h2>Track Wallet Info</h2>
        <input
          type="text"
          placeholder="Enter Ethereum Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={handleFetchData} disabled={!address}>
          Get Wallet Data
        </button>
      </div>

      {balance !== null && (
        <div className="wallet-balance">
          <p><strong>Wallet Balance:</strong> {balance.toFixed(5)} ETH</p>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="transaction-logs">
          <h3>Recent Transactions (Top 10)</h3>
          <ul>
            {transactions.map((tx, index) => (
              <li key={index}>
                <p><strong>Block:</strong> {tx.blockNumber}</p>
                <p><strong>From:</strong> {tx.from}</p>
                <p><strong>To:</strong> {tx.to}</p>
                <p><strong>Value:</strong> {tx.value / 1e18} ETH</p>
                <p><strong>Hash:</strong> {tx.hash}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
