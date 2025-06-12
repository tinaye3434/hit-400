import { useLedgerEntries } from '@/hooks/useLedgerEntries';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

interface BlockchainLedgerProps {
    contractAddress: string;
    abi: ethers.InterfaceAbi;
    pageSize?: number;
    showMember?: boolean;
    showDescription?: boolean;
}

export default function BlockchainLedger({ contractAddress, abi, pageSize = 10, showMember = true, showDescription = true }: BlockchainLedgerProps) {
    const { entries, loading, error, fetchEntries, currentPage, totalPages, hasMore } = useLedgerEntries({ pageSize });
    console.log(entries)
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize and load first page
    useEffect(() => {
        const init = async () => {
            try {
                await fetchEntries(1);
                setIsInitialized(true);
            } catch (err) {
                console.error('Initialization failed:', err);
            }
        };

        init();
    }, [fetchEntries]);

    const handlePrevious = () => {
        if (currentPage > 1) {
            fetchEntries(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (hasMore) {
            fetchEntries(currentPage + 1);
        }
    };

    if (!isInitialized && loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">
                <p className="font-medium">Error loading ledger:</p>
                <p>{error}</p>
                <button onClick={() => fetchEntries(1)} className="mt-2 rounded bg-red-100 px-4 py-2 hover:bg-red-200">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {showMember && <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Member</th>}
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Date</th>
                            {showDescription && (
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Description</th>
                            )}
                            {/* <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Transaction</th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {entries.map((entry, index) => (
                            <tr key={`${entry.transactionHash}-${index}`} className="hover:bg-gray-50">
                                {showMember && <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{entry.memberId}</td>}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                            entry.txType === 'Contribution' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {entry.txType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">${entry.amount}</td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                    {entry.timestamp.toLocaleDateString()}
                                    <br />
                                    <span className="text-xs text-gray-400">{entry.timestamp.toLocaleTimeString()}</span>
                                </td>
                                {showDescription && <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">{entry.description}</td>}
                                {/* <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                    {entry.transactionHash ? (
                                        <a
                                            href={`https://etherscan.io/tx/${entry.transactionHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            View
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {entries.length === 0 && !loading && <div className="py-8 text-center text-gray-500">No ledger entries found</div>}

            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-gray-500">
                    Showing page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage <= 1 || loading}
                        className={`rounded-md border px-4 py-2 ${
                            currentPage <= 1 || loading ? 'cursor-not-allowed bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!hasMore || loading}
                        className={`rounded-md border px-4 py-2 ${!hasMore || loading ? 'cursor-not-allowed bg-gray-100' : 'hover:bg-gray-50'}`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {loading && entries.length > 0 && (
                <div className="flex justify-center py-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
        </div>
    );
}
