import React, { useState, useEffect } from "react";
import UpdateEnergy from "./UpdateEnergy";
import OfferForm from "./OfferForm";
import CarbonCreditForm from "./CarbonCreditForm";

function ProducerPortal({ contract, signer }) {
    const [energyAvailable, setEnergyAvailable] = useState(0);
    const [carbonCreditsAvailable, setCarbonCreditsAvailable] = useState(0);
   
    console.log("Producer Portal - Contract: ", contract);
    console.log("Producer Portal - Signer: ", signer);
    useEffect(() => {
        async function fetchBalances() {
            if (!contract || !signer) return;
            try {
                const address = await signer.getAddress();
                const energy = await contract.getEnergyBalance(address);
                const credits = await contract.getCarbonCredits(address);
                setEnergyAvailable(energy.toString());
                setCarbonCreditsAvailable(credits.toString());
            } catch (error) {
                console.error("Error fetching balances:", error);
            }
        }
        fetchBalances();
    }, [contract, signer]);

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Producer Portal</h2>
            <p><strong>Total Energy Available:</strong> {energyAvailable} kWh</p>
            <p><strong>Total Carbon Credits Available:</strong> {carbonCreditsAvailable} credits</p>
            
            <h3 className="text-lg font-bold mt-4">Update Energy</h3>
            <UpdateEnergy contract={contract} signer={signer} />
            
            <h3 className="text-lg font-bold mt-4">Create Energy Offer</h3>
            <OfferForm contract={contract} signer={signer} />
            
            <h3 className="text-lg font-bold mt-4">Create Carbon Credit Offer</h3>
            <CarbonCreditForm contract={contract} signer={signer} />
        </div>
    );
}

export default ProducerPortal;
