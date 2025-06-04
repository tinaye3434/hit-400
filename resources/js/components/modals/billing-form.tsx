import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { type Member, FinancialPeriod } from '@/types';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  financialPeriods: FinancialPeriod[];
}


export default function BillingFormModal({ isOpen, closeModal, financialPeriods }: Props) {
  const [formData, setFormData] = useState({
    financial_period_id: "",
    amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("financial_period_id", formData.financial_period_id);
    data.append("amount", formData.amount);

    router.post("/billing", data, {
      onSuccess: () => {
        setFormData({
        financial_period_id: "",
        amount: "",
      });
      
        closeModal();
        router.reload();
      },
      onError: (errors) => {
        console.error(errors.message || "Failed to submit billing.");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-4">Generate Billing</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Financial Period</label>
            <select
              name="financial_period_id"
              value={formData.financial_period_id}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="">-- Choose Financial Period --</option>
              {financialPeriods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name} 
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
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
