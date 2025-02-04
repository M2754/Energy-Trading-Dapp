import React, { useState, useEffect } from "react";

function TransactionHistory({ role }) {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const storedTransactions = localStorage.getItem("transactions");
        if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions));
        }
    }, []);

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Transaction History</h2>
            {transactions.length === 0 ? (
                <p>No transactions recorded</p>
            ) : (
                <ul>
                    {transactions.map((tx, index) => (
                        <li key={index} className="mb-2 border-b pb-2">
                            <p><strong>Type:</strong> {tx.type}</p>
                            <p><strong>Amount:</strong> {tx.amount} {tx.unit}</p>
                            <p><strong>Date:</strong> {new Date(tx.timestamp).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TransactionHistory;
