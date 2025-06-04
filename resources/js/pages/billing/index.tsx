import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Billing, FinancialPeriod } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from "react";
import BillingFormModal from '@/components/modals/billing-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Members',
        href: '/billing',
    },
];
export default function Index({ billings, financial_periods } : { billings: Billing, financial_periods: FinancialPeriod }) {
    // const { members } = usePage<{ members: { id: number; wallet_address: string; full_name: string;  email: string, phone:string, joining_date:string, gender:string }[] }>().props;

  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleStatusChange = (id: number) => {
    router.post(`/member-status/${id}`, {
      onSuccess: () => {
        router.reload();
      },
      onError: () => {
        console.error("Failed to update member status.");
      },
    });
  };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex flex-col gap-6 p-6 bg-white text-black rounded-xl">
        <div className="flex justify-end">
          <button onClick={() => openModal()} className="bg-green-600 text-white rounded px-3 py-1 text-sm hover:bg-green-700 transition">
            Bill
          </button>
        </div>

        <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-800 border-b">
              {["Financial Period", "Billed Amount", "Paid Amount", "Status", "Actions"].map((header) => (
                <th key={header} className="border p-3 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {billings.length ? (
              billings.map((billing) => (
                <tr key={billing.id} className="border-b">
                  <td className="p-3">
                    {billing.financial_period?.name}
                  </td>
                  <td className="p-3">{billing.billed_amount}</td>
                  <td className="p-3">{billing.paid_amount}</td>
                  <td className="p-3">{billing.status}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => openModal(billing)} className="bg-red-500 text-sm text-white px-3 py-1 rounded">Reverse</button>
                    <button onClick={() => handleStatusChange(billing.id)} className="bg-green-500 text-sm text-white px-3 py-1 rounded">View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center p-4 text-gray-600">No data available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <BillingFormModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} financialPeriods={financial_periods} />

      </AppLayout>
    );

}
