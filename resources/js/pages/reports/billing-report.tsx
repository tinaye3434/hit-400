import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Reports',
        href: '/dashboard',
    },
];
export default function Index({ results, date }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex flex-col gap-6 rounded-xl bg-white p-6 text-black">
                <div className="mx-auto justify-center text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">Housing Cooperative</h1>
                    <p className="text-gray-600 mb-3">{date}</p>
                    <h2 className="mb-6 text-2xl font-semibold text-gray-700">Consolidated Members Report</h2>
                </div>

                <table className="w-full border-collapse rounded-lg bg-white text-black shadow-sm">
                    <thead>
                        <tr className="border-b bg-gray-100 text-gray-800">
                            {['Financial Period', 'Billed Amount', 'Paid Amount'].map((header) => (
                                <th key={header} className="border p-3 text-left">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {results.length ? (
                            results.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-3">{item.financial_period.name}</td>
                                    <td className="p-3">{item.billed_amount}</td>
                                    <td className="p-3">{item.paid_amount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-600">
                                    No data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
