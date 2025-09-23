"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { loginRequest, signupRequest, fetchCurrentUser } from "../../utils/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [isActive, setIsActive] = useState(false); // toggle flip
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { access_token } = await loginRequest(email, password);
      const user = await fetchCurrentUser(access_token);
      login(access_token, user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || err.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        username: fullName,
        email,
        password,
        household_id: null, // adjust if needed
      };

      await signupRequest(payload); // create user
      // Auto login after signup
      const { access_token } = await loginRequest(email, password);
      const user = await fetchCurrentUser(access_token);
      login(access_token, user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || err.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 relative overflow-hidden">
      <div className="relative w-full max-w-[450px] h-[550px] perspective-1000">
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-in-out transform-style-3d ${
            isActive ? "rotate-y-180" : ""
          }`}
        >
          {/* LOGIN FORM - Front Side */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full flex flex-col justify-center backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-xl p-10">
              <h1 className="mb-8 text-center text-4xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                PayPlan
              </h1>
              <h2 className="mb-5 text-center text-2xl font-bold text-white">
                Login
              </h2>

              {error && (
                <p className="text-center text-red-400 text-sm mb-3">{error}</p>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-4 flex items-center gap-3 rounded-md backdrop-blur-sm bg-white/10 border border-white/20 px-4 py-3">
                  <Mail size={18} className="text-white/70" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent text-white outline-none placeholder:text-white/50"
                  />
                </div>

                <div className="mb-4 flex items-center gap-3 rounded-md backdrop-blur-sm bg-white/10 border border-white/20 px-4 py-3">
                  <Lock size={18} className="text-white/70" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-1 bg-transparent text-white outline-none placeholder:text-white/50"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer text-white/70 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>

                <div className="mb-4 flex items-center">
                  <input type="checkbox" id="remember" className="mr-2" />
                  <label htmlFor="remember" className="text-white/70 text-sm">
                    Remember Me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 font-bold text-white transition-all duration-300 hover:from-red-700 hover:to-red-800 disabled:opacity-50"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>

                <div className="mt-6 text-center">
                  <p className="text-white/70">
                    New to PayPlan?{" "}
                    <span
                      onClick={() => setIsActive(true)}
                      className="cursor-pointer font-bold text-white hover:text-red-400 transition-colors"
                    >
                      Sign up
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* REGISTER FORM - Back Side */}
          <div className="absolute w-full h-full rotate-y-180 backface-hidden">
            <div className="w-full h-full flex flex-col justify-center backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-xl p-10">
              <h1 className="mb-8 text-center text-4xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                PayPlan
              </h1>
              <h2 className="mb-5 text-center text-2xl font-bold text-white">
                Create Account
              </h2>

              {error && (
                <p className="text-center text-red-400 text-sm mb-3">{error}</p>
              )}

              <form onSubmit={handleSignup}>
                <div className="mb-4 flex items-center gap-3 rounded-md backdrop-blur-sm bg-white/10 border border-white/20 px-4 py-3">
                  <User size={18} className="text-white/70" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-transparent text-white outline-none placeholder:text-white/50"
                  />
                </div>

                <div className="mb-4 flex items-center gap-3 rounded-md backdrop-blur-sm bg-white/10 border border-white/20 px-4 py-3">
                  <Mail size={18} className="text-white/70" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent text-white outline-none placeholder:text-white/50"
                  />
                </div>

                <div className="mb-4 flex items-center gap-3 rounded-md backdrop-blur-sm bg-white/10 border border-white/20 px-4 py-3">
                  <Lock size={18} className="text-white/70" />
                  <input
                    type={showRegPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-1 bg-transparent text-white outline-none placeholder:text-white/50"
                  />
                  <span
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="cursor-pointer text-white/70 hover:text-white transition-colors"
                  >
                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>

                <div className="mb-4 flex items-center">
                  <input type="checkbox" id="terms" className="mr-2" required />
                  <label htmlFor="terms" className="text-white/70 text-sm">
                    I agree to the Terms & Conditions
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 font-bold text-white transition-all duration-300 hover:from-red-700 hover:to-red-800 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Sign Up"}
                </button>

                <div className="mt-6 text-center">
                  <p className="text-white/70">
                    Already have an account?{" "}
                    <span
                      onClick={() => setIsActive(false)}
                      className="cursor-pointer font-bold text-white hover:text-red-400 transition-colors"
                    >
                      Sign in
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
