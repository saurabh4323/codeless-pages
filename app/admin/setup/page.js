"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Key, ArrowRight, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminSetupPage() {
  const [adminToken, setAdminToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      const adminData = localStorage.getItem("adminData");
      if (adminData) {
        router.push("/admin/hero");
      } else {
        router.push("/admin/register");
      }
    }
  }, [router]);

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!adminToken.trim()) {
      setError("Please enter your admin token");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: adminToken.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("adminToken", adminToken.trim());
        localStorage.setItem("adminTokenData", JSON.stringify(data.tokenData));
        setSuccess("Token validated successfully! Redirecting...");
        setTimeout(() => {
          router.push("/admin/register");
        }, 1500);
      } else {
        setError(data.message || "Invalid admin token");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      setError("Failed to validate token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
          
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 rotate-3"
            >
              <ShieldCheck className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Access</h2>
            <p className="text-gray-400">Enter your secure token to verify identity</p>
          </div>

          <form onSubmit={handleTokenSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="adminToken" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Security Token
              </label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
                <input
                  id="adminToken"
                  type="password"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm tracking-wider"
                  placeholder="Paste your token here"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/20 text-green-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {success}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Verify Token
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-gray-500 text-xs">
              Protected Area. Unauthorized access is monitored.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}