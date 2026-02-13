"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Users, FileText, BarChart3, Search, Filter } from "lucide-react";

export default function SuperadminUsers() {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPages: 0, avgPagesPerUser: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/users?all=true");
        setUsers(response.data.users || []);
        setOrganizations(response.data.organizations || []);
        setTopUsers(response.data.topUsers || []);
        setStats(response.data.stats || { totalUsers: 0, totalPages: 0, avgPagesPerUser: 0 });
        setError("");
      } catch (err) {
        setError("Failed to fetch users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on organization and search
  const filteredUsers = users.filter(user => {
    const matchesOrg = selectedOrg === "all" || user.tenantName === selectedOrg;
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesOrg && matchesSearch;
  });

  // Calculate filtered statistics
  const filteredStats = {
    totalUsers: filteredUsers.length,
    totalPages: filteredUsers.reduce((sum, user) => sum + (user.pagesCreated || 0), 0),
    avgPagesPerUser: filteredUsers.length > 0 
      ? (filteredUsers.reduce((sum, user) => sum + (user.pagesCreated || 0), 0) / filteredUsers.length).toFixed(2) 
      : 0
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Users className="w-8 h-8" />
          User Management
        </h1>
        <p className="text-gray-400">Manage and monitor all users across organizations</p>
      </div>

      {loading ? (
        <div className="bg-[#1e1b4b]/20 border border-white/5 rounded-2xl p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-400 mt-4">Loading user data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400 font-semibold mb-1">Error</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1e1b4b]/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Users</p>
                  <p className="text-4xl font-bold text-white mt-2">{filteredStats.totalUsers}</p>
                  {selectedOrg !== "all" && (
                    <p className="text-xs text-blue-300 mt-1">of {stats.totalUsers} total</p>
                  )}
                </div>
                <div className="bg-purple-500/10 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-[#1e1b4b]/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Pages Created</p>
                  <p className="text-4xl font-bold text-white mt-2">{filteredStats.totalPages}</p>
                  {selectedOrg !== "all" && (
                     <p className="text-xs text-blue-300 mt-1">of {stats.totalPages} total</p>
                   )}
                </div>
                <div className="bg-pink-500/10 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-pink-400" />
                </div>
              </div>
            </div>

            <div className="bg-[#1e1b4b]/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Avg Pages/User</p>
                  <p className="text-4xl font-bold text-white mt-2">{filteredStats.avgPagesPerUser}</p>
                   {selectedOrg !== "all" && (
                      <p className="text-xs text-blue-300 mt-1">overall: {stats.avgPagesPerUser}</p>
                    )}
                </div>
                <div className="bg-blue-500/10 p-3 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#1e1b4b]/30 backdrop-blur-sm rounded-2xl p-6 border border-white/5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                  Filter by Organization
                </label>
                <div className="relative">
                  <select
                    value={selectedOrg}
                    onChange={(e) => setSelectedOrg(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="all">
                      All Organizations ({organizations.length})
                    </option>
                    {organizations.map(org => (
                      <option key={org} value={org}>
                        {org}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                  Search Users
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[#1e1b4b]/40 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Organization</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Pages Created</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No users found matching your criteria</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs">
                               {user.fullName?.charAt(0).toUpperCase() || "?"}
                             </div>
                             <span className="text-white font-medium">{user.fullName || "-"}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{user.email || "-"}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-md text-xs font-medium">
                            {user.tenantName || "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                             user.pagesCreated > 0 
                                ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                : "bg-gray-500/10 text-gray-400 border-white/10"
                          }`}>
                            {user.pagesCreated || 0} Pages
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Users Chart */}
          <div className="bg-[#1e1b4b]/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Top 10 Contributors
            </h2>
            <div className="space-y-4">
              {topUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No data available</div>
              ) : (
                topUsers.map((user, index) => {
                  const maxPages = topUsers[0]?.pagesCreated || 1;
                  const percentage = (user.pagesCreated / maxPages) * 100;
                  
                  return (
                    <div key={user._id} className="flex items-center gap-4 group">
                      <div className="w-8 h-8 flex items-center justify-center bg-[#0f1023] border border-white/10 rounded-full text-xs font-mono text-gray-400">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-white font-medium text-sm mr-2">{user.fullName || user.email}</span>
                            <span className="text-gray-500 text-xs">{user.tenantName}</span>
                          </div>
                          <span className="text-blue-300 font-bold text-xs bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                            {user.pagesCreated} Pages
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:from-blue-400 group-hover:to-indigo-400"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}