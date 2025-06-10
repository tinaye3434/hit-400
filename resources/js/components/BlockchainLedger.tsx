// components/BlockchainLedger.tsx
import { useLedgerContract } from '@/hooks/useLedgerContract';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { LedgerPagination } from './LedgerPagination';

interface LedgerEntry {
    memberId: string;
    amount: string;
    txType: 'Contribution' | 'Withdrawal';
    timestamp: Date;
    description: string;
}

export default function BlockchainLedger() {
    const ledger = useLedgerContract();
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const entriesPerPage = 10;

    const [filter, setFilter] = useState<'all' | 'contributions' | 'withdrawals'>('all');

    const filteredEntries = entries.filter(
        (entry) =>
            filter === 'all' ||
            (filter === 'contributions' && entry.txType === 'Contribution') ||
            (filter === 'withdrawals' && entry.txType === 'Withdrawal'),
    );

    useEffect(() => {
        const fetchLedger = async () => {
            if (!ledger) return;

            const listener = (...args: any[]) => {
                const event = args[args.length - 1];
                const newEntry = {
                    memberId: ethers.decodeBytes32String(event.args.memberId),
                    amount: ethers.formatUnits(event.args.amount, 18),
                    txType: event.args.txType === 0 ? 'Contribution' : 'Withdrawal',
                    timestamp: new Date(Number(event.args.timestamp) * 1000),
                    description: ethers.decodeBytes32String(event.args.description),
                };

                setEntries((prev) => [newEntry, ...prev.slice(0, 19)]);
            };

            const entryCount = await ledger.getEntryCount();
            setTotalEntries(Number(entryCount));

            const start = Math.max(0, Number(entryCount) - currentPage * entriesPerPage);
            const ledgerEntries = await ledger.getEntries(start, entriesPerPage);

            ledger.on(filter, listener);

            return () => {
                ledger.off(filter, listener);
            };
        };

        fetchLedger();
    }, [ledger, currentPage]);

    //  useEffect(() => {
    //   if (!ledger) return;

    //   const filter = ledger.filters.EntryRecorded();

    //   const listener = (...args: any[]) => {
    //     const event = args[args.length - 1];
    //     const newEntry = {
    //       memberId: ethers.decodeBytes32String(event.args.memberId),
    //       amount: ethers.formatUnits(event.args.amount, 18),
    //       txType: event.args.txType === 0 ? 'Contribution' : 'Withdrawal',
    //       timestamp: new Date(Number(event.args.timestamp) * 1000),
    //       description: ethers.decodeBytes32String(event.args.description)
    //     };

    //     setEntries(prev => [newEntry, ...prev.slice(0, 19)]);
    //   };

    //   ledger.on(filter, listener);

    //   return () => {
    //     ledger.off(filter, listener);
    //   };
    // }, [ledger]);

    if (loading) return <div className="p-4 text-center">Loading ledger...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="overflow-x-auto">
            <div className="mb-4 flex space-x-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`rounded px-3 py-1 ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('contributions')}
                    className={`rounded px-3 py-1 ${filter === 'contributions' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                >
                    Contributions
                </button>
                <button
                    onClick={() => setFilter('withdrawals')}
                    className={`rounded px-3 py-1 ${filter === 'withdrawals' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                >
                    Withdrawals
                </button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Member</th>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {entries.map((entry, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{entry.memberId}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                        entry.txType === 'Contribution' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {entry.txType}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{entry.amount}</td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{entry.timestamp.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{entry.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <LedgerPagination currentPage={currentPage} totalPages={Math.ceil(totalEntries / entriesPerPage)} onPageChange={setCurrentPage} />
        </div>
    );
}
