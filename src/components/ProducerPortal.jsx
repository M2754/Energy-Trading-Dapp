import React, { useState, useEffect } from 'react';
import OfferForm from './OfferForm';
import CarbonCreditForm from './CarbonCreditForm';
import CarbonCreditDisplay from './CarbonCreditDisplay';
import UpdateEnergy from './UpdateEnergy';
import EnergyDisplay from './EnergyDisplay';
import BidList from './BidList';
import Loading from './Loading';

const ProducerPortal = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div>
            {loading ? <Loading/> :
            <>
             <h2>Producer Portal</h2>
             <EnergyDisplay/>
             <CarbonCreditDisplay/>
             <UpdateEnergy/>
             <OfferForm />
             <CarbonCreditForm/>
             
             
             </>
             }
        </div>
    );
};

export default ProducerPortal;