"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

// Mock UserNavbar component since it's imported but not provided
function UserNavbar() {
  return (
    <nav className="bg-[#0a0e27] border-b border-purple-500/30 py-4">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-white">Codeless</h1>
      </div>
    </nav>
  );
}

export default function UserAuth() {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    tenantName: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/user/login", {
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Login successful!");
      // Fixed: Correct the localStorage assignments
       const userid = localStorage.setItem("userid", response.data.usertoken);
      const usertoken = localStorage.setItem("usertoken", response.data.userid);
      console.log("User ID:", response.data.userid);
      router.push("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.tenantName
    ) {
      setError("All fields are required, including organization name");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/user/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        tenantName: formData.tenantName,
      });
      localStorage.setItem("userid", response.data.userid);
      console.log("User ID:", response.data.userid);
      setSuccess("Registration successful! You can now login.");
      setActiveTab("login");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        tenantName: "",
      });
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setError("");
    setSuccess("");

    if (!forgotPasswordEmail) {
      setError("Please enter your email address");
      setForgotPasswordLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/user/forgot-password", {
        email: forgotPasswordEmail,
      });

      setSuccess("Password reset email sent! Please check your inbox.");
      setForgotPasswordEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden flex items-center justify-center py-12 px-4">
        {/* Animated hexagon pattern background */}
        <div className="absolute inset-0 overflow-hidden z-0 opacity-20">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons-auth" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path d="M24.9 0L49.8 14.5v29L24.9 58 0 43.4v-29L24.9 0z" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons-auth)"/>
          </svg>
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <motion.div 
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
          <motion.div 
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
        </div>

        {/* Main Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-6xl"
        >
          <div className="bg-[#1a1f3a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Side - Illustration */}
              <div className="hidden md:flex bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-12 flex-col justify-center items-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 border-2 border-purple-400 rounded-full"></div>
                  <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-blue-400 rounded-lg rotate-45"></div>
                  <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-purple-400 rounded-lg rotate-12"></div>
                </div>

                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  {/* Modern Website Illustration */}
                  <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Browser Window */}
                    <rect x="40" y="60" width="320" height="280" rx="12" fill="url(#grad1)" />
                    <rect x="40" y="60" width="320" height="280" rx="12" stroke="url(#grad2)" strokeWidth="2" />
                    
                    {/* Browser Header */}
                    <rect x="40" y="60" width="320" height="40" rx="12" fill="rgba(139, 92, 246, 0.3)" />
                    <circle cx="65" cy="80" r="6" fill="#ff5f56" />
                    <circle cx="85" cy="80" r="6" fill="#ffbd2e" />
                    <circle cx="105" cy="80" r="6" fill="#27c93f" />
                    
                    {/* Content Lines */}
                    <rect x="70" y="130" width="120" height="12" rx="6" fill="url(#grad3)" />
                    <rect x="70" y="155" width="180" height="8" rx="4" fill="rgba(139, 92, 246, 0.4)" />
                    <rect x="70" y="175" width="160" height="8" rx="4" fill="rgba(139, 92, 246, 0.3)" />
                    
                    {/* Cards */}
                    <rect x="70" y="205" width="100" height="80" rx="8" fill="rgba(139, 92, 246, 0.2)" stroke="url(#grad2)" strokeWidth="1.5" />
                    <rect x="190" y="205" width="100" height="80" rx="8" fill="rgba(59, 130, 246, 0.2)" stroke="url(#grad2)" strokeWidth="1.5" />
                    
                    {/* Floating Elements */}
                    <motion.g
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <rect x="280" y="140" width="60" height="60" rx="30" fill="url(#grad4)" opacity="0.8" />
                      <path d="M305 160 L310 170 L315 160" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="310" cy="155" r="3" fill="white" />
                    </motion.g>

                    <motion.g
                      animate={{
                        y: [0, 10, 0],
                        rotate: [0, -5, 0]
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    >
                      <rect x="10" y="180" width="50" height="50" rx="8" fill="url(#grad5)" opacity="0.7" />
                      <path d="M25 200 L35 210 L45 195" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </motion.g>

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="grad1" x1="40" y1="60" x2="360" y2="340" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="rgba(30, 27, 75, 0.9)" />
                        <stop offset="100%" stopColor="rgba(16, 16, 40, 0.9)" />
                      </linearGradient>
                      <linearGradient id="grad2" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="grad3" x1="70" y1="130" x2="190" y2="142" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="grad4" x1="280" y1="140" x2="340" y2="200" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                      <linearGradient id="grad5" x1="10" y1="180" x2="60" y2="230" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mt-8 text-center"
                >
                  <h2 className="text-3xl font-bold text-white mb-3">Build Without Code</h2>
                  <p className="text-gray-300 text-lg">Create stunning websites with our intuitive platform</p>
                </motion.div>
              </div>

              {/* Right Side - Auth Forms */}
              <div className="p-8 md:p-12">
                <div className="max-w-md mx-auto">
                  <motion.h1 
                    className="text-4xl font-bold text-white mb-2 text-center"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(139, 92, 246, 0.5)",
                        "0 0 40px rgba(139, 92, 246, 0.3)",
                        "0 0 20px rgba(139, 92, 246, 0.5)",
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Welcome
                  </motion.h1>
                  <p className="text-gray-400 text-center mb-8">Access your codeless platform</p>

                  {/* Tabs */}
                  <div className="flex mb-8 bg-[#0f1428] rounded-xl p-1">
                    <button
                      className={`flex-1 py-3 px-4 font-medium text-center rounded-lg transition-all duration-300 ${
                        activeTab === "login"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => handleTabChange("login")}
                    >
                      Login
                    </button>
                    <button
                      className={`flex-1 py-3 px-4 font-medium text-center rounded-lg transition-all duration-300 ${
                        activeTab === "register"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => handleTabChange("register")}
                    >
                      Register
                    </button>
                    <button
                      className={`flex-1 py-3 px-4 font-medium text-center rounded-lg transition-all duration-300 text-sm ${
                        activeTab === "forgot"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => handleTabChange("forgot")}
                    >
                      Reset
                    </button>
                  </div>

                  {/* Error and Success Messages */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-900/30 border border-green-500/50 text-green-300 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{success}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Login Form */}
                  {activeTab === "login" && (
                    <motion.form
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleLogin}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0f1428] border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="you@example.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0f1428] border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="••••••••"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1a1f3a] transition-all duration-300 shadow-lg hover:shadow-purple-500/50 transform hover:scale-[1.02]"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Logging in...
                          </span>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </motion.form>
                  )}

                  {/* Register Form */}
                  {activeTab === "register" && (
                    <motion.form
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleRegister}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="fullName">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0f1428] border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="regEmail">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="regEmail"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0f1428] border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="you@example.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="tenantName">
                          Organization Name
                        </label>
                        <input
                          type="text"
                          id="tenantName"
                          name="tenantName"
                          value={formData.tenantName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0f1428] border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="Your Company"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="regPassword">
                          Password
                        </label>
                        <input
                          type="password"
                          id="regPassword"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0f1428] border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0f1428] border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1a1f3a] transition-all duration-300 shadow-lg hover:shadow-purple-500/50 transform hover:scale-[1.02]"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creating account...
                          </span>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </motion.form>
                  )}

                  {/* Forgot Password Form */}
                  {activeTab === "forgot" && (
                    <motion.form
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleForgotPassword}
                      className="space-y-5"
                    >
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Enter your email address and will send you a link to reset your password.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="forgotEmail">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="forgotEmail"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-[#0f1428] border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="you@example.com"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1a1f3a] transition-all duration-300 shadow-lg hover:shadow-purple-500/50 transform hover:scale-[1.02]"
                        disabled={forgotPasswordLoading}
                      >
                        {forgotPasswordLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          "Send Reset Link"
                        )}
                      </button>

                      <div className="text-center mt-4">
                        <button
                          type="button"
                          onClick={() => handleTabChange("login")}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-300"
                        >
                          ← Back to Login
                        </button>
                      </div>
                    </motion.form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}