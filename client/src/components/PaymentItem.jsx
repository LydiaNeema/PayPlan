"use client";

import { useState } from "react";
import { Check, Clock, AlertCircle } from "lucide-react";

export default function PaymentItem({ payment, onMarkAsPaid }) {
  const [amountToPay, setAmountToPay] = useState("");
  const [loading, setLoading] = useState(false);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  const getStatusColor = () => {
    const dueDate = new Date(payment.dueDate);
    const now = new Date();
    const diffDays = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return "text-red-500";
    if (diffDays <= 3) return "text-yellow-400";
    return "text-gray-400";
  };

  const getStatusIcon = () => {
    const dueDate = new Date(payment.dueDate);
    const now = new Date();
    const diffDays = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays < 0 ? AlertCircle : Clock;
  };

  const StatusIcon = getStatusIcon();
  const statusColor = getStatusColor();

  // Safe values for service/manual
  const serviceName =
    payment.service?.name || payment.manualName || "Unknown Service";
  const serviceCategory =
    payment.service?.category || payment.category || "General";
  const serviceColor = payment.service?.color || payment.color || "#4ade80";

  const handlePartialPay = async () => {
    if (!amountToPay || isNaN(amountToPay) || amountToPay <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setLoading(true);
    try {
      await onMarkAsPaid(payment.id, parseFloat(amountToPay));
      setAmountToPay("");
    } catch (err) {
      console.error("Error making payment:", err);
      alert("Failed to process payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-800 rounded-xl overflow-hidden shadow-md m-3">
      <div className="w-1" style={{ backgroundColor: serviceColor }} />
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-3">
            <p className="text-gray-100 font-semibold text-lg">{serviceName}</p>
            <p className="text-gray-400 text-sm">{serviceCategory}</p>
          </div>
          <p className="text-gray-100 font-bold text-lg">
            {formatAmount(payment.amount)}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${statusColor}`} />
            <span className={`text-sm font-medium ${statusColor}`}>
              {formatDate(payment.dueDate)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Input for partial payment */}
            <input
              type="number"
              min="1"
              value={amountToPay}
              onChange={(e) => setAmountToPay(e.target.value)}
              placeholder="Enter amount"
              className="w-28 bg-gray-700 text-white text-sm px-2 py-1 rounded-md outline-none border border-gray-600 focus:border-green-500"
            />

            <button
              onClick={handlePartialPay}
              disabled={loading}
              className="flex items-center gap-1 bg-green-500/20 text-green-500 px-3 py-1.5 rounded-full font-semibold hover:bg-green-500/30 transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span className="text-sm">
                {loading ? "Saving..." : "Pay"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
