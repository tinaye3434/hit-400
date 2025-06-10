// hooks/useWallet.ts
import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";

export function useWallet() {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [address, setAddress] = useState<string>("");
    const [connected, setConnected] = useState<boolean>(false);

    const connectWallet = useCallback(async () => {
        if (typeof window.ethereum !== "undefined") {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            await browserProvider.send("eth_requestAccounts", []);
            const signer = await browserProvider.getSigner();
            const addr = await signer.getAddress();

            setProvider(browserProvider);
            setSigner(signer);
            setAddress(addr);
            setConnected(true);
        } else {
            alert("MetaMask not detected");
        }
    }, []);

    // Optional: try auto-connect on page load if already connected
    useEffect(() => {
        async function checkConnection() {
            if (typeof window.ethereum !== "undefined") {
                const browserProvider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await browserProvider.listAccounts();
                if (accounts.length > 0) {
                    const signer = await browserProvider.getSigner();
                    const addr = await signer.getAddress();
                    setProvider(browserProvider);
                    setSigner(signer);
                    setAddress(addr);
                    setConnected(true);
                }
            }
        }

        checkConnection();
    }, []);

    return { provider, signer, address, connected, connectWallet };
}
