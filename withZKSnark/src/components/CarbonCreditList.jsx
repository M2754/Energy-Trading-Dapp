import React, { useState, useEffect } from "react";

function CarbonCreditList({ contract, signer, onPurchase }) {
    const [carbonOffers, setCarbonOffers] = useState([]);

    useEffect(() => {
        const fetchCarbonOffers = async () => {
            if (!contract) return;
    
            try {
                const latestCarbonCreditOfferId = await contract.carbonCreditOfferId(); // Use carbonCreditOfferId instead of getCarbonCreditOfferCount()
                let fetchedOffers = [];
    
                for (let i = 0; i < latestCarbonCreditOfferId; i++) {
                    const offer = await contract.carbonCreditOffers(i);
                    if (offer.quantity > 0) {
                        fetchedOffers.push({
                            id: i,
                            seller: offer.seller,
                            price: offer.pricePerCredit.toString(),
                            quantity: offer.quantity.toString(),
                        });
                    }
                }
                setCarbonOffers(fetchedOffers);
            } catch (error) {
                console.error("Error fetching carbon credit offers:", error);
            }
        };
    
        fetchCarbonOffers();
    }, [contract]);
    

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Available Carbon Credit Offers</h2>
            {carbonOffers.length === 0 ? (
                <p>No carbon credit offers available</p>
            ) : (
                <ul>
                    {carbonOffers.map((offer) => (
                        <li key={offer.id} className="mb-2 border-b pb-2">
                            <p>Seller: {offer.seller}</p>
                            <p>Price per Credit: {offer.pricePerCredit}</p>
                            <p>Quantity: {offer.quantity}</p>
                            <button
                                onClick={() => onPurchase(offer.id, offer.quantity)}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Purchase
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CarbonCreditList;
