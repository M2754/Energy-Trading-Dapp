import React, { useContext, useState, useEffect } from 'react';
import Auth from './components/Auth';
import ConsumerPortal from './components/ConsumerPortal';
import ProducerPortal from './components/ProducerPortal';
import { Web3Provider, Web3Context } from './contexts/Web3Context';

const App = () => {
    const { account, contract, signer } = useContext(Web3Context);
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = () => {
            if (account) {
                const storedRole = localStorage.getItem(`role_${account}`);
                setRole(storedRole || '');
            }
            setLoading(false);
        };
        fetchRole();
    }, [account]);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        if (account) {
            localStorage.setItem(`role_${account}`, selectedRole);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Web3Provider>
            <div>
                <Auth />
                {!account ? null :
                    !role ? (
                        <>
                            <p>Select a Role:</p>
                            <button onClick={() => handleRoleSelect('producer')}>Producer</button>
                            <button onClick={() => handleRoleSelect('consumer')}>Consumer</button>
                        </>
                    ) : role === 'producer' ? (
                        <ProducerPortal contract={contract} signer={signer} />
                    ) : (
                        <ConsumerPortal contract={contract} signer={signer} />
                    )
                }
            </div>
        </Web3Provider>
    );
};

export default App;
