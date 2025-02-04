import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import App from "./App";
import { Web3Provider } from "./contexts/Web3Context"; // Ensure correct path

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Web3Provider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Web3Provider>
);
