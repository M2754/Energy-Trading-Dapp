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
        <div>
            <h3>Create New Offer</h3>
            <form onSubmit={handleSubmit}>
                <label>Price per unit (Wei):
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
                <button type="submit">Create Offer</button>
            </form>
        </div>
    );
};

export default OfferForm;