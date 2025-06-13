import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from "react";

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
export default function Index() {
    const [loading, setLoading] = useState(false);

    const generateReport = (type: string) => {
        setLoading(true);
        router.get(`/reports/${type}`, {
            onSuccess: () => {
                router.reload();
                setLoading(false);
            },
            onError: () => {
                console.error('Failed to update bill status.');
                setLoading(false);
            },
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex flex-col gap-6 rounded-xl bg-white p-6 text-black">
                <table className="w-full border-collapse rounded-lg bg-white text-black shadow-sm">
                    <thead>
                        <tr className="border-b bg-gray-100 text-gray-800">
                            {['Report Name', 'Actions'].map((header) => (
                                <th key={header} className="border p-3 text-left">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr key="1" className="border-b">
                            <td className="p-3">Consolidated Member Report</td>
                            <td className="flex gap-2 p-3">
                                <button onClick={() => generateReport('member')} className={`rounded px-3 py-1 text-sm text-white ${loading ? "bg-gray-500" : "bg-blue-500"}`}>
                                    {loading ? "Loading..." : "Generate"}
                                </button>
                            </td>
                        </tr>
                        <tr key="2" className="border-b">
                            <td className="p-3">Consolidated Billing Report</td>
                            <td className="flex gap-2 p-3">
                                <button onClick={() => generateReport('billing')} className={`rounded px-3 py-1 text-sm text-white ${loading ? "bg-gray-500" : "bg-blue-500"}`}>
                                    {loading ? "Loading..." : "Generate"}
                                </button>
                            </td>
                        </tr>
                        <tr key="3" className="border-b">
                            <td className="p-3">Consolidate Withdrawals Report</td>
                            <td className="flex gap-2 p-3">
                                <button onClick={() => generateReport('withdrawal')} className={`rounded px-3 py-1 text-sm text-white ${loading ? "bg-gray-500" : "bg-blue-500"}`}>
                                    {loading ? "Loading..." : "Generate"}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
