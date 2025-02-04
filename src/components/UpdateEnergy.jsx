import React, { useState, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

const UpdateEnergy = () => {
    const { contract, account } = useContext(Web3Context);
    const [amount, setAmount] = useState('');
    const [isRenewable, setIsRenewable] = useState(false);
    const [carbonCredits, setCarbonCredits] = useState('');

    // Handle amount change and update carbon credits dynamically
    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        if (isRenewable) {
            setCarbonCredits(value ? value / 10 : '');
        }
    };

    // Handle renewable checkbox change
    const handleRenewableChange = (e) => {
        setIsRenewable(e.target.checked);
        if (e.target.checked && amount) {
            setCarbonCredits(amount / 10);
        } else {
            setCarbonCredits('');
        }
    };

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
            alert('Failed to update energy. Check the console for details.');
        }
    };

    return (
        <div>
            <h3>Update Energy</h3>
            <form onSubmit={handleSubmit}>
                <label>Amount of Energy (KWh):
                    <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        required
                    />
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={isRenewable}
                        onChange={handleRenewableChange}
                    />
                    Is Renewable Energy
                </label>
                {isRenewable && (
                    <label>Carbon Credits:
                        <input
                            type="number"
                            value={carbonCredits}
                            readOnly
                        />
                    </label>
                )}
                <button type="submit">Update Energy</button>
            </form>
        </div>
    );
};

export default UpdateEnergy;
