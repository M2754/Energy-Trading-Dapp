import React, { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import Loading from './Loading';

const CarbonCreditOfferList = () => {
    const { contract, account } = useContext(Web3Context);
    const [carbonCreditOffers, setCarbonCreditOffers] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchCarbonCreditOffers = async () => {
            setLoading(true);
            try {
                if(contract) {
                    const offerCount = await contract.getCarbonCreditOfferCount();
                    const offerDetailsPromises = [];
                    for (let i = 0; i < offerCount; i++) {
                        offerDetailsPromises.push(contract.getCarbonCreditOfferDetails(i));
                    }
                    const offerDetails = await Promise.all(offerDetailsPromises);
                    const offersWithId = offerDetails.map((offer, index) => ({
                        id: index,
                        seller: offer[0],
                        pricePerCredit: offer[1].toString(),
                        quantity: offer[2].toString(),
                    }));
                    setCarbonCreditOffers(offersWithId);
                }
            } catch (error) {
                console.error('Error fetching carbon credit offers:', error);
            } finally {
                setLoading(false);
            }
        };
  
        fetchCarbonCreditOffers();
    }, [contract]);

    const handlePurchase = async (offerId, pricePerCredit, quantity) => {
        try {
            const totalPrice = pricePerCredit * quantity;
            const transaction = await contract.purchaseCarbonCredit(offerId, quantity, { value: totalPrice.toString() });
            await transaction.wait();
            console.log("Transaction successful");
            alert("Transaction successful");
        } catch (error) {
            console.error('Error purchasing carbon credits:', error);
        }
    };

    if (loading) {
        return <Loading/>;
    }

    return (
        <div>
            <h3>Available Carbon Credit Offers</h3>
            {carbonCreditOffers.length > 0 ? (
                carbonCreditOffers.map(offer => (
                    <div key={offer.id}>
                        <p>Seller: {offer.seller.substring(0, 6)}...{offer.seller.slice(-4)}</p>
                        <p>Price: {offer.pricePerCredit} Wei/credit</p>
                        <p>Quantity: {offer.quantity} credits</p>
                        {account && <button onClick={() => handlePurchase(offer.id, offer.pricePerCredit, offer.quantity)}>
                            Purchase
                        </button>}
                    </div>
                ))
            ) : (
                <p>No carbon credit offers available.</p>
            )}
        </div>
    );
};

export default CarbonCreditOfferList;
