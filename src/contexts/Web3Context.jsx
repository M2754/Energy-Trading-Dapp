import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import EnergyTrading from '../utils/EnergyTrading.json'; // Import ABI
//const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = '0xEEaFA80184Fb41eC2BDD54A219710E381a3541A5';  // Replace with your contract address
const Web3Context = createContext();

const Web3Provider = ({ children }) => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);

    const connectWallet = async () => {
        setLoading(true);
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = await provider.getSigner();
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const contract = new ethers.Contract(contractAddress, EnergyTrading, signer);

                setProvider(provider);
                setSigner(signer);
                setContract(contract);
                setAccount(accounts[0]);
                localStorage.setItem('isWalletConnected', 'true');
              } else {
                alert("MetaMask is not installed. Please install it.");
              }
          } catch (error) {
            console.error("Error connecting to wallet:", error);
          } finally {
            setLoading(false);
          }
    };

    const disconnectWallet = async () => {
       setProvider(null);
       setSigner(null);
       setContract(null);
       setAccount(null);
       localStorage.removeItem('isWalletConnected');
    };
    
     useEffect(() => {
         const checkWalletConnection = async () => {
            const isWalletConnected = localStorage.getItem('isWalletConnected');
             if (isWalletConnected === 'true'){
                console.log("isWalletConnected:", isWalletConnected)
                await connectWallet()
             }
         };
         checkWalletConnection();
     }, []);

    const value = {
        connectWallet,
        disconnectWallet,
        account,
        contract,
        loading,
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};

export { Web3Context, Web3Provider };