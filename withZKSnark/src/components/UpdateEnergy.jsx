import React, { useState } from "react";

function UpdateEnergy({ contract, signer }) {
    const [amount, setAmount] = useState("");
    const [isRenewable, setIsRenewable] = useState(false);

    const handleUpdateEnergy = async (e) => {
        e.preventDefault();
        console.log("Update Energy button clicked"); // Debug log

        if (!contract ) {
            console.log("Contract, signer, or amount missing"); // Debug log
            return;
        }

        try {
            const address = await signer.getAddress();
            let tx;
            console.log("User address:", address); // Debug log

            if (isRenewable) {
                const carbonCreditAmount = Math.floor(amount / 10);
                console.log("Updating renewable energy with carbon credits:", carbonCreditAmount); // Debug log
                tx = await contract.updateRenewableEnergy(amount);
            } else {
                console.log("Updating non-renewable energy"); // Debug log
                tx = await contract.updateNonRenewableEnergy(amount);
            }

            console.log("Transaction sent:", tx); // Debug log
            await tx.wait();
            console.log("Transaction confirmed"); // Debug log

            alert("Energy updated successfully!");
            setAmount("");
        } catch (error) {
            console.error("Error updating energy:", error);
            alert("Transaction failed!");
        }
    };

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold">Update Energy</h2>
            <input
                type="number"
                placeholder="Enter energy amount (kWh)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-2 w-full mt-2"
            />
            <div className="mt-2">
                <label className="mr-2">Renewable:</label>
                <input
                    type="checkbox"
                    checked={isRenewable}
                    onChange={() => setIsRenewable(!isRenewable)}
                />
            </div>
            <button
                onClick={handleUpdateEnergy}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Update Energy
            </button>
        </div>
    );
}

export default UpdateEnergy;
