import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Withdrawal } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from "react";
import WithdrawalFormModal from '@/components/modals/withdrawal-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Withdrawal',
        href: '/withdrawals',
    },
];
export default function Index({ withdrawals } : { withdrawals: Withdrawal }) {
  
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
            Withdraw
          </button>
        </div>

        <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-800 border-b">
              {["Amount", "Comment", "Status"].map((header) => (
                <th key={header} className="border p-3 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {withdrawals.length ? (
              withdrawals.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.amount}</td>
                  <td className="p-3">{item.comment}</td>
                  <td className="p-3">{item.status}</td>
                  {/* <td className="p-3 flex gap-2"> */}
                    {/* <button onClick={() => openModal(item)} className="bg-red-500 text-sm text-white px-3 py-1 rounded">Reverse</button> */}
                    {/* <button onClick={() => handleStatusChange(item.id)} className="bg-green-500 text-sm text-white px-3 py-1 rounded">View</button> */}
                  {/* </td> */}
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center p-4 text-gray-600">No data available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <WithdrawalFormModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />

      </AppLayout>
    );

}
