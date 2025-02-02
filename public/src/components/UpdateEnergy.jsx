import React, { useState, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

const UpdateEnergy = () => {
    const { contract, account } = useContext(Web3Context);
    const [amount, setAmount] = useState('');
    const [isRenewable, setIsRenewable] = useState(false);
    const [carbonCredits, setCarbonCredits] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (contract && account) {
                let transaction;
                if (isRenewable) {
                    transaction = await contract.updateRenewableEnergy(account, amount, carbonCredits);
                } else {
                    transaction = await contract.updateNonRenewableEnergy(account, amount);
                }
                await transaction.wait();
                console.log('Energy updated successfully');
                alert('Energy updated successfully!');
                setAmount('');
                setCarbonCredits('');
            }
        } catch (error) {
            console.error('Error updating energy:', error);
        }
    };

    return (
        <div>
            <h3>Update Energy</h3>
            <form onSubmit={handleSubmit}>
                <label>Amount of Energy (units):
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={isRenewable}
                        onChange={e => setIsRenewable(e.target.checked)}
                    />
                    Is Renewable Energy
                </label>
                {isRenewable && (
                    <label>Carbon Credits:
                        <input
                            type="number"
                            value={carbonCredits}
                            onChange={e => setCarbonCredits(e.target.value)}
                            required
                        />
                    </label>
                )}
                <button type="submit">Update Energy</button>
            </form>
        </div>
    );
};

export default UpdateEnergy;
