"use client";
import React, { useState, useEffect } from "react";
import apiClient from "@/utils/apiClient";
import { Users, Search, CheckCircle, XCircle, Shield, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNonValidated, setShowNonValidated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/admin/users");
        setUsers(response.data.users || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleValidationChange = async (email, validated) => {
    try {
      await apiClient.put("/api/admin/users", { email, validated });
      setUsers(
        users.map((user) =>
          user.email === email ? { ...user, validated } : user
        )
      );
    } catch (err) {
      setError("Failed to update user validation status.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (showNonValidated) return matchesSearch && !user.validated;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-blue-200 animate-pulse font-medium">Loading Users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            User Management
          </h1>
          <p className="text-gray-400">Manage registered users and validation status</p>
        </div>
        
        <div className="flex gap-3">
           <button
             onClick={() => setShowNonValidated(!showNonValidated)}
             className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
               showNonValidated 
                 ? "bg-red-500 text-white shadow-lg shadow-red-500/20" 
                 : "bg-white/5 text-gray-300 hover:bg-white/10"
             }`}
           >
             <AlertCircle className="w-4 h-4" />
             {showNonValidated ? "Showing Non-Validated" : "Show Non-Validated Only"}
           </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                          {user.fullName?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.fullName || "Unknown"}</p>
                          <p className="text-gray-500 text-xs flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                        user.validated 
                          ? "bg-green-500/10 text-green-400 border-green-500/20" 
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {user.validated ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {user.validated ? "Validated" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Shield className="w-4 h-4 text-blue-400" />
                        User
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleValidationChange(user.email, !user.validated)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          user.validated
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                            : "bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white"
                        }`}
                      >
                        {user.validated ? "Revoke Access" : "Validate User"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AlertCircle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
