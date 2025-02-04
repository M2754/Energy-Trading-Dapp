import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { generateProof, formatProof } from "../utils/zkUtils";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

function EnergyOffers() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        async function loadBlockchainData() {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

                setProvider(provider);
                setSigner(signer);
                setContract(contract);
            } else {
                alert("Please install MetaMask!");
            }
        }
        loadBlockchainData();
    }, []);

    async function createOffer(price, quantity) {
        const tx = await contract.createOffer(price, quantity);
        await tx.wait();
        alert("Offer created successfully!");
    }

    async function purchaseOffer(offerId, quantity) {
        const inputData = {
            sellerBalance: "100", 
            buyerBalance: "20", 
            pricePerUnit: "5",
            quantity: quantity.toString(),
            payment: (5 * quantity).toString()
        };

        const { proof, publicSignals } = await generateProof(inputData);
        const formattedProof = formatProof(proof, publicSignals);

        const tx = await contract.purchaseOffer(
            offerId, 
            quantity, 
            formattedProof.a, 
            formattedProof.b, 
            formattedProof.c, 
            formattedProof.publicSignals
        );
        await tx.wait();
        alert("Offer purchased successfully!");
    }

    async function getOffers() {
        const count = await contract.getOfferCount();
        let tempOffers = [];
        for (let i = 0; i < count; i++) {
            const offer = await contract.getOfferDetails(i);
            tempOffers.push({
                seller: offer[0],
                price: offer[1].toString(),
                quantity: offer[2].toString(),
                id: i
            });
        }
        setOffers(tempOffers);
    }

    return (
        <div>
            <h1>Energy Trading dApp</h1>

            <h2>Create Energy Offer</h2>
            <button onClick={() => createOffer(5, 10)}>Create Offer</button>

            <h2>Available Offers</h2>
            <button onClick={getOffers}>Load Offers</button>
            <ul>
                {offers.map((offer, index) => (
                    <li key={index}>
                        Seller: {offer.seller} | Price: {offer.price} | Quantity: {offer.quantity}
                        <button onClick={() => purchaseOffer(offer.id, 2)}>Buy 2 Units</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EnergyOffers;
