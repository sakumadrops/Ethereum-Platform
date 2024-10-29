import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ethPrice, setEthPrice] = useState(null);
  const [gasFees, setGasFees] = useState({ safe: null, average: null, fast: null });
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);

  const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
  const ETHERSCAN_API_KEY = '172BVE8E9IQ66EJRRCF4NYJT3CKQ5FS8EF';

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

    fetchEthPrice();
    fetchGasFees();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const BALANCE_URL = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;

      const response = await fetch(BALANCE_URL);
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      const balanceInEther = parseFloat(data.result) / 1e18;
      setBalance(balanceInEther);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const TX_LIST_URL = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

      const response = await fetch(TX_LIST_URL);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();

      if (data.status === '0') throw new Error(data.message);

      const recentTransactions = data.result.slice(0, 10); // Get the 10 most recent transactions
      setTransactions(recentTransactions);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFetchData = () => {
    fetchWalletBalance();
    fetchRecentTransactions();
  };

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
