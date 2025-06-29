import { useLedgerContract } from '@/hooks/useLedgerContract';
import { router } from '@inertiajs/react';
import { ethers } from 'ethers';
import { useState } from 'react';

interface Props {
    isOpen: boolean;
    closeModal: () => void;
}

export default function WithdrawalFormModal({ isOpen, closeModal }: Props) {
    const [formData, setFormData] = useState({
        amount: '',
        comment: '',
    });

    const ledger = useLedgerContract();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('amount', formData.amount);
        data.append('comment', formData.comment);

        // Then optionally record on blockchain if ledger is available
        if (ledger) {
            try {
                const encodedMemberId = ethers.encodeBytes32String('admin');
                const description = formData.comment;

                const amountUint128 = BigInt(Math.floor(formData.amount));
                console.log('Submitting:', {
                    memberId: encodedMemberId,
                    amount: amountUint128.toString(),
                    description: description,
                });
                const tx = await ledger.recordWithdrawal(encodedMemberId, amountUint128, description);

                await tx.wait();
                
                const response = await router.post('/withdrawals/', data);

                console.log('✅ Withdrawal recorded on blockchain');
            } catch (blockchainError) {
                console.error('Blockchain recording failed:', blockchainError);
                // Continue even if blockchain recording fails
            }
        }

        // router.post("/withdrawals/", data, {
        //     onSuccess: () => {
        //         setFormData({
        //             amount: '',
        //             comment: '',
        //         });

        //         closeModal();
        //         router.reload();
        //     },
        //     onError: (errors) => {
        //         console.error(errors.message || 'Failed to submit billing.');
        //     },
        // });
    };

    if (!isOpen) return null;

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">Withdrawal</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Comment</label>
                        <input
                            type="text"
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={closeModal} className="rounded bg-gray-500 px-4 py-2 text-white">
                            Cancel
                        </button>
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
