import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Member } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import MemberFormModal from '@/components/modals/member-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Members',
        href: '/members',
    },
];
export default function Index({ members } : { members: Member }) {
    // const { members } = usePage<{ members: { id: number; wallet_address: string; full_name: string;  email: string, phone:string, joining_date:string, gender:string }[] }>().props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const openModal = (member = null) => {
    setSelectedMember(member);
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
            Add Member
          </button>
        </div>

        <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-800 border-b">
              {["Full Name", "Email", "Status", "Actions"].map((header) => (
                <th key={header} className="border p-3 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.length ? (
              members.map((member) => (
                <tr key={member.id} className="border-b">
                  <td className="p-3">
                    {member.full_name}
                  </td>
                  <td className="p-3">{member.email}</td>
                  <td className="p-3">{member.membership_status}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => openModal(member)} className="bg-blue-500 text-sm text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => handleStatusChange(member.id)} className={`text-sm text-white px-3 py-1 rounded ${member.membership_status === "active" ? "bg-red-500" : "bg-green-500"}`}>{member.membership_status == "active" ? "Deactivate" : "Activate"}</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center p-4 text-gray-600">No data available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
            <MemberFormModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} member={selectedMember} />
        </AppLayout>
    );

}
