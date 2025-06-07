// hooks/useLedgerActions.ts
import { useLedgerContract } from "./useLedgerContract";
import { ethers } from "ethers";

export function useLedgerActions() {
    const contract = useLedgerContract();

    const contribute = async (memberId: string, description: string, amountEth: string) => {
        if (!contract) throw new Error("Contract not loaded");

        const tx = await contract.contribute(memberId, description, {
            value: ethers.parseEther(amountEth),
        });

        await tx.wait();
        return tx.hash;
    };

    const withdraw = async (
        memberId: string,
        amountEth: string,
        description: string,
        recipient: string
    ) => {
        if (!contract) throw new Error("Contract not loaded");

        const tx = await contract.withdraw(
            memberId,
            ethers.parseEther(amountEth),
            description,
            recipient
        );

        await tx.wait();
        return tx.hash;
    };

    return { contribute, withdraw };
}
