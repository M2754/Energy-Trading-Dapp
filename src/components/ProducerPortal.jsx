import React, { useState, useEffect } from 'react';
import OfferForm from './OfferForm';
import BidList from './BidList';
import Loading from './Loading';

const ProducerPortal = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div>
            {loading ? <Loading/> :
            <>
             <h2>Producer Portal</h2>
             <OfferForm />
             <BidList />
             </>
             }
        </div>
    );
};

export default ProducerPortal;