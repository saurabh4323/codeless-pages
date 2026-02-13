"use client";
import { useEffect, useState, useMemo } from "react";
import { Search, Users, Building2, Filter } from "lucide-react";

export default function SuperadminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admins?all=true");
        const data = await response.json();
        setAdmins(data.admins || []);
        setError("");
      } catch (err) {
        setError("Failed to fetch admins.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // Get unique organizations
  const organizations = useMemo(() => {
    const orgs = new Set();
    admins.forEach(admin => {
      const orgName = admin.tenantName || admin.tenantToken || "Unknown";
      orgs.add(orgName);
    });
    return Array.from(orgs).sort();
  }, [admins]);

  // Filter admins based on selected organization and search term
  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => {
      const orgName = admin.tenantName || admin.tenantToken || "Unknown";
      const matchesOrg = selectedOrg === "all" || orgName === selectedOrg;
      const matchesSearch = 
        (admin.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (admin.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (orgName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesOrg && matchesSearch;
    });
  }, [admins, selectedOrg, searchTerm]);

  // Get organization statistics
  const orgStats = useMemo(() => {
    const stats = {};
    admins.forEach(admin => {
      const orgName = admin.tenantName || admin.tenantToken || "Unknown";
      stats[orgName] = (stats[orgName] || 0) + 1;
    });
    return stats;
  }, [admins]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Users className="w-8 h-8" />
          Admin Management
        </h1>
        <p className="text-gray-400">Manage all administrators across organizations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e1b4b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Admins</p>
              <p className="text-4xl font-bold text-white mt-2">{admins.length}</p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-xl">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#1e1b4b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Organizations</p>
              <p className="text-4xl font-bold text-white mt-2">{organizations.length}</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#1e1b4b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Filtered Results</p>
              <p className="text-4xl font-bold text-white mt-2">{filteredAdmins.length}</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-xl">
              <Filter className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1e1b4b]/30 backdrop-blur-sm rounded-2xl p-6 border border-white/5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Organization Filter */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Filter by Organization</label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">All Organizations ({admins.length})</option>
              {organizations.map((org) => (
                <option key={org} value={org}>
                  {org} ({orgStats[org] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-[#1e1b4b]/20 border border-white/5 rounded-2xl p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-400 mt-4">Loading admins...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="bg-[#1e1b4b]/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No admins found matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin, index) => (
                    <tr 
                      key={admin._id} 
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-500 font-mono text-sm">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                            {admin.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <span className="text-white font-medium">{admin.name || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{admin.email || "-"}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-xs font-medium">
                          <Building2 className="w-3 h-3" />
                          {admin.tenantName || admin.tenantToken || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US', {
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
      )}
    </div>
  );
}