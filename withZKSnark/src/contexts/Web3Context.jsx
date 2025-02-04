import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import EnergyTrading from '../utils/EnergyTrading.json'; // Import ABI
// const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = '0xFdCf44C211f29B2E38CB9480d9E7D0e358eB7769';  // Replace with your contract address
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
                console.log("Requesting wallet connection...");
    
                const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
                const signerInstance = await providerInstance.getSigner();
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    
                console.log("Wallet connected: ", accounts[0]);
    
                if (!EnergyTrading.abi) {
                    throw new Error("ABI is missing or not loaded properly.");
                }
    
                const contractInstance = new ethers.Contract(contractAddress, EnergyTrading.abi, signerInstance);
    
                setProvider(providerInstance);
                setSigner(signerInstance);
                setContract(contractInstance);
                setAccount(accounts[0]);
    
                console.log("✅ Provider set:", providerInstance);
                console.log("✅ Signer set:", signerInstance);
                console.log("✅ Contract set:", contractInstance);
    
                localStorage.setItem("isWalletConnected", "true");
            } else {
                alert("MetaMask is not installed. Please install it.");
            }
        } catch (error) {
            console.error("❌ Error connecting to wallet:", error);
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
            if (isWalletConnected === 'true') {
                console.log("isWalletConnected:", isWalletConnected);
                await connectWallet();
            }
        };
        checkWalletConnection();
    }, []);

    useEffect(() => {
        if (account && contract) {
            console.log("Wallet connected to:", account);
            console.log("Contract instance:", contract);
        }
    }, [account, contract]);

    const value = {
        connectWallet,
        disconnectWallet,
        account,
        provider,
        signer,
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
