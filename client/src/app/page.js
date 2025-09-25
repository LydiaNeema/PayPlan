"use client";

import Link from "next/link";
import { Users, CreditCard, BarChart2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1E3A8A] to-[#0A1A33] text-white px-4">


      {/* Navbar */}
      <nav className="flex justify-between items-center py-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-extrabold text-white">
          PayPlan
        </h1>
        <div className="flex gap-4">
          <Link
            href="/auth"
            className="px-6 py-2 rounded-md border border-white text-white font-semibold hover:bg-white/10 transition-all"
          >
            Login
          </Link>
          <Link
            href="/auth"
            className="px-4 py-2 rounded-md bg-white text-[#065F46] font-bold hover:bg-gray-100 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-20 max-w-3xl mx-auto">
        <h2 className="text-5xl font-extrabold text-white mb-4">
          Simplify Household Expenses
        </h2>
        <p className="text-white/80 text-lg mb-8">
          Track shared expenses,  manage, and optimize all your recurring expenses in one beautiful dashboard.
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth"
            className="px-6 py-3 rounded-md bg-white text-[#065F46] font-bold hover:bg-gray-100 transform hover:scale-[1.02] transition-all"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="px-6 py-3 rounded-md border border-white text-white font-semibold hover:bg-white/10 transition-all"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="mt-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all">
          <Users size={36} className="mb-4 text-white" />
          <h3 className="text-xl font-bold mb-2">Household Management</h3>
          <p className="text-white/80">
            Share and manage subscriptions with family members and roommates.
          </p>
        </div>
        <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all">
          <CreditCard size={36} className="mb-4 text-white" />
          <h3 className="text-xl font-bold mb-2">Payment Insights</h3>
          <p className="text-white/80">
            Get detailed insights into your spending patterns and upcoming payments.
          </p>
        </div>
        <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all">
          <BarChart2 size={36} className="mb-4 text-white" />
          <h3 className="text-xl font-bold mb-2">Insights & Spending Charts</h3>
          <p className="text-white/80">
            Visualize spending trends, category breakdowns, and budget alerts.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 py-6 text-center text-white/60">
        &copy; {new Date().getFullYear()} PayPlan. All rights reserved.
      </footer>
    </div>
  );
}
