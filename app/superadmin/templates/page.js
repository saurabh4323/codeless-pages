"use client";
import { useEffect, useState } from "react";
import SuperadminNavbar from "../SuperadminNavbar";
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

  return (
    <><SuperadminNavbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
          
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Template Management
          </h1>
          <p className="text-blue-200">
            View all templates across all organizations
          </p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-xs font-medium">Total Templates</p>
                <p className="text-3xl font-bold text-white mt-1">{templates.length}</p>
              </div>
              <div className="bg-blue-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-xs font-medium">Displayed</p>
                <p className="text-3xl font-bold text-white mt-1">{filteredTemplates.length}</p>
              </div>
              <div className="bg-purple-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-xs font-medium">Organizations</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {new Set(templates.map(t => t.tenantName || t.tenantToken).filter(Boolean)).size}
                </p>
              </div>
              <div className="bg-green-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/20">
          <label className="block text-blue-200 text-sm font-medium mb-2">
            Search Templates
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, description, or organization..."
            className="w-full bg-white text-black placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-blue-200">Loading templates...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-5">
            <p className="text-red-200 font-semibold mb-1">Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/20">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                      Template Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-200 uppercase tracking-wider">
                      Created At
                    </th>
                   
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredTemplates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-blue-300 opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-blue-200 font-semibold mb-1">No templates found</p>
                          <p className="text-blue-300 text-sm">
                            {searchTerm ? "Try adjusting your search" : "No templates have been created yet"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTemplates.map((t) => (
                      <tr 
                        key={t._id} 
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {(t.name || "T").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-semibold">
                                {t.name || "Untitled Template"}
                              </p>
                              <p className="text-blue-300 text-xs">
                                ID: {t._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-blue-100 text-sm max-w-xs truncate">
                            {t.description || "-"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-200 text-xs font-medium">
                              {t.tenantName || t.tenantToken || "No Organization"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-blue-100 text-sm">
                            {t.createdAt ? (
                              <>
                                <p className="font-medium">
                                  {new Date(t.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                                <p className="text-blue-300 text-xs">
                                  {new Date(t.createdAt).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </>
                            ) : (
                              "-"
                            )}
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
              <div className="bg-white/5 border-t border-white/20 px-6 py-3">
                <p className="text-blue-200 text-sm">
                  Showing <span className="font-semibold text-white">{filteredTemplates.length}</span> of{" "}
                  <span className="font-semibold text-white">{templates.length}</span> templates
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}