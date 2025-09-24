"use client";

import { useEffect, useState } from "react";
import { Calendar, AlertTriangle } from "lucide-react";
import PaymentItem from "../../components/PaymentItem";
import Navbar from "../../components/Navbar";
//import { getDashboardData, markPaymentPaid } from "../../utils/api";

export default function UpcomingPage() {
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [overduePayments, setOverduePayments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getDashboardData();
      setUpcomingPayments(data.upcomingPayments || []);
      setOverduePayments(data.overduePayments || []);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const markPaymentAsPaid = async (paymentId) => {
    try {
      await markPaymentPaid(paymentId);
      await loadData();
    } catch (error) {
      console.error("Error marking payment as paid:", error);
      alert("Error marking payment as paid.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getFilteredPayments = () => {
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    switch (filter) {
      case "overdue":
        return overduePayments;
      case "due-soon":
        return upcomingPayments.filter(
          (p) => new Date(p.dueDate) <= threeDaysFromNow
        );
      case "upcoming":
        return upcomingPayments.filter(
          (p) => new Date(p.dueDate) > threeDaysFromNow
        );
      default:
        const allPayments = [...overduePayments, ...upcomingPayments];
        const uniquePayments = allPayments.filter(
          (payment, index, array) =>
            array.findIndex((p) => p.id === payment.id) === index
        );
        return uniquePayments.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
    }
  };

  const filteredPayments = getFilteredPayments();

  const allUniquePayments = [...overduePayments, ...upcomingPayments].filter(
    (payment, index, array) =>
      array.findIndex((p) => p.id === payment.id) === index
  );

  const filterOptions = [
    { key: "all", label: "All", count: allUniquePayments.length },
    { key: "overdue", label: "Overdue", count: overduePayments.length },
    {
      key: "due-soon",
      label: "Due Soon",
      count: upcomingPayments.filter(
        (p) => new Date(p.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      ).length,
    },
    {
      key: "upcoming",
      label: "Upcoming",
      count: upcomingPayments.filter(
        (p) => new Date(p.dueDate) > new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      ).length,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        Loading payments...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Navbar />

      {/* Header */}
      <div className="px-6 py-8">
        <h1 className="text-3xl font-extrabold tracking-wide">Upcoming Payments</h1>
        <p className="text-white/70">
          {filteredPayments.length} payment
          {filteredPayments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="overflow-x-auto mb-8 px-6">
        <div className="flex gap-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          {filterOptions.map((option) => {
            const isActive = filter === option.key;
            return (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-green-600 text-white shadow-lg"
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
            {filter === "overdue" ? (
              <>
                <AlertTriangle
                  size={56}
                  className="mx-auto text-green-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
                <h2 className="text-2xl font-bold">No Overdue Payments</h2>
                <p className="text-white/60">
                  Great job! You don't have any overdue payments.
                </p>
              </>
            ) : (
              <>
                <Calendar
                  size={56}
                  className="mx-auto text-white/50 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                />
                <h2 className="text-2xl font-bold">No Payments</h2>
                <p className="text-white/60">
                  {filter === "all"
                    ? "You're all caught up! No payments are currently due."
                    : "No payments match the selected filter."}
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] p-4 hover:bg-white/10 transition-colors"
              >
                <PaymentItem payment={payment} onMarkAsPaid={markPaymentAsPaid} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


