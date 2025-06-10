// hooks/useLedgerContract.ts
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import LedgerABI from "@/abis/LedgerABI.json";
import LedgerAddress from "@/abis/LedgerAddress.json";
import { useWallet } from "./useWallet";

export function useLedgerContract() {
    const { signer } = useWallet(); // use signer from useWallet
    const [contract, setContract] = useState<ethers.Contract | null>(null);

    useEffect(() => {
        if (!signer) return;

        const contractInstance = new ethers.Contract(
            LedgerAddress.address,
            LedgerABI,
            signer
        );

        setContract(contractInstance);
    }, [signer]); // re-run if signer changes

    return contract;
}
