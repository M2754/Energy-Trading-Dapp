// import React, { useState, useContext } from 'react';
// import { Web3Context } from '../contexts/Web3Context';

// const BidForm = () => {
//     const { contract } = useContext(Web3Context);
//     const [price, setPrice] = useState('');
//     const [quantity, setQuantity] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//              if(contract){
//             const transaction = await contract.createBid(price, quantity);
//                 await transaction.wait();
//             console.log('Bid created');
//              setPrice('');
//              setQuantity('');
//             alert("Bid Created!");
//              }
//         } catch (error) {
//           console.error('Error creating bid:', error);
//         }
//     };

//     return (
//         <div>
//             <h3>Create New Bid</h3>
//             <form onSubmit={handleSubmit}>
//                 <label>Price per unit (Wei):
//                     <input
//                         type="number"
//                         value={price}
//                         onChange={e => setPrice(e.target.value)}
//                     />
//                 </label>
//                 <label>Quantity:
//                     <input
//                         type="number"
//                         value={quantity}
//                         onChange={e => setQuantity(e.target.value)}
//                     />
//                 </label>
//                 <button type="submit">Create Bid</button>
//             </form>
//         </div>
//     );
// };

// export default BidForm;
import React, { useState, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

const BidForm = () => {
    const { contract } = useContext(Web3Context);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
         console.log("Creating Bid with price:", price, "and quantity:", quantity)
        try {
             if(contract){
            const transaction = await contract.createBid(price, quantity);
                console.log("Bid Transaction hash", transaction.hash); // Check if transaction was created.
                await transaction.wait();
            console.log('Bid created');
             setPrice('');
             setQuantity('');
            alert("Bid Created!");
             }
        } catch (error) {
          console.error('Error creating bid:', error);
        }
    };

    return (
        <div>
            <h3>Create New Bid</h3>
            <form onSubmit={handleSubmit}>
                <label>Price per unit (Wei):
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </label>
                <label>Quantity:
                    <input
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                    />
                </label>
                <button type="submit">Create Bid</button>
            </form>
        </div>
    );
};

export default BidForm;