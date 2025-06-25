import React, { useState, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

const CarbonCreditForm = () => {
    const { contract } = useContext(Web3Context);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (contract) {
                const transaction = await contract.createCarbonCreditOffer(price, quantity);
                await transaction.wait();
                console.log('Carbon credit offer created');
                setPrice('');
                setQuantity('');
                alert("Carbon Credit Offer Created!");
            }
        } catch (error) {
            console.error('Error creating carbon credit offer:', error);
        }
    };

    return (
        <div className="carbon-credit-form-card">
            <h3 className="carbon-credit-form-title">Create Carbon Credit Offer</h3>
            <form className="carbon-credit-form" onSubmit={handleSubmit}>
                <label>
                    <span>Price per credit (Wei):</span>
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
                <button className="carbon-credit-form-btn" type="submit">
                    Create Carbon Credit Offer
                </button>
            </form>
        </div>
    );
};

export default CarbonCreditForm;
