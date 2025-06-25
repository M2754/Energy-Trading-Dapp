import React, { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import Loading from './Loading';

const EnergyDisplay = () => {
    const { contract, account } = useContext(Web3Context);
    const [energy, setEnergy] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            setLoading(true);
            try {
                if (contract && account) {
                    const balance = await contract.getEnergyBalance(account);
                    setEnergy(balance.toString());
                }
            } catch (error) {
                console.error("Failed to fetch balance", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBalance();
    }, [contract, account]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="energy-display-card">
            <h3 className="energy-display-title">Energy Balance</h3>
            <p className="energy-balance-value">{energy} <span className="energy-unit">KWh</span></p>
        </div>
    );
};

export default EnergyDisplay;
