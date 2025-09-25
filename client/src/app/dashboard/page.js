"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { 
  Wallet, Calendar, AlertTriangle, TrendingUp, 
  Search, Bell, Plus, MoreVertical, DollarSign,
  CreditCard, TrendingDown, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import Navbar from "../../components/Navbar";
import {
  getExpenses,
  getUpcomingPayments,
  getOverduePayments,
  markPaymentAsPaid,
  getServices,
  getHousehold,
} from "../../utils/api";

export default function DashboardPage() {
  const { user, token } = useAuth();

  const [services, setServices] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [overduePayments, setOverduePayments] = useState([]);
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);

  // Derive display name
  const displayName =
    user?.username ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "there");

  // First letter for avatar
  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : "U";

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, upcomingData, overdueData, householdData] =
          await Promise.all([
            getServices(token),
            getUpcomingPayments(token),
            getOverduePayments(token),
            getHousehold(token),
          ]);

        setServices(servicesData || []);
        setUpcomingPayments(upcomingData || []);
        setOverduePayments(overdueData || []);
        setHousehold(householdData || null);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) fetchData();
  }, [user, token]);

  // Calculate totals
  const totalMonthlyAmount = services.reduce(
    (sum, service) => sum + (service.monthlyCost || 0),
    0
  );
  const totalSavings = totalMonthlyAmount * 0.15; // 15% savings example

  const handleMarkAsPaid = async (paymentId) => {
    try {
      await markPaymentAsPaid(paymentId, token);
      const [servicesData, upcomingData, overdueData] = await Promise.all([
        getServices(token),
        getUpcomingPayments(token),
        getOverduePayments(token),
      ]);
      setServices(servicesData || []);
      setUpcomingPayments(upcomingData || []);
      setOverduePayments(overdueData || []);
    } catch (error) {
      console.error("Failed to mark payment as paid:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1E3A8A] to-[#0A1A33]">
        <p className="text-white/70">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#1E3A8A] to-[#0A1A33]">
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 overflow-auto">
        <div>

          {/* Header (Service-page style) */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 backdrop-blur-md">
            <h1 className="text-xl font-bold tracking-wide">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-white/5 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/20"
                />
              </div>
              <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                <Bell size={20} className="text-gray-400" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#1E3A8A] to-blue-500 flex items-center justify-center text-white font-bold">
                  {avatarLetter}
                </div>
                <span className="hidden sm:block text-white text-sm font-medium">
                  {displayName}
                </span>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-medium text-white mb-1">Welcome back, {displayName}!</h2>
            <p className="text-gray-400 text-sm">
              Monitor and control what happens with your money today for financial health.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Account Balance Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Account Balance</p>
                    <h3 className="text-2xl font-bold text-white">{formatCurrency(totalMonthlyAmount * 12)}</h3>
                    <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                      <ArrowUpRight size={12} />
                      <span>+14% from last month</span>
                    </p>
                  </div>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <DollarSign size={20} className="text-blue-400" />
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all">
                  Send Money
                </button>
              </div>

              {/* Total Expenses Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Expenses</p>
                    <h3 className="text-2xl font-bold text-white">{formatCurrency(totalMonthlyAmount)}</h3>
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <ArrowDownRight size={12} />
                      <span>-21% from last month</span>
                    </p>
                  </div>
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <TrendingDown size={20} className="text-red-400" />
                  </div>
                </div>
                <button className="w-full bg-white/10 text-white py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all">
                  Request Money
                </button>
              </div>

              {/* Total Savings Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Savings</p>
                    <h3 className="text-2xl font-bold text-white">{formatCurrency(totalSavings)}</h3>
                    <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                      <ArrowUpRight size={12} />
                      <span>+41% from last month</span>
                    </p>
                  </div>
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Wallet size={20} className="text-green-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">This Year</span>
                    <span className="text-white">62%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{width: '62%'}}></div>
                  </div>
                </div>
              </div>

              {/* Overview Chart Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-400 text-sm">Overview</p>
                  <select className="bg-transparent text-gray-400 text-xs border-none focus:outline-none">
                    <option>This Year</option>
                  </select>
                </div>
                <div className="flex items-end gap-2 h-20">
                  {[40, 60, 35, 80, 45, 70, 55].map((height, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-green-500 to-blue-500 rounded-t" 
                      style={{height: `${height}%`}}></div>
                  ))}
                </div>
                <div className="mt-3 text-center">
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalMonthlyAmount * 3)}</p>
                  <p className="text-gray-400 text-xs">Earnings</p>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* My Wallet Section */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold">My Wallet</h3>
                    <button className="p-1 hover:bg-white/10 rounded transition-all">
                      <Plus size={16} className="text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <CreditCard size={20} className="text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">USD</p>
                        <p className="text-gray-400 text-xs">{formatCurrency(totalMonthlyAmount * 2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <CreditCard size={20} className="text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">EUR</p>
                        <p className="text-gray-400 text-xs">{formatCurrency(totalMonthlyAmount * 1.5)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <CreditCard size={20} className="text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">GBP</p>
                        <p className="text-gray-400 text-xs">{formatCurrency(totalMonthlyAmount * 1.2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* My Savings Plan */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold">My Savings Plan</h3>
                    <button className="p-1 hover:bg-white/10 rounded transition-all">
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {services.slice(0, 2).map((service, i) => (
                      <div key={service.id}>
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-400 text-sm">{service.name}</p>
                          <p className="text-white text-sm font-medium">{formatCurrency(service.monthlyCost)}</p>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                            style={{width: `${60 + i * 20}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-semibold">Recent Transaction</h3>
                    <button className="text-gray-400 text-sm hover:text-white transition-all">
                      Filter ▼
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-gray-400 text-sm">
                          <th className="text-left pb-4">Service</th>
                          <th className="text-left pb-4">Date</th>
                          <th className="text-left pb-4">Amount</th>
                          <th className="text-left pb-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-white text-sm">
                        {upcomingPayments.slice(0, 5).map((payment) => (
                          <tr key={payment.id} className="border-t border-white/5">
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                  <CreditCard size={16} className="text-blue-400" />
                                </div>
                                <span>{payment.serviceName || 'Service'}</span>
                              </div>
                            </td>
                            <td className="py-3 text-gray-400">
                              {new Date(payment.dueDate).toLocaleDateString()}
                            </td>
                            <td className="py-3">{formatCurrency(payment.amount)}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                payment.status === 'paid' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {payment.status === 'paid' ? '✓ Success' : '⏳ Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {services.length === 0 && (
              <div className="text-center mt-20">
                <h2 className="text-2xl font-bold text-white">Welcome to PayPlan!</h2>
                <p className="text-white/70 mt-2">
                  Start by adding your first subscription or recurring service.
                </p>
                <Link
                  href="/service"
                  className="mt-4 inline-block text-blue-500 font-semibold hover:text-blue-400"
                >
                  Add Your First Service →
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
