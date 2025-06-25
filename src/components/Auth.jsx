import React, { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import './Auth.css';

const Auth = () => {
  const { connectWallet, account, disconnectWallet } = useContext(Web3Context);

  return (
    <div className="portal-container auth-container">
      <h2 className="auth-title">Welcome to Dihing Energy Trading App</h2>
      {!account ? (
        <button className="auth-connect-btn" onClick={connectWallet}>
          Connect MetaMask
        </button>
      ) : (
        <div className="auth-dashboard">
          <p className="auth-connected-info">
            Connected with <strong>{account}</strong>
          </p>
          <button className="auth-disconnect-btn" onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;