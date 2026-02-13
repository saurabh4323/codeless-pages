"use client";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, ShieldCheck, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminAuth() {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      adminCode: "",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/admin/login", {
        email: formData.email,
        password: formData.password,
      });

      toast.success("Welcome back!", {
        icon: "👋",
        style: {
          borderRadius: "10px",
          background: "#1e1b4b",
          color: "#fff",
        },
      });
      
      localStorage.setItem("adminToken", response.data.tenantToken);
      router.push("/admin/hero");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials", {
        style: {
          borderRadius: "10px",
          background: "#1e1b4b",
          color: "#fff",
          border: "1px solid rgba(239, 68, 68, 0.5)",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/admin/register", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        adminToken: formData.adminCode,
      });

      toast.success("Account created successfully! Please login.");
      localStorage.setItem("adminToken", response.data.tenantToken);
      setActiveTab("login");
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
        adminCode: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 bg-[#1e1b4b]/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 group-hover:border-white/20";
  const labelClasses = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0f1023]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-[#0f1023] to-[#0f1023] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4 shadow-lg shadow-blue-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-3xl font-bold text-white">A</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Admin Portal
            </h1>
            <p className="text-blue-200/60 text-sm">
              Manage your templates, users, and reports
            </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-[#0f1023]/50 rounded-xl mb-8 border border-white/5 relative">
            {["login", "register"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 relative z-10 ${
                  activeTab === tab ? "text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="authTab"
                    className="absolute inset-0 bg-blue-600 rounded-lg -z-10 shadow-lg shadow-blue-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div className="group">
                  <label className={labelClasses}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-hover:text-blue-400 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                    <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-hover:text-blue-400 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className={labelClasses}>Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={`${inputClasses} pl-9 text-sm`}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className={labelClasses}>Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className={`${inputClasses} pl-9 text-sm`}
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className={labelClasses}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`${inputClasses} pl-9`}
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className={labelClasses}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`${inputClasses} pl-9 text-sm`}
                        placeholder="••••••"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className={labelClasses}>Confirm</label>
                    <div className="relative">
                      <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`${inputClasses} pl-9 text-sm`}
                        placeholder="••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className={labelClasses}>Registration Code</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 text-blue-400" />
                    <input
                      type="text"
                      name="adminCode"
                      required
                      value={formData.adminCode}
                      onChange={handleChange}
                      className={`${inputClasses} pl-9 border-blue-500/30 focus:border-blue-400`}
                      placeholder="Enter admin code"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <p className="text-center text-blue-200/40 text-xs mt-6">
          &copy; {new Date().getFullYear()} Admin Panel. Secure Access Only.
        </p>
      </motion.div>
    </div>
  );
}
