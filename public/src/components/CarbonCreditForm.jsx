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
        <div>
            <h3>Create Carbon Credit Offer</h3>
            <form onSubmit={handleSubmit}>
                <label>Price per credit (Wei):
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </label>
                <label>Quantity:
                    <input
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                    />
                </label>
                <button type="submit">Create Carbon Credit Offer</button>
            </form>
        </div>
    );
};

export default CarbonCreditForm;
