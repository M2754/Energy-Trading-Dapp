import React, { useContext, useState, useEffect } from 'react';
import Auth from './components/Auth';
import ConsumerPortal from './components/ConsumerPortal';
import ProducerPortal from './components/ProducerPortal';
import { Web3Provider, Web3Context } from './contexts/Web3Context';
import styles from './App.module.css';

const App = () => {
    const { account } = useContext(Web3Context);
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
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <Web3Provider>
            <div className={styles.appContainer}>
                <Auth />
                {!account ? null : !role ? (
                    <div className={styles.card}>
                        <p className={styles.title}>Select a Role:</p>
                        <div className={styles.roleButtons}>
                            <button className={`${styles.button} ${styles.producer}`} onClick={() => handleRoleSelect('producer')}>
                                Producer
                            </button>
                            <button className={`${styles.button} ${styles.consumer}`} onClick={() => handleRoleSelect('consumer')}>
                                Consumer
                            </button>
                        </div>
                    </div>
                ) : role === 'producer' ? (
                    <ProducerPortal />
                ) : (
                    <ConsumerPortal />
                )}
            </div>
        </Web3Provider>
    );
};

export default App;
