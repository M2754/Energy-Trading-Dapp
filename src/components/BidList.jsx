// // import React, { useState, useEffect, useContext } from 'react';
// // import { Web3Context } from '../contexts/Web3Context';
// // import Loading from './Loading';

// // const BidList = () => {
// //     const { contract, account } = useContext(Web3Context);
// //     const [bids, setBids] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     useEffect(() => {
// //         const fetchBids = async () => {
// //             setLoading(true);
// //             try {
// //                 if(contract){
// //                 const bidCount = await contract.getBidCount();
// //                 const bidDetailsPromises = [];
// //                 for (let i = 0; i < bidCount; i++) {
// //                    bidDetailsPromises.push(contract.getBidDetails(i));
// //                 }
// //                 const bidDetails = await Promise.all(bidDetailsPromises);
// //                   const bidsWithId = bidDetails.map((bid, index) => ({
// //                         id: index,
// //                         bidder: bid[0],
// //                         pricePerUnit: bid[1].toString(),
// //                         quantity: bid[2].toString(),
// //                         isAccepted: bid[3]
// //                     }));
// //                  setBids(bidsWithId);
// //                 }
// //             } catch (error) {
// //                 console.error('Error fetching bids:', error);
// //              }
// //             finally {
// //               setLoading(false)
// //             }
// //         };

// //         fetchBids();
// //     }, [contract]);


// //     const handleAccept = async (bidId) => {
// //         try {
// //           const transaction = await contract.acceptBid(bidId);
// //           await transaction.wait();
// //           console.log('Bid accepted');
// //         } catch (error) {
// //           console.error('Error accepting bid:', error);
// //         }
// //     };

// //      if (loading) {
// //          return <Loading/>
// //      }

// //     return (
// //         <div>
// //             <h3>Pending Bids</h3>
// //             {bids.length > 0 ? (
// //                 bids.map(bid => (
// //                    !bid.isAccepted &&  <div key={bid.id}>
// //                         <p>Bidder: {bid.bidder.substring(0, 6)}...{bid.bidder.slice(-4)}</p>
// //                         <p>Price: {bid.pricePerUnit} Wei/unit</p>
// //                         <p>Quantity: {bid.quantity} units</p>
// //                         {account && <button onClick={() => handleAccept(bid.id)}>Accept</button>}
// //                     </div>
// //                 ))
// //             ) : (
// //                 <p>No bids available.</p>
// //             )}
// //         </div>
// //     );
// // };

// // export default BidList;
// import React, { useState, useEffect, useContext } from 'react';
// import { Web3Context } from '../contexts/Web3Context';
// import Loading from './Loading';

// const BidList = () => {
//     const { contract, account } = useContext(Web3Context);
//     const [bids, setBids] = useState([]);
//     const [loading, setLoading] = useState(true);

//      useEffect(() => {
//         const fetchBids = async () => {
//             setLoading(true);
//              console.log("Fetching bids");
//             try {
//                 if(contract){
//                 const bidCount = await contract.getBidCount();
//                 const bidDetailsPromises = [];
//                 for (let i = 0; i < bidCount; i++) {
//                    bidDetailsPromises.push(contract.getBidDetails(i));
//                 }
//                 const bidDetails = await Promise.all(bidDetailsPromises);
//                   const bidsWithId = bidDetails.map((bid, index) => ({
//                         id: index,
//                         bidder: bid[0],
//                         pricePerUnit: bid[1].toString(),
//                         quantity: bid[2].toString(),
//                         isAccepted: bid[3]
//                     }));
//                     console.log("Fetched Bids:", bidsWithId); // check fetched bids.
//                  setBids(bidsWithId);
//                 }
//             } catch (error) {
//                 console.error('Error fetching bids:', error);
//              }
//             finally {
//               setLoading(false)
//             }
//         };

//         fetchBids();
//     }, [contract]);


//     const handleAccept = async (bidId) => {
//         try {
//           const transaction = await contract.acceptBid(bidId);
//           await transaction.wait();
//           console.log('Bid accepted');
//         } catch (error) {
//           console.error('Error accepting bid:', error);
//         }
//     };

//      if (loading) {
//          return <Loading/>
//      }

//     return (
//         <div>
//             <h3>Pending Bids</h3>
//             {bids.length > 0 ? (
//                 bids.map(bid => (
//                    !bid.isAccepted &&  <div key={bid.id}>
//                         <p>Bidder: {bid.bidder.substring(0, 6)}...{bid.bidder.slice(-4)}</p>
//                         <p>Price: {bid.pricePerUnit} Wei/unit</p>
//                         <p>Quantity: {bid.quantity} units</p>
//                         {account && <button onClick={() => handleAccept(bid.id)}>Accept</button>}
//                     </div>
//                 ))
//             ) : (
//                 <p>No bids available.</p>
//             )}
//         </div>
//     );
// };

// export default BidList;

import React, { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import Loading from './Loading';

const BidList = () => {
    const { contract, account } = useContext(Web3Context);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBids = async () => {
        setLoading(true);
        console.log("Fetching bids");
        try {
            if (contract) {
                // Get total number of bids ever created
                const bidIdTotal = await contract.bidId();
                const bidDetailsPromises = [];
                
                // Check all possible bid IDs
                for (let i = 0; i < bidIdTotal; i++) {
                    bidDetailsPromises.push(contract.getBidDetails(i));
                }
                
                const bidDetails = await Promise.all(bidDetailsPromises);
                const activeBids = bidDetails
                    .map((bid, index) => ({
                        id: index,
                        bidder: bid[0],
                        pricePerUnit: bid[1].toString(),
                        quantity: bid[2].toString(),
                        lockedEther: bid[3].toString()
                    }))
                    // Filter out deleted bids (where bidder is zero address)
                    .filter(bid => bid.bidder !== '0x0000000000000000000000000000000000000000');

                console.log("Fetched Bids:", activeBids);
                setBids(activeBids);
            }
        } catch (error) {
            console.error('Error fetching bids:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBids();
    }, [contract]);

    const handleAccept = async (bidId) => {
        try {
            const transaction = await contract.acceptBid(bidId);
            await transaction.wait();
            console.log('Bid accepted');
            // Refresh the bid list after acceptance
            await fetchBids();
        } catch (error) {
            console.error('Error accepting bid:', error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <h3>Pending Bids</h3>
            {bids.length > 0 ? (
                bids.map(bid => (
                    <div key={bid.id}>
                        <p>Bidder: {bid.bidder.substring(0, 6)}...{bid.bidder.slice(-4)}</p>
                        <p>Price: {bid.pricePerUnit} Wei/unit</p>
                        <p>Quantity: {bid.quantity} units</p>
                        {account && <button onClick={() => handleAccept(bid.id)}>Accept</button>}
                    </div>
                ))
            ) : (
                <p>No bids available.</p>
            )}
        </div>
    );
};

export default BidList;