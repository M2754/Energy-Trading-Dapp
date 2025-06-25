import React, { useState } from 'react';
import OfferList from './OfferList';
import EnergyDisplay from './EnergyDisplay';
import CarbonCreditDisplay from './CarbonCreditDisplay';
import CarbonCreditOfferList from './CarbonCreditOfferList';
import Loading from './Loading';
import './ConsumerPortal.css'; // Make sure to import the CSS

const ConsumerPortal = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div className="portal-container">
            {loading ? (
                <Loading />
            ) : (
                <>
                    <h2 className="portal-title">Welcome to Dihing Energy Trading App</h2>
                    <h2 className="portal-subtitle">Consumer Portal</h2><div className="dashboard">
                        <EnergyDisplay />
                        <CarbonCreditDisplay />
                    </div>
                    <div className="offers-section">
                        <OfferList />
                        <CarbonCreditOfferList />
                    </div>
                </>
            )}
        </div>
    );
};

export default ConsumerPortal;