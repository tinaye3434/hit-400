import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { type Member } from '@/types';

interface Props {
    isOpen: boolean;
    closeModal: () => void;
    member?: Member | null;
}

export default function MemberFormModal({ isOpen, closeModal, member }: Props) {
    const [formData, setFormData] = useState<Member>({ wallet_address: "", full_name: "", email: "", phone: "", joining_date: "", gender: "" });

    useEffect(() => {
        if (member) {
            setFormData({ wallet_address: member.wallet_address, full_name: member.full_name, email: member.email, phone: member.phone, joining_date: member.joining_date, gender: member.gender || "" });
        } else {
            setFormData({ wallet_address: "", full_name: "", email: "", phone: "", joining_date: "", gender: "" });
        }
    }, [member]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("wallet_address", formData.wallet_address);
        data.append("full_name", formData.full_name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("joining_date", formData.joining_date);
        data.append("gender", formData.gender);


        if (member?.id) {
            data.append("_method", "PUT");
            router.post(`/members/${member.id}`, data, {
                onSuccess: () => {

                    closeModal();
                    router.reload();
                },
                onError: (errors) => {

                    console.error(errors.message || "Failed to submit post.");
                },
            });
        } else {
            router.post("/members", data, {
                onSuccess: () => {

                    closeModal();
                    router.reload();
                },
                onError: (errors) => {

                    console.error(errors.message || "Failed to submit post.");
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
                <h2 className="text-lg font-semibold mb-4">{member ? "Edit Member" : "Add Member"}</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Wallet Address</label>
                        <input
                            type="text"
                            name="wallet_address"
                            value={formData.wallet_address}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Wallet Address</label>
                        <input
                            type="text"
                            name="wallet_address"
                            value={formData.wallet_address}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Joining Date</label>
                        <input
                            type="date"
                            name="phone"
                            value={formData.joining_date}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium">Gender</label>
                        <input
                            type="date"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>


                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{member ? "Update" : "Create"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
