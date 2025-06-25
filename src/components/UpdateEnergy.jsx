import React, { useState, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

const UpdateEnergy = () => {
    const { contract, account } = useContext(Web3Context);
    const [amount, setAmount] = useState('');
    const [isRenewable, setIsRenewable] = useState(false);
    const [carbonCredits, setCarbonCredits] = useState('');

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        if (isRenewable) {
            setCarbonCredits(value ? value / 10 : '');
        }
    };

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
                alert('Energy updated successfully!');
                setAmount('');
                setCarbonCredits('');
            }
        } catch (error) {
            alert('Failed to update energy. Check the console for details.');
        }
    };

    return (
        <div className="update-energy-card">
            <h3 className="update-energy-title">Update Energy</h3>
            <form className="update-energy-form" onSubmit={handleSubmit}>
                <label>
                    <span>Amount (KWh):</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        required
                        min="0"
                    />
                </label>
                <label className="renewable-checkbox">
                    <input
                        type="checkbox"
                        checked={isRenewable}
                        onChange={handleRenewableChange}
                    /> 
                    Is Renewable
                </label>
                {isRenewable && (
                    <label>
                        <span>Carbon Credits:</span>
                        <input
                            type="number"
                            value={carbonCredits}
                            readOnly
                        />
                    </label>
                )}
                <button className="update-energy-btn" type="submit">Update</button>
            </form>
        </div>
    );
};

export default UpdateEnergy;
