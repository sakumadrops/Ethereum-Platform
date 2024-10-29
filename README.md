# Ethereum Platform App

## Description

The **Ethereum Platform App** is a web3 platform that provides Ethereum holders with real-time tracking into their wallets while also being able to check Ethereum's price and gas fees. This app solves the hassle of manually checking balances, transactions, gas fees, and ETH price by consolidating everything in one platform.

## Features:
- Check Ethereum wallet balance
- View their 10 most recent transactions
- Track ETH gas fees in real-time
- Check current ETH price in USD

## Requirements
- **Node.js** and **npm** installed: [Download Node.js](https://nodejs.org/).
- **Etherscan API key**: [Sign up at Etherscan](https://etherscan.io/).

## Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sakumadrops/Ethereum-Platform.git
   cd Ethereum-Platform
2. **Install Dependencies**
   ```bash
   npm install
3. Create .env file
   ```bash
   REACT_APP_ETHERSCAN_API_KEY=apikey
4. Run the project
   ```bash
   npm start

## APIs Used

1. **Etherscan API**:
   - **Account Balance**: get wallet balances
   - **Transaction Logs**: get the latest 10 transactions
   - **Gas Fees**: get real-time ETH gas fees

2. **CoinGecko API**:
   - **ETH Price**: get real-time ETH price in USD

## Credits

This project was created with the help of the ChatGPT 4o model:
- API integration using React
- React hooks implementation
- CSS design
