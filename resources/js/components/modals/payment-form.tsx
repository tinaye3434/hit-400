import { useLedgerContract } from '@/hooks/useLedgerContract';
import { type Bill, PaymentMethod } from '@/types';
import { router } from '@inertiajs/react';
import { ethers } from 'ethers';
import { useState } from 'react';

interface Props {
    isOpen: boolean;
    closeModal: () => void;
    bill: Bill;
    payment_methods: PaymentMethod[];
}

export default function PaymentFormModal({ isOpen, closeModal, bill, payment_methods }: Props) {
    const [formData, setFormData] = useState({
        amount: '',
        payment_method_id: '',
    });

    const ledger = useLedgerContract();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create form data for the payment
        const data = new FormData();
        data.append('amount', formData.amount);
        data.append('payment_method_id', formData.payment_method_id);

        try {
            // First process the off-chain payment
            console.log(bill.id);
            console.log(ledger);

            // Then optionally record on blockchain if ledger is available
            if (ledger) {
                try {
                    const encodedMemberId = ethers.encodeBytes32String(bill.member.blockchain_id);
                    const encodedDescription = ethers.encodeBytes32String(
                        `${bill.financial_period.name}`, // Include payment ID if available
                    );

                    // Convert amount to uint128 (in smallest units, e.g., cents or wei)
                    // Example: For dollars, multiply by 100 to get cents
                    // const amountInCents = Math.round(parseFloat(formData.amount) * 100);
                    // const amountUint128 = BigInt(amountInCents);

                    const amountUint128 = BigInt(Math.floor(formData.amount));
                    console.log('Submitting:', {
                        memberId: encodedMemberId,
                        amount: amountUint128.toString(),
                        description: encodedDescription,
                    });
                    const tx = await ledger.recordContribution(encodedMemberId, amountUint128, encodedDescription);

                    await tx.wait();
                    const response = await router.post(`/payment/${bill.id}`, data);

                    console.log('✅ Payment recorded on blockchain');
                } catch (blockchainError) {
                    console.error('Blockchain recording failed:', blockchainError);
                    // Continue even if blockchain recording fails
                }
            }

            // Reset form and close modal
            setFormData({ amount: '', payment_method_id: '' });
            closeModal();
            router.reload();
        } catch (paymentError) {
            console.error('Payment processing failed:', paymentError);
            // Handle payment error (show to user, etc.)
        }
    };

    if (!isOpen) return null;

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">{'Payment for ' + bill.member?.full_name}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Payment Method</label>
                        <select
                            name="payment_method_id"
                            value={formData.payment_method_id}
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                            required
                        >
                            <option value="">-- Choose Payment Method --</option>
                            {payment_methods.map((method) => (
                                <option key={method.id} value={method.id}>
                                    {method.name}
                                </option>
                            ))}
                        </select>
                    </div>
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
