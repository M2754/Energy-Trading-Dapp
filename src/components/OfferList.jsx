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
                        pricePerUnit: offer[1].toString(),
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
            const quantityInput = prompt('Enter quantity to buy:');
            if (!quantityInput) return;
            const quantityToBuy = quantityInput;
            const totalPrice = pricePerUnit * quantityToBuy;

            const transaction = await contract.purchaseOffer(
                offerId,
                quantityToBuy,
                { value: totalPrice.toString() }
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
        <div className="offer-list-card">
            <h3 className="offer-list-title">Available Offers</h3>
            {offers.length > 0 ? (
                offers.map((offer) => (
                    <div className="offer-card" key={offer.id}>
                        <p><strong>Seller:</strong> {offer.seller.substring(0, 6)}...{offer.seller.slice(-4)}</p>
                        <p><strong>Price:</strong> {offer.pricePerUnit} Wei/unit</p>
                        <p><strong>Quantity:</strong> {offer.quantity} units</p>
                        {account && (
                            <button
                                className="offer-btn"
                                onClick={() => handlePurchase(offer.id, offer.pricePerUnit)}
                            >
                                Purchase
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p>No offers available.
                    {/* Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab deleniti voluptas repudiandae tenetur quisquam dignissimos accusantium et cumque. Eius, vitae soluta itaque quisquam unde mollitia dolores facilis perspiciatis asperiores tempore. */}
                    {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita voluptas dicta exercitationem, eum ad ipsa consequatur veniam minus, saepe aspernatur deserunt deleniti perspiciatis ratione optio non, aperiam ea maiores beatae? */}
                </p>
            )}
        </div>
    );
};

export default OfferList;
