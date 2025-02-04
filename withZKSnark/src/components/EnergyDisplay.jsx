import React, { useState, useEffect } from "react";

function EnergyDisplay({ contract, signer }) {
    const [energyBalance, setEnergyBalance] = useState(0);
    const [carbonCredits, setCarbonCredits] = useState(0);

    useEffect(() => {
        async function fetchBalances() {
            if (!contract || !signer) return;
            try {
                const address = await signer.getAddress();
                const energy = await contract.getEnergyBalance(address);
                const credits = await contract.getCarbonCredits(address);
                setEnergyBalance(energy.toString());
                setCarbonCredits(credits.toString());
            } catch (error) {
                console.error("Error fetching balances:", error);
            }
        }
        fetchBalances();
    }, [contract, signer]);

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold">Your Energy Balance</h2>
            <p className="mt-2">Energy: <strong>{energyBalance} kWh</strong></p>
            <p>Carbon Credits: <strong>{carbonCredits}</strong></p>
        </div>
    );
}

export default EnergyDisplay;
