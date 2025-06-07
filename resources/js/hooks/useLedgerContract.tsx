// hooks/useLedgerContract.ts
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import LedgerABI from "@/abis/LedgerABI.json";
import LedgerAddress from "@/abis/LedgerAddress.json";

export function useLedgerContract() {
    const [contract, setContract] = useState<ethers.Contract | null>(null);

    useEffect(() => {
        const init = async () => {
            if (!window.ethereum) return;

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(
                LedgerAddress.address,
                LedgerABI,
                signer
            );

            setContract(contract);
        };

        init();
    }, []);

    return contract;
}
