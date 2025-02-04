import React, { useState } from "react";

function CarbonCreditForm({ contract, signer }) {
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    const handleCreateCarbonCreditOffer = async () => {
        if (!contract || !signer || !price || !quantity) return;
        try {
            const tx = await contract.createCarbonCreditOffer(price, quantity);
            await tx.wait();
            alert("Carbon Credit Offer created successfully!");
            setPrice("");
            setQuantity("");
        } catch (error) {
            console.error("Error creating carbon credit offer:", error);
        }
    };

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold">Create Carbon Credit Offer</h2>
            <input
                type="number"
                placeholder="Price per Credit"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 w-full mt-2"
            />
            <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border p-2 w-full mt-2"
            />
            <button
                onClick={handleCreateCarbonCreditOffer}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Create Offer
            </button>
        </div>
    );
}

export default CarbonCreditForm;

