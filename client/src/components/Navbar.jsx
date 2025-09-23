"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, CreditCard, Calendar, Clock, Users, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "Services", path: "/services", icon: CreditCard },
  { name: "Upcoming", path: "/upcoming", icon: Calendar },
  { name: "History", path: "/history", icon: Clock },
  { name: "Household", path: "/household", icon: Users },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Hide navbar on auth pages
  if (pathname.startsWith("/auth")) {
    return null;
  }

  const handleNavPress = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Brand */}
        <span
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer text-2xl font-extrabold text-red-600"
        >
          PayPlan
        </span>

        {/* Links */}
        <div className="flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => handleNavPress(item.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive ? "bg-red-600/20 text-red-600" : "text-gray-300 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span className="font-semibold text-sm">{item.name}</span>
              </button>
            );
          })}

          {/* Auth button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:text-white"
            >
              <LogOut size={18} />
              <span className="font-semibold text-sm">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavPress("/auth")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                pathname.startsWith("/auth")
                  ? "bg-red-600/20 text-red-600"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <LogIn size={18} />
              <span className="font-semibold text-sm">Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
