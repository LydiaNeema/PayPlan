"use client";
import { CheckCircle } from "lucide-react";

export default function HistoryItem({ payment }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold text-white">
          {payment.serviceName || payment.manualName}
        </p>
        <p className="text-sm text-gray-400">
          Paid on {new Date(payment.paidDate || payment.dueDate).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="font-bold text-green-400">{formatCurrency(payment.amount)}</p>
        <CheckCircle size={20} className="text-green-500" />
      </div>
    </div>
  );
}
