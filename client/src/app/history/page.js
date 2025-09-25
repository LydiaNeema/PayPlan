"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import { getPaymentHistory } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function HistoryPage() {
  const { token } = useAuth();
  const [paidPayments, setPaidPayments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getPaymentHistory(token);
      setPaidPayments(data || []);
    } catch (error) {
      console.error("Error loading payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getFilteredPayments = () => {
    const now = new Date();
    const filterDate = (days) => {
      const d = new Date();
      d.setDate(now.getDate() - days);
      return d;
    };
    switch (filter) {
      case "last-30":
        return paidPayments.filter((p) => new Date(p.dueDate) >= filterDate(30));
      case "last-90":
        return paidPayments.filter((p) => new Date(p.dueDate) >= filterDate(90));
      case "this-year":
        return paidPayments.filter((p) => new Date(p.dueDate) >= new Date(now.getFullYear(), 0, 1));
      default:
        return paidPayments;
    }
  };

  const filteredPayments = getFilteredPayments();
  const totalPaid = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const filterOptions = [
    { key: "all", label: "All Time", count: paidPayments.length },
    { key: "last-30", label: "Last 30 Days", count: getFilteredPayments().length },
    { key: "last-90", label: "Last 90 Days", count: getFilteredPayments().length },
    { key: "this-year", label: "This Year", count: getFilteredPayments().length },
  ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white font-semibold bg-gradient-to-br from-gray-900 via-black to-gray-900">
        Loading payment history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Navbar />

      {/* Header */}
      <div className="px-6 py-10 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Payment History
        </h1>
        <p className="text-gray-400 mt-2">
          {filteredPayments.length} completed payment
          {filteredPayments.length !== 1 ? "s" : ""}
        </p>
        {totalPaid > 0 && (
          <p className="text-green-400 font-bold mt-2">
            Total Paid: {formatCurrency(totalPaid)}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center px-6 pb-6">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => setFilter(option.key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-300 backdrop-blur-md ${
              filter === option.key
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105"
                : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/15 hover:text-white"
            }`}
          >
            {option.label}
            {option.count > 0 && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  filter === option.key
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Payment List */}
      <div className="px-6 mt-6 space-y-4 max-w-3xl mx-auto">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-16 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-lg">
            <Clock size={48} className="text-gray-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white mt-4">No Payment History</h2>
            <p className="text-gray-400 mt-2">
              {filter === "all"
                ? "You haven't completed any payments yet. Start by marking some as paid!"
                : "No payments found for the selected period."}
            </p>
          </div>
        ) : (
          filteredPayments
            .sort(
              (a, b) =>
                new Date(b.dueDate).getTime() -
                new Date(a.dueDate).getTime()
            )
            .map((payment) => (
              <div
                key={payment.id}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center shadow-md hover:shadow-xl hover:bg-white/10 transition-all duration-300"
              >
                <div>
                  <p className="font-semibold text-white">{payment.serviceName}</p>
                  <p className="text-sm text-gray-400">
                    Paid on {new Date(payment.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-green-400">
                    {formatCurrency(payment.amount)}
                  </p>
                  <CheckCircle size={20} className="text-green-500" />
                </div>
              </div>
            ))
        )}
      </div>

      <div className="h-10" />
    </div>
  );
}
