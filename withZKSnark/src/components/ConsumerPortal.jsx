import React, { useState, useEffect } from "react";
import OfferList from "./OfferList";
import CarbonCreditList from "./CarbonCreditList";

function ConsumerPortal({ contract, signer }) {
    const [energyPurchased, setEnergyPurchased] = useState(0);
    const [carbonCreditsPurchased, setCarbonCreditsPurchased] = useState(0);
    console.log("ConsumerPortal - Contract: ", contract);
    console.log("ConsumerPortal - Signer: ", signer);

    useEffect(() => {
        const storedTransactions = localStorage.getItem("transactions");
        if (storedTransactions) {
            const transactions = JSON.parse(storedTransactions);
            const energyTotal = transactions
                .filter((tx) => tx.type === "energy_purchase")
                .reduce((acc, tx) => acc + Number(tx.amount), 0);
            const carbonTotal = transactions
                .filter((tx) => tx.type === "carbon_credit_purchase")
                .reduce((acc, tx) => acc + Number(tx.amount), 0);
            setEnergyPurchased(energyTotal);
            setCarbonCreditsPurchased(carbonTotal);
        }
    }, []);

    const handlePurchase = (id, amount, type) => {
        const newTransaction = {
            type: type,
            amount: amount,
            unit: type === "energy_purchase" ? "kWh" : "credits",
            timestamp: Date.now(),
        };
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push(newTransaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));
    };

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Consumer Portal</h2>
            <p><strong>Total Energy Purchased:</strong> {energyPurchased} kWh</p>
            <p><strong>Total Carbon Credits Purchased:</strong> {carbonCreditsPurchased} credits</p>
            
            <h3 className="text-lg font-bold mt-4">Available Energy Offers</h3>
            <OfferList contract={contract} signer={signer} onPurchase={(id, amount) => handlePurchase(id, amount, "energy_purchase")} />
            
            <h3 className="text-lg font-bold mt-4">Available Carbon Credit Offers</h3>
            <CarbonCreditList contract={contract} signer={signer} onPurchase={(id, amount) => handlePurchase(id, amount, "carbon_credit_purchase")} />
        </div>
    );
}

export default ConsumerPortal;
