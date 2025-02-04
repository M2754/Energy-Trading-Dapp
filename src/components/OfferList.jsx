import React, { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import Loading from './Loading';

const OfferList = () => {
    const { contract, account } = useContext(Web3Context);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true);
            try {
                if (contract) {
                    const offerCount = await contract.getOfferCount();
                    const offerDetailsPromises = [];
                    for (let i = 0; i < offerCount; i++) {
                        offerDetailsPromises.push(contract.getOfferDetails(i));
                    }
                    const offerDetails = await Promise.all(offerDetailsPromises);

                    const offersWithId = offerDetails.map((offer, index) => ({
                        id: index,
                        seller: offer[0],
                        pricePerUnit: offer[1].toString(), // Wei (as string)
                        quantity: offer[2].toString(),
                    }));

                    setOffers(offersWithId);
                }
            } catch (error) {
                console.error('Error fetching offers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [contract]);

    const handlePurchase = async (offerId, pricePerUnit) => {
        try {
            // Prompt user for how many units they want to buy
            const quantityInput = prompt('Enter quantity to buy:');
            
            // If user cancels or enters nothing, just return
            if (!quantityInput) return;
            
            // Convert to a BigInt to avoid overflow if dealing with large numbers
            const quantityToBuy = (quantityInput);

            // pricePerUnit is a string, convert it to BigInt as well
            const totalPrice = (pricePerUnit) * quantityToBuy;

            const transaction = await contract.purchaseOffer(
                offerId,
                quantityToBuy, 
                { value: totalPrice.toString() }  // must be a string for Ethers
            );

            await transaction.wait();
            console.log('Transaction successful');
            alert('Transaction successful');
        } catch (error) {
            console.error('Error purchasing offer:', error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <h3>Available Offers</h3>
            {offers.length > 0 ? (
                offers.map((offer) => (
                    <div key={offer.id}>
                        <p>Seller: {offer.seller.substring(0, 6)}...{offer.seller.slice(-4)}</p>
                        <p>Price: {offer.pricePerUnit} Wei/unit</p>
                        <p>Quantity: {offer.quantity} units</p>
                        {account && (
                            <button
                                onClick={() => handlePurchase(offer.id, offer.pricePerUnit)}
                            >
                                Purchase
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p>No offers available.</p>
            )}
        </div>
    );
};

export default OfferList;
