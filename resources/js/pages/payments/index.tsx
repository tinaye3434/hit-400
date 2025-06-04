import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Bill } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from "react";
import PaymentFormModal from '@/components/modals/payment-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Payments',
        href: '/payments',
    },
];
export default function Index({ bills } : { bills: Bill }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    const openModal = (bill = null) => {
        setSelectedBill(bill);
        setIsModalOpen(true);
    };

    const handleStatusChange = (id: number) => {
        router.post(`/bill-status/${id}`, {
            onSuccess: () => {
                router.reload();
            },
            onError: () => {
                console.error("Failed to update bill status.");
            },
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />
            <div className="flex flex-col gap-6 p-6 bg-white text-black rounded-xl">

                <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg">
                    <thead>
                    <tr className="bg-gray-100 text-gray-800 border-b">
                        {["Full Name", "Period", "Amount", "Status", "Actions"].map((header) => (
                            <th key={header} className="border p-3 text-left">{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {bills.length ? (
                        bills.map((bill) => (
                            <tr key={bill.id} className="border-b">
                                <td className="p-3">
                                    {bill.member?.full_name}
                                </td>
                                <td className="p-3">{bill.financial_period?.name}</td>
                                <td className="p-3">{bill.amount}</td>
                                <td className="p-3">{bill.status}</td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => openModal(bill)} className="bg-blue-500 text-sm text-white px-3 py-1 rounded">Pay</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={4} className="text-center p-4 text-gray-600">No data available.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
            <PaymentFormModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} bill={selectedBill} />
        </AppLayout>
    );

}
