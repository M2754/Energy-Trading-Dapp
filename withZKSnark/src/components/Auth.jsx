import React, { useState, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

const Auth = () => {
  const { connectWallet, account, disconnectWallet } = useContext(Web3Context);
  // const [role, setRole] = useState('');

  // const handleRoleSelect = (selectedRole) => {
  //   setRole(selectedRole);
  // };
  return (
    <div>
        {!account ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <>
          <p>Connected with {account}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
          {/* {role ? (
            <p>Role: {role}</p>
        ) : (
            <>
            <p>Select a Role:</p>
            <button onClick={() => handleRoleSelect('producer')}>Producer</button>
            <button onClick={() => handleRoleSelect('consumer')}>Consumer</button>
            </>
        )} */}
        </>
      )}
    </div>
  );
};

export default Auth;