// components/WalletDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { ethers } from 'ethers';

export default function WalletDropdown() {
  const { 
    address, 
    connected, 
    connectWallet, 
    disconnectWallet,
    provider 
  } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const shortenAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleToggle = () => {
    if (!connected) {
      connectWallet().catch(console.error);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsOpen(false);
  };

  const handleChangeWallet = async () => {
    try {
      await window.ethereum.request({ 
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });
      // Wallet changed, refresh connection
      connectWallet().catch(console.error);
    } catch (error) {
      console.error('Error changing wallet:', error);
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          connected 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {connected ? (
          <>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>{shortenAddress(address)}</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Connect Wallet</span>
          </>
        )}
      </button>

      {isOpen && connected && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              {shortenAddress(address)}
            </div>
            <button
              onClick={handleChangeWallet}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Change Wallet
            </button>
            <button
              onClick={handleDisconnect}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}