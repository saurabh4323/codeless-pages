"use client";
import { useEffect, useState } from "react";
import { Search, FileText, Database, Shield } from "lucide-react";

export default function SuperadminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/templates?all=true", {
          headers: {
            "x-superadmin": "true"
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTemplates(data.templates || []);
        setError("");
      } catch (err) {
        setError("Failed to fetch templates.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  // Filter templates based on search
  const filteredTemplates = templates.filter((t) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (t.name || "").toLowerCase().includes(searchLower) ||
      (t.description || "").toLowerCase().includes(searchLower) ||
      (t.tenantName || "").toLowerCase().includes(searchLower) ||
      (t.tenantToken || "").toLowerCase().includes(searchLower)
    );
  });

  // Calculate unique organizations count
  const uniqueOrgs = new Set(templates.map(t => t.tenantName || t.tenantToken).filter(Boolean)).size;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8" />
          Template Management
        </h1>
        <p className="text-gray-400">View all templates across all organizations</p>
      </div>

      {loading ? (
        <div className="bg-[#1e1b4b]/20 border border-white/5 rounded-2xl p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-400 mt-4">Loading templates...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400 font-semibold mb-1">Error</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1e1b4b]/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Templates</p>
                  <p className="text-4xl font-bold text-white mt-2">{templates.length}</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-[#1e1b4b]/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Displayed</p>
                  <p className="text-4xl font-bold text-white mt-2">{filteredTemplates.length}</p>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-xl">
                  <Database className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-[#1e1b4b]/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Organizations</p>
                  <p className="text-4xl font-bold text-white mt-2">{uniqueOrgs}</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-[#1e1b4b]/30 backdrop-blur-sm rounded-2xl p-6 border border-white/5 mb-8">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
              Search Templates
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, description, or organization..."
                className="w-full bg-[#0f1023] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#1e1b4b]/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Template Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Organization</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTemplates.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No templates found matching your criteria</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTemplates.map((t) => (
                      <tr 
                        key={t._id} 
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                              {(t.name || "T").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                                {t.name || "Untitled Template"}
                              </p>
                              <p className="text-gray-500 text-xs font-mono">
                                {t._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-400 text-sm max-w-xs truncate">
                            {t.description || "-"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-md text-xs font-medium">
                            {t.tenantName || t.tenantToken || "No Organization"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-400 text-sm">
                            {t.createdAt ? (
                              <>
                                <p className="font-medium text-gray-300">
                                  {new Date(t.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                                <p className="text-gray-600 text-xs">
                                  {new Date(t.createdAt).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </>
                            ) : "-"}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer with count */}
            {filteredTemplates.length > 0 && (
              <div className="bg-white/5 border-t border-white/5 px-6 py-3">
                <p className="text-gray-400 text-sm">
                  Showing <span className="font-semibold text-white">{filteredTemplates.length}</span> of <span className="font-semibold text-white">{templates.length}</span> templates
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}