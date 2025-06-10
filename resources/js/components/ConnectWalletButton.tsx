import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';

export default function ConnectWalletButton() {
    const { 
        connectWallet, 
        disconnectWallet, 
        connected, 
        address 
    } = useWallet();
    
    const [isConnecting, setIsConnecting] = useState(false);

    const shortenAddress = (addr: string) => 
        `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            await connectWallet();
        } catch (error) {
            console.error('Connection error:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = () => {
        try {
            disconnectWallet();
        } catch (error) {
            console.error('Disconnection error:', error);
        }
    };

    return (
        <div className="wallet-connect-container">
            {connected ? (
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-800">
                        {shortenAddress(address)}
                    </span>
                    <button
                        onClick={handleDisconnect}
                        className="px-3 py-1.5 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="px-4 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
            )}
        </div>
    );
}