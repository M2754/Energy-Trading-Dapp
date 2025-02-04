import React, { useState, useEffect } from "react";
import { generateProof, formatProof } from "../utils/zkutils"; 
import { BigNumber } from "ethers";

function OfferList({ contract, signer, onPurchase }) {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const fetchOffers = async () => {
            if (!contract) return;

            try {
                const latestOfferId = await contract.offerId();
                let fetchedOffers = [];

                for (let i = 0; i < latestOfferId; i++) {
                    const offer = await contract.offers(i);
                    if (offer.quantity > 0) {
                        fetchedOffers.push({
                            id: i,
                            seller: offer.seller,
                            price: offer.pricePerUnit.toString(),
                            quantity: offer.quantity.toString(),
                        });
                    }
                }
                setOffers(fetchedOffers);
            } catch (error) {
                console.error("Error fetching offers:", error);
            }
        };

        fetchOffers();
    }, [contract]);

    const handlePurchase = async (id, quantity, pricePerUnit) => {
        if (!signer) {
            console.error("Signer not available");
            return;
        }
    
        try {
            const totalPrice = pricePerUnit * quantity;
    
            // Generate zk-SNARK proof
            const inputData = {
                offerId: BigNumber.from(id).toNumber(),  // Convert to number
                sellerBalance: (await contract.energyBalance(offers[id].seller)).toNumber(), // Convert BigNumber
                buyerBalance: (await contract.energyBalance(await signer.getAddress())).toNumber(), // Convert BigNumber
                pricePerUnit: BigNumber.from(pricePerUnit).toNumber(), // Convert to number
                quantity: BigNumber.from(quantity).toNumber(), // Convert to number
                payment: BigNumber.from(pricePerUnit * quantity).toNumber(), // Convert to number
                buyerAddress: await signer.getAddress()  // Keep as string
            };
            
    
            const { proof, publicSignals } = await generateProof(inputData);
            console.log("Proof poof!");
            const formattedProof = formatProof(proof, publicSignals);
    
            // Call smart contract function with zk-SNARK proof
            const tx = await contract.purchaseOffer(
                id,
                quantity,
                formattedProof.a,
                formattedProof.b,
                formattedProof.c,
                formattedProof.publicSignals,
                { value: totalPrice }
            );
    
            await tx.wait();
            console.log("Purchase successful!");
    
            // Update UI after purchase
            onPurchase(id, quantity);
    
        } catch (error) {
            console.error("Error purchasing offer:", error);
        }
    };

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Available Energy Offers</h2>
            {offers.length === 0 ? (
                <p>No offers available</p>
            ) : (
                <ul>
                    {offers.map((offer) => (
                        <li key={offer.id} className="mb-2 border-b pb-2">
                            <p>Seller: {offer.seller}</p>
                            <p>Price per kWh: {offer.price}</p>
                            <p>Quantity: {offer.quantity} kWh</p>
                            <button
                                onClick={() => handlePurchase(offer.id, 1, offer.price)}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Purchase 1 kWh
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default OfferList;
