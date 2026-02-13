"use client";
import SuperadminNavbar from "./SuperadminNavbar";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ShieldAlert, Key } from "lucide-react";
import toast from "react-hot-toast";

export default function SuperAdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    // Check local storage on mount
    const auth = localStorage.getItem("superadminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (!password) {
      setPasswordError("Please enter the password");
      return;
    }
    try {
      const response = await axios.post("/api/password", { password });
      if (response.data.success) {
        localStorage.setItem("superadminAuth", "true");
        setIsAuthenticated(true);
        toast.success("Access Granted");
      } else {
        setPasswordError("Access Denied: Incorrect password");
        toast.error("Incorrect password");
      }
    } catch (error) {
      setPasswordError("Error verifying password. Please try again.");
      toast.error("Verification failed");
    } finally {
      setPassword("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1023] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f1023] flex items-center justify-center p-4">
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0f1023] to-[#0f1023] pointer-events-none" />
        <Toaster position="top-right" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-[#1e1b4b]/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/10"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
              <ShieldAlert className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Super Admin Access</h2>
            <p className="text-gray-400">Please verify your identity to continue</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Enter superadmin password"
                  autoFocus
                />
                <Key className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
              </div>
            </div>
            {passwordError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <ShieldAlert className="w-4 h-4" />
                {passwordError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-6 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1023] text-white font-sans selection:bg-blue-500/30">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0f1023] to-[#0f1023] pointer-events-none" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <SuperadminNavbar />
        <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e1b4b",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
    </div>
  );
}
