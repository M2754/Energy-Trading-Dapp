import React, { useState, useEffect } from 'react';
import OfferList from './OfferList';
import BidForm from './BidForm';
import EnergyDisplay from './EnergyDisplay';
import CarbonCreditDisplay from './CarbonCreditDisplay';
import CarbonCreditOfferList from './CarbonCreditOfferList';
import Loading from './Loading';

const ConsumerPortal = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div>
             {loading ? <Loading/> :
            <>
             <h2>Consumer Portal</h2>
            <EnergyDisplay />
            <CarbonCreditDisplay/>
             <OfferList />
             <CarbonCreditOfferList/>
            
            </>
             }
        </div>
    );
};

export default ConsumerPortal;