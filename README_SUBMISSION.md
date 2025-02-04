# Energy Trading Platform

## Overview
The Energy Trading Platform is a decentralized application (DApp) built on Ethereum to facilitate energy and carbon credit trading. It enables energy producers to list their excess energy for sale while allowing consumers to purchase energy and carbon credits in a transparent and decentralized manner. Transactions are executed securely through smart contracts.

## Features
- **Secure Authentication:** Users can connect their MetaMask wallet to interact with the platform.
- **Energy Trading:** Producers can list their available energy, set prices, and manage offers. Consumers can browse offers and make purchases.
- **Carbon Credit Trading:** Users can trade carbon credits similarly to energy units, helping promote sustainability.
- **Real-time Balances:** Each user's energy and carbon credit balances are displayed and updated dynamically.
- **Blockchain Security:** Transactions are verified and stored on-chain for transparency and immutability.
- **User-Friendly Interface:** A clean and intuitive UI optimized for both desktop and mobile.
- **Fast and Low-Cost Transactions:** Designed to minimize gas fees while maintaining efficiency.

## Tech Stack
- **Frontend:** React.js 
- **Blockchain:** Ethereum Smart Contracts (Solidity), Remix IDE
- **Backend Services:** React.js
- **Libraries:** Web3.js, ethers.js

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or later)
- npm or yarn
- MetaMask browser extension


### Steps to Set Up
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

## Smart Contract Deployment
### Compile and Deploy on Sepolia Testnet
1. Open Remix IDE
2. Paste the given code and compile
3. Deploy the contract on Sepolia Testnet:
4. Verify deployment on etherscan

## Usage Guide
### Connecting to the Platform
1. Open the web app in your browser.
2. Click on **Connect Wallet** to link MetaMask.
3. Choose your role: **Producer** (sell energy) or **Consumer** (buy energy/carbon credits).
4. Once Role is chosen, it cannot be changed, for making sure same guy does not buy and sell energy from himslef, burdening the blockchain, In future, we will link user with their unique ids like Producer License, thus making sure no illegal selling of energy happens.

### For Producers:
1. Navigate to the **Producer Dashboard**.
2. Users are currently allowed to manually update the energy, but this feature is added mainly for IoT integration.
3. Enter energy amount and set a price per unit.
4. Click **Create Offer** to list your energy for sale.
5. Monitor offers and complete transactions when a buyer purchases.

### For Consumers:
1. Go to the **Consumer Dashboard**.
2. Browse available energy and carbon credit offers.
3. Click **Purchase** and confirm the transaction in MetaMask.
4. View your updated energy and carbon credit balances.

## IoT Integration:
1. Realtime updating of Energy Balance using UpdateEnergy function, (can be implemented on layer2 as well, would increase the speed)
2. The logs of machine will be stored on ipfs, and if any user complains about anomaly related to any particular producer, the 
3. Trading will be automated, once offer accepted, the buyer and seller device will be linked, capping the energy transfer.
4. Energy Storage will also become autonomous, as soon as a storage house reaches its capacity, the smart meter can redirect the the energy to different storehouse.
5. Automatic creation of Carbon Credits and checking of carbon limits.
6. In future, AI agents with smart meters can be used for price controling.
 
## Future Enhancements
- Integration with **Layer 2 solutions** for lower transaction costs.
   - Already made and deployed zkSNARK verifier, but the Dapp is not working upon integration ([withZKSnark](withZKSnark))
- Advanced analytics dashboard for tracking energy trades.
- Cross-chain compatibility to expand the trading ecosystem.
- Allowing Energy Storehouses to be part of grid for storage of energy (Creating different portal for them)
- Transaction Records to be stored on IPFS and displayed on user portal.

## License
This project is licensed under the MIT License. Feel free to contribute and enhance the platform!



