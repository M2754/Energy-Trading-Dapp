import React, { useState } from 'react';
import OfferForm from './OfferForm';
import CarbonCreditForm from './CarbonCreditForm';
import CarbonCreditDisplay from './CarbonCreditDisplay';
import UpdateEnergy from './UpdateEnergy';
import EnergyDisplay from './EnergyDisplay';
import Loading from './Loading';
import './ProducerPortal.css';

const ProducerPortal = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div className="portal-container">
            {loading ? (
                <Loading />
            ) : (
                <>
                    <h2 className="portal-title">Welcome to Dihing Energy Trading App</h2>
                    <h2 className="portal-subtitle">Producer Portal</h2>
                    <div className="dashboard">
                        <EnergyDisplay />
                        <CarbonCreditDisplay />
                    </div>
                    <div className="producer-actions">
                        <UpdateEnergy />
                        <OfferForm />
                        <CarbonCreditForm />
                    </div>
                </>
            )}
        </div>
    );
};

export default ProducerPortal;