import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { CooperativeLedger } from '@/types/ledger'; // Your contract type
import { getContractInstance } from '@/utils/contract';
import  LedgerAddress  from '@/abis/LedgerAddress.json';

interface LedgerEntry {
  memberId: string;
  amount: string; // Human-readable amount (e.g., "1.5 ETH")
  txType: 'Contribution' | 'Withdrawal';
  timestamp: Date;
  description: string;
  transactionHash?: string;
  blockNumber?: number;
}

interface UseLedgerEntriesProps {
  pageSize?: number;
  watchEvents?: boolean;
}

interface UseLedgerEntriesReturn {
  entries: LedgerEntry[];
  loading: boolean;
  error: string | null;
  fetchEntries: (page?: number) => Promise<void>;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export function useLedgerEntries({
  pageSize = 10,
  watchEvents = true,
}: UseLedgerEntriesProps = {}): UseLedgerEntriesReturn {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [contract, setContract] = useState<CooperativeLedger | null>(null);

  // Initialize contract instance
  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contractInstance = getContractInstance(provider, LedgerAddress.address);
        setContract(contractInstance);
      }
    };

    init();
  }, []);

  // Format contract entry to our LedgerEntry type
  const formatEntry = useCallback((entry: any, event?: ethers.EventLog): LedgerEntry => {
    return {
      memberId: ethers.decodeBytes32String(entry.memberId),
      amount: entry.amount.toString(),
      txType: entry.txType == 0 ? 'Contribution' : 'Withdrawal',
      timestamp: new Date(Number(entry.timestamp) * 1000),
      description: ethers.decodeBytes32String(entry.description),
      transactionHash: event?.transactionHash,
      blockNumber: event?.blockNumber,
    };
  }, []);

  // Fetch entries from contract
  const fetchEntries = useCallback(async (page: number = 1) => {
    if (!contract) {
      setError('Contract not initialized');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentPage(page);

    try {
      // Get total entry count
      const entryCount = await contract.getEntryCount();
      setTotalEntries(Number(entryCount));

      // Calculate pagination
      const totalPages = Math.ceil(Number(entryCount) / pageSize);
      const start = Math.max(0, Number(entryCount) - page * pageSize);
      const count = Math.min(pageSize, Number(entryCount) - (page - 1) * pageSize);

      if (count <= 0) {
        setEntries([]);
        return;
      }

      // Fetch entries
      const contractEntries = await contract.getEntries(start, count);
      
      // Format entries (oldest first for proper display)
      const formattedEntries = contractEntries
        .map((entry: any) => formatEntry(entry))
        .reverse();

      setEntries(formattedEntries);
    } catch (err) {
      console.error('Failed to fetch ledger entries:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [contract, pageSize, formatEntry]);

  // Set up event listeners for real-time updates
  useEffect(() => {
    if (!contract || !watchEvents) return;

    const handleNewEntry = (
      memberId: string,
      amount: bigint,
      txType: number,
      timestamp: bigint,
      description: string,
      event: ethers.EventLog
    ) => {
      const newEntry = formatEntry(
        { memberId, amount, txType, timestamp, description },
        event
      );
      
      setEntries(prev => [newEntry, ...prev.slice(0, pageSize - 1)]);
      setTotalEntries(prev => prev + 1);
    };

    contract.on('EntryRecorded', handleNewEntry);

    return () => {
      contract.off('EntryRecorded', handleNewEntry);
    };
  }, [contract, watchEvents, pageSize, formatEntry]);

  return {
    entries,
    loading,
    error,
    fetchEntries,
    currentPage,
    totalPages: Math.ceil(totalEntries / pageSize),
    hasMore: currentPage < Math.ceil(totalEntries / pageSize),
  };
}