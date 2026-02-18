"use client";

import { useState } from "react";

export default function PaymentItem({ payment, onMarkAsPaid }) {
  const [showPartial, setShowPartial] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");

  const handlePartialPayment = () => {
    const amount = parseFloat(partialAmount);
    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }
    onMarkAsPaid(payment.id, amount);
    setShowPartial(false);
    setPartialAmount("");
  };

  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{payment.serviceName}</h3>
          <p className="text-sm text-gray-400">
            Due: {new Date(payment.dueDate).toLocaleDateString()}
          </p>
          <p className="text-sm">
            Amount: <span className="font-bold">${payment.amount}</span>
          </p>
          <p className="text-sm text-gray-400">Status: {payment.status}</p>
        </div>

        <div className="flex flex-col gap-2">
          {/* Full Payment Button */}
          <button
            onClick={() => onMarkAsPaid(payment.id)}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Mark Paid
          </button>

          {/* Partial Payment Toggle */}
          {showPartial ? (
            <div className="flex flex-col gap-2">
              <input
                type="number"
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
                placeholder="Enter amount"
                className="px-2 py-1 rounded text-black"
              />
              <button
                onClick={handlePartialPayment}
                className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowPartial(false)}
                className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPartial(true)}
              className="px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Partial Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}