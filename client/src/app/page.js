"use client";

import Link from "next/link";
import { User, CreditCard, BarChart2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          PayPlan
        </h1>
        <div className="flex gap-4">
          <Link
            href="/auth"
            className="px-4 py-2 rounded-md text-white/70 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth"
            className="px-4 py-2 rounded-md bg-gradient-to-r from-red-600 to-red-700 text-white font-bold hover:from-red-700 hover:to-red-800 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-20 max-w-3xl mx-auto">
        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
          Simplify Household Expenses
        </h2>
        <p className="text-white/70 text-lg mb-8">
          Track shared expenses, log payments automatically, and get insights into spending trends all in one place.
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth"
            className="px-6 py-3 rounded-md bg-gradient-to-r from-red-600 to-red-700 text-white font-bold transition-all hover:from-red-700 hover:to-red-800 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transform hover:scale-[1.02]"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="px-6 py-3 rounded-md bg-white/10 text-white/70 font-semibold hover:bg-white/15 transition-all"
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
        <div className="flex flex-col items-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
          <User size={36} className="mb-4 text-white/70" />
          <h3 className="text-xl font-bold mb-2">Shared Household Dashboard</h3>
          <p className="text-white/70">
            Monitor household totals and see who spent what at a glance.
          </p>
        </div>
        <div className="flex flex-col items-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
          <CreditCard size={36} className="mb-4 text-white/70" />
          <h3 className="text-xl font-bold mb-2">Manual & Auto Expense Logging</h3>
          <p className="text-white/70">
            Add expenses manually or import from M-PESA and bank messages automatically.
          </p>
        </div>
        <div className="flex flex-col items-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
          <BarChart2 size={36} className="mb-4 text-white/70" />
          <h3 className="text-xl font-bold mb-2">Insights & Spending Charts</h3>
          <p className="text-white/70">
            Visualize spending trends, category breakdowns, and budget alerts.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 py-6 text-center text-white/50">
        &copy; {new Date().getFullYear()} PayPlan. All rights reserved.
      </footer>
    </div>
  );
}
