"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle, Search, Bell } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getDashboardData } from "../../utils/api";

export default function HistoryPage() {
  const { user } = useAuth();

  const [paidPayments, setPaidPayments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getDashboardData();
      setPaidPayments(data.paidPayments || []);
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
        return paidPayments.filter(
          (p) => new Date(p.paidDate || p.dueDate) >= filterDate(30)
        );
      case "last-90":
        return paidPayments.filter(
          (p) => new Date(p.paidDate || p.dueDate) >= filterDate(90)
        );
      case "this-year":
        return paidPayments.filter(
          (p) =>
            new Date(p.paidDate || p.dueDate) >= new Date(now.getFullYear(), 0, 1)
        );
      default:
        return paidPayments;
    }
  };

  const filteredPayments = getFilteredPayments();
  const totalPaid = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const filterOptions = [
    { key: "all", label: "All Time", count: paidPayments.length },
    {
      key: "last-30",
      label: "Last 30 Days",
      count: paidPayments.filter(
        (p) =>
          new Date(p.paidDate || p.dueDate) >=
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
    },
    {
      key: "last-90",
      label: "Last 90 Days",
      count: paidPayments.filter(
        (p) =>
          new Date(p.paidDate || p.dueDate) >=
          new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      ).length,
    },
    {
      key: "this-year",
      label: "This Year",
      count: paidPayments.filter(
        (p) => new Date(p.paidDate || p.dueDate) >= new Date(new Date().getFullYear(), 0, 1)
      ).length,
    },
  ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  const displayName =
    user?.username ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "User");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1E3A8A] to-[#0A1A33] text-white">
        Loading payment history...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#0A1A33] text-white">
      <Navbar />

      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 backdrop-blur-md">
          <h1 className="text-xl font-bold tracking-wide">Payment History</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search payments"
                className="bg-white/5 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/20"
              />
            </div>
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <Bell size={20} className="text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-[#0A1A33] flex items-center justify-center font-bold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-white text-sm">
                {displayName}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="overflow-x-auto px-6 py-4 border-b border-white/10">
          <div className="flex gap-3">
            {filterOptions.map((option) => {
              const isActive = filter === option.key;
              return (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? "bg-[#3B82F6] text-white shadow-lg"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {option.label}
                  {option.count > 0 && (
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {option.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment List */}
        <div className="px-6 pb-10">
          {filteredPayments.length === 0 ? (
            <div className="text-center mt-20 space-y-4">
              <Clock
                size={56}
                className="mx-auto text-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              />
              <h2 className="text-2xl font-bold">No Payment History</h2>
              <p className="text-white/60">
                {filter === "all"
                  ? "You haven't completed any payments yet."
                  : "No payments found for the selected period."}
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-6 max-w-3xl mx-auto">
              {filteredPayments
                .sort(
                  (a, b) =>
                    new Date(b.paidDate || b.dueDate) -
                    new Date(a.paidDate || a.dueDate)
                )
                .map((payment) => (
                  <div
                    key={payment.id}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] p-4 hover:bg-white/10 transition-colors flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {payment.serviceName}
                      </p>
                      <p className="text-sm text-gray-400">
                        Paid on{" "}
                        {new Date(
                          payment.paidDate || payment.dueDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-green-400">
                        {formatCurrency(payment.amount)}
                      </p>
                      <CheckCircle size={20} className="text-green-500" />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}