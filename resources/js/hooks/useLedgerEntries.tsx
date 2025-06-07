// hooks/useLedgerEntries.ts
import { useEffect, useState } from "react";
import { useLedgerContract } from "./useLedgerContract";

export function useLedgerEntries() {
    const contract = useLedgerContract();
    const [entries, setEntries] = useState<any[]>([]);

    useEffect(() => {
        const loadEntries = async () => {
            if (!contract) return;

            const count = await contract.getEntryCount();
            const items = [];

            for (let i = 0; i < count; i++) {
                const entry = await contract.getEntry(i);
                items.push(entry);
            }

            setEntries(items);
        };

        loadEntries();
    }, [contract]);

    return entries;
}
