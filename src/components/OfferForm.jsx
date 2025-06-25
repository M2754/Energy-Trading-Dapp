import React, { useState, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

const OfferForm = () => {
    const { contract } = useContext(Web3Context);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if(contract){
             const transaction = await contract.createOffer(price, quantity);
                await transaction.wait();
            console.log('Offer created');
             setPrice('');
             setQuantity('');
            alert("Offer Created!");
          }
        } catch (error) {
          console.error('Error creating offer:', error);
        }
    };

    return (
        <div className="offer-form-card">
            <h3 className="offer-form-title">Create New Offer</h3>
            <form className="offer-form" onSubmit={handleSubmit}>
                <label>
                    <span>Price per unit (Wei):</span>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                        min="0"
                    />
                </label>
                <label>
                    <span>Quantity:</span>
                    <input
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        required
                        min="0"
                    />
                </label>
                <button className="offer-form-btn" type="submit">Create Offer</button>
            </form>
        </div>
    );
};

export default OfferForm;