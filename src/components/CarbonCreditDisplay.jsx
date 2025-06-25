import React, { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import Loading from './Loading';

const CarbonCreditDisplay = () => {
    const { contract, account } = useContext(Web3Context);
    const [carbonCredits, setCarbonCredits] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCarbonCredits = async () => {
            setLoading(true);
            try {
                if (contract && account) {
                    const credits = await contract.getCarbonCredits(account);
                    setCarbonCredits(credits.toString());
                }
            } catch (error) {
                console.error("Failed to fetch carbon credits", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCarbonCredits();
    }, [contract, account]);

    if (loading) {
        return <Loading/>;
    }

    return (
        <div className="carbon-credit-display-card">
            <h3 className="carbon-credit-display-title">Carbon Credit Balance</h3>
            <p className="carbon-credit-balance-value">{carbonCredits} <span className="carbon-credit-unit">credits</span></p>
        </div>
    );
};

export default CarbonCreditDisplay;
