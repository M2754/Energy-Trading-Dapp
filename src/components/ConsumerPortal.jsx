import React, { useState, useEffect } from 'react';
import OfferList from './OfferList';
import BidForm from './BidForm';
import EnergyDisplay from './EnergyDisplay';
import Loading from './Loading';

const ConsumerPortal = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div>
             {loading ? <Loading/> :
            <>
             <h2>Consumer Portal</h2>
            <EnergyDisplay />
             <OfferList />
            <BidForm />
            </>
             }
        </div>
    );
};

export default ConsumerPortal;