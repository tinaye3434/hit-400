// Updated WalletContext.tsx
import { ethers } from 'ethers';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface WalletContextType {
    address: string;
    signer: ethers.Signer | null;
    provider: ethers.BrowserProvider | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    connected: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [address, setAddress] = useState('');
    const [connected, setConnected] = useState(false);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask.');
            return;
        }

        try {
            const newProvider = new ethers.BrowserProvider(window.ethereum);
            await newProvider.send('eth_requestAccounts', []);
            const newSigner = await newProvider.getSigner();
            const addr = await newSigner.getAddress();

            setProvider(newProvider);
            setSigner(newSigner);
            setAddress(addr);
            setConnected(true);

            // Add event listeners
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        } catch (error) {
            console.error('Connection error:', error);
            disconnectWallet();
        }
    };

    const disconnectWallet = () => {
        // Clear all wallet-related state
        setSigner(null);
        setProvider(null);
        setAddress('');
        setConnected(false);

        // Remove event listeners
        if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
    };

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
            // MetaMask is locked or user disconnected all accounts
            disconnectWallet();
        } else if (accounts[0] !== address) {
            // Account changed
            connectWallet().catch(console.error);
        }
    };

    const handleChainChanged = () => {
        // Reload the page when network changes
        window.location.reload();
    };

    useEffect(() => {
        // Auto-connect when component mounts
        if (window.ethereum?.isConnected?.()) {
            connectWallet().catch(console.error);
        }

        return () => {
            // Cleanup on unmount
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, []);

    return (
        <WalletContext.Provider
            value={{
                address,
                signer,
                provider,
                connectWallet,
                disconnectWallet,
                connected,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
