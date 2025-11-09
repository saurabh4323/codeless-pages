"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SuperadminNavbar from "../SuperadminNavbar";

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
    <>
      <SuperadminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">User Management Dashboard</h1>
            <p className="text-purple-200">Manage and monitor all users across organizations</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-300 mx-auto mb-4"></div>
                <p className="text-purple-200">Loading data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 text-red-200">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm font-medium">Total Users</p>
                      <p className="text-4xl font-bold text-white mt-2">{filteredStats.totalUsers}</p>
                      {selectedOrg !== "all" && (
                        <p className="text-xs text-purple-300 mt-1">of {stats.totalUsers} total</p>
                      )}
                    </div>
                    <div className="bg-purple-500/30 rounded-full p-4">
                      <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm font-medium">Total Pages Created</p>
                      <p className="text-4xl font-bold text-white mt-2">{filteredStats.totalPages}</p>
                      {selectedOrg !== "all" && (
                        <p className="text-xs text-purple-300 mt-1">of {stats.totalPages} total</p>
                      )}
                    </div>
                    <div className="bg-pink-500/30 rounded-full p-4">
                      <svg className="w-8 h-8 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm font-medium">Avg Pages/User</p>
                      <p className="text-4xl font-bold text-white mt-2">{filteredStats.avgPagesPerUser}</p>
                      {selectedOrg !== "all" && (
                        <p className="text-xs text-purple-300 mt-1">overall: {stats.avgPagesPerUser}</p>
                      )}
                    </div>
                    <div className="bg-indigo-500/30 rounded-full p-4">
                      <svg className="w-8 h-8 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart - Top Users by Pages Created */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Top 10 Users by Pages Created</h2>
                <div className="space-y-4">
                  {topUsers.length === 0 ? (
                    <p className="text-purple-200 text-center py-8">No page creation data available</p>
                  ) : (
                    topUsers.map((user, index) => {
                      const maxPages = topUsers[0]?.pagesCreated || 1;
                      const percentage = (user.pagesCreated / maxPages) * 100;
                      
                      return (
                        <div key={user._id} className="flex items-center gap-4">
                          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                            <span className="text-white font-bold">#{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <p className="text-white font-medium">{user.fullName || user.email || "Unknown"}</p>
                                <p className="text-purple-200 text-sm">{user.tenantName}</p>
                              </div>
                              <span className="text-white font-bold text-lg bg-white/10 px-4 py-1 rounded-full">
                                {user.pagesCreated} {user.pagesCreated === 1 ? 'page' : 'pages'}
                              </span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-purple-400 to-pink-400 h-full rounded-full transition-all duration-500"
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

              {/* Filters */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Filter by Organization
                    </label>
                    <select
                      value={selectedOrg}
                      onChange={(e) => setSelectedOrg(e.target.value)}
                      className="w-full bg-gray-900 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                      style={{ backgroundColor: '#1a1a1a', color: 'white' }}
                    >
                      <option value="all" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                        All Organizations ({organizations.length})
                      </option>
                      {organizations.map(org => (
                        <option key={org} value={org} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                          {org}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Search Users
                    </label>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-purple-200 font-semibold">Name</th>
                        <th className="px-6 py-4 text-left text-purple-200 font-semibold">Email</th>
                        <th className="px-6 py-4 text-left text-purple-200 font-semibold">Organization</th>
                        <th className="px-6 py-4 text-left text-purple-200 font-semibold">Pages Created</th>
                        <th className="px-6 py-4 text-left text-purple-200 font-semibold">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-purple-200">
                            No users found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user._id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-white font-medium">
                              {user.fullName || "-"}
                            </td>
                            <td className="px-6 py-4 text-purple-100">{user.email || "-"}</td>
                            <td className="px-6 py-4">
                              <span className="inline-block bg-purple-500/30 text-purple-100 px-3 py-1 rounded-full text-sm font-medium">
                                {user.tenantName}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-pink-500/30 text-pink-100 px-3 py-1 rounded-full text-sm font-semibold">
                                {user.pagesCreated || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-purple-100">
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
            </>
          )}
        </div>
      </div>
    </>
  );
}