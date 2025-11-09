"use client";
import { useEffect, useState } from "react";

export default function AdminResponsesDashboard() {
  const [userResponses, setUserResponses] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [selectedTemplate, setSelectedTemplate] = useState("all");
  const [selectedTenant, setSelectedTenant] = useState("all");
  const [selectedContent, setSelectedContent] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  // Data from API
  const [tenants, setTenants] = useState([]);
  const [contents, setContents] = useState([]);
  const [stats, setStats] = useState({
    totalResponses: 0,
    totalUsers: 0,
    averageScore: 0,
    completionRate: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Build query params
      const params = new URLSearchParams({ all: "true" });
      if (selectedTemplate !== "all") params.append("templateId", selectedTemplate);
      if (selectedTenant !== "all") params.append("tenant", selectedTenant);
      if (selectedContent !== "all") params.append("contentId", selectedContent);
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);
      
      // Fetch responses
      const responsesRes = await fetch(`/api/responses?${params.toString()}`, {
        headers: { 
          "x-superadmin": "true",
          "Content-Type": "application/json"
        },
      });
      
      if (!responsesRes.ok) {
        throw new Error(`HTTP error! status: ${responsesRes.status}`);
      }
      
      const responsesData = await responsesRes.json();
      console.log("Responses data:", responsesData);
      
      if (responsesData.success) {
        setUserResponses(responsesData.responses || []);
        setStats(responsesData.stats || stats);
        setChartData(responsesData.chartData || []);
        setTenants(responsesData.filters?.tenants || []);
        setContents(responsesData.filters?.contents || []);
      } else {
        setError(responsesData.message || "Failed to fetch user responses");
        setUserResponses([]);
      }

      // Fetch templates
      const templatesRes = await fetch("/api/templates?all=true", {
        headers: { 
          "x-superadmin": "true",
          "Content-Type": "application/json"
        },
      });
      
      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData.templates || []);
      }
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(`Failed to fetch user responses: ${err.message}`);
      setUserResponses([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters button - triggers new fetch
  const applyFilters = () => {
    fetchData();
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedTemplate("all");
    setSelectedTenant("all");
    setSelectedContent("all");
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    // Fetch with cleared filters
    setTimeout(() => {
      setLoading(true);
      fetch("/api/responses?all=true", {
        headers: { 
          "x-superadmin": "true",
          "Content-Type": "application/json"
        },
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserResponses(data.responses || []);
          setStats(data.stats || stats);
          setChartData(data.chartData || []);
          setTenants(data.filters?.tenants || []);
          setContents(data.filters?.contents || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setError("Failed to fetch data");
        setLoading(false);
      });
    }, 100);
  };

  const getTemplateName = (templateId) => {
    if (typeof templateId === "object" && templateId !== null) {
      return templateId.name || "Unknown Template";
    }
    const template = templates.find((t) => String(t._id) === String(templateId));
    return template ? template.name : "Unknown Template";
  };

  const getUserName = (response) => {
    if (response.userId && typeof response.userId === "object" && response.userId.fullName) {
      return response.userId.fullName;
    }
    if (response.userInfo && response.userInfo.name) {
      return response.userInfo.name;
    }
    return "Unknown User";
  };

  const getUserEmail = (response) => {
    if (response.userId && typeof response.userId === "object" && response.userId.email) {
      return response.userId.email;
    }
    if (response.userInfo && response.userInfo.email) {
      return response.userInfo.email;
    }
    return "No email";
  };

  // Client-side search filter (applied AFTER server-side filters)
  const filteredResponses = userResponses.filter((response) => {
    if (!searchTerm) return true;
    
    const userName = getUserName(response).toLowerCase();
    const userEmail = getUserEmail(response).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return userName.includes(searchLower) || userEmail.includes(searchLower);
  });

  const getSubmittedDate = (response) => {
    const date = response.submittedAt || response.createdAt;
    return date ? new Date(date) : new Date();
  };

  const maxChartValue = Math.max(...chartData.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
     
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Response Dashboard</h1>
          <p className="text-purple-200">Complete analytics and user response management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs font-medium">Total Responses</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalResponses}</p>
              </div>
              <div className="bg-purple-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs font-medium">Unique Users</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
              </div>
              <div className="bg-pink-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs font-medium">Average Score</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.averageScore}%</p>
              </div>
              <div className="bg-blue-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs font-medium">Completion Rate</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.completionRate}%</p>
              </div>
              <div className="bg-green-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-xs px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
            <div>
              <label className="block text-purple-200 text-xs font-medium mb-1">Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-white text-black text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Templates</option>
                {templates.map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-medium mb-1">Organization</label>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="w-full bg-white text-black text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Organizations</option>
                {tenants.map((tenant) => (
                  <option key={tenant} value={tenant}>
                    {tenant}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-medium mb-1">Content/Page</label>
              <select
                value={selectedContent}
                onChange={(e) => setSelectedContent(e.target.value)}
                className="w-full bg-white text-black text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Contents</option>
                {contents.map((content) => (
                  <option key={content._id} value={content._id}>
                    {content.heading || content.subheading || "Untitled"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full bg-white text-black text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-medium mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full bg-white text-black text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-3">
              <label className="block text-purple-200 text-xs font-medium mb-1">
                Search User (Live Search)
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-white text-black text-sm placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={applyFilters}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded px-4 py-2 transition-all"
              >
                {loading ? "Loading..." : "Apply Filters"}
              </button>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {(selectedTemplate !== "all" || selectedTenant !== "all" || selectedContent !== "all" || dateRange.start || dateRange.end) && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-purple-200 text-xs mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate !== "all" && (
                  <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-purple-200 text-xs">
                    Template: {getTemplateName(selectedTemplate)}
                  </span>
                )}
                {selectedTenant !== "all" && (
                  <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-200 text-xs">
                    Org: {selectedTenant}
                  </span>
                )}
                {selectedContent !== "all" && (
                  <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-200 text-xs">
                    Content Selected
                  </span>
                )}
                {dateRange.start && (
                  <span className="px-2 py-1 bg-pink-500/20 border border-pink-500/30 rounded text-pink-200 text-xs">
                    From: {dateRange.start}
                  </span>
                )}
                {dateRange.end && (
                  <span className="px-2 py-1 bg-pink-500/20 border border-pink-500/30 rounded text-pink-200 text-xs">
                    To: {dateRange.end}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 mb-6 border border-white/20">
          <h2 className="text-lg font-bold text-white mb-4">Response Trends (Last 7 Days)</h2>
          <div className="flex items-end justify-between h-48 gap-2">
            {chartData.length > 0 ? chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end" style={{ height: '160px' }}>
                  <div 
                    className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-500 hover:from-purple-400 hover:to-pink-400 relative group"
                    style={{ 
                      height: `${(data.count / maxChartValue) * 100}%`,
                      minHeight: data.count > 0 ? '8px' : '0px'
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.count} responses
                    </div>
                  </div>
                </div>
                <p className="text-purple-200 text-xs mt-2 text-center">{data.date}</p>
              </div>
            )) : (
              <div className="w-full text-center text-purple-300">No chart data available</div>
            )}
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <div className="mb-4 text-purple-200 text-sm">
            Showing {filteredResponses.length} of {userResponses.length} responses
            {searchTerm && ` (filtered by search: "${searchTerm}")`}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-purple-200">Loading responses...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-5">
            <p className="text-red-200 font-semibold mb-1">Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        ) : filteredResponses.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center border border-white/20">
            <div className="mb-4">
              <svg className="w-20 h-20 mx-auto text-purple-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-xl text-purple-200 mb-2 font-semibold">No responses found</p>
            <p className="text-purple-300">
              {userResponses.length > 0 
                ? "No results match your search term. Try different keywords."
                : "Try adjusting your filters or check back later."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResponses.map((response) => {
              const totalCount = response.responses?.length || 0;
              const userName = getUserName(response);
              const userEmail = getUserEmail(response);
              const submittedDate = getSubmittedDate(response);
              const scoreData = response.stats || {};

              return (
                <div
                  key={response._id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-4 border-b border-white/20">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-white">{userName}</h3>
                            {response.userId === "not_registered" && (
                              <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-200 text-xs">
                                Guest
                              </span>
                            )}
                            {response.tenantName && (
                              <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-blue-200 text-xs">
                                {response.tenantName}
                              </span>
                            )}
                          </div>
                          <p className="text-purple-200 text-sm">{userEmail}</p>
                          {response.contentInfo && (
                            <p className="text-purple-300 text-xs mt-1">
                              📄 {response.contentInfo.heading || response.contentInfo.subheading}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-center bg-purple-500/20 rounded-lg px-3 py-2 border border-purple-500/30">
                          <p className="text-purple-200 text-xs">Questions</p>
                          <p className="text-white font-bold">{totalCount}</p>
                        </div>
                        <div className="text-center bg-green-500/20 rounded-lg px-3 py-2 border border-green-500/30">
                          <p className="text-green-200 text-xs">Score</p>
                          <p className="text-white font-bold">{scoreData.scorePercentage || 0}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-purple-200 text-sm font-medium">
                            {submittedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-purple-300 text-xs">
                            {submittedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-purple-300 text-sm mt-2">
                      📋 {getTemplateName(response.templateId)}
                    </p>
                  </div>

                  {/* Answers */}
                  <div className="p-4">
                    {response.responses && response.responses.length > 0 ? (
                      <div className="space-y-3">
                        {response.responses.map((answer, index) => (
                          <div
                            key={answer._id || index}
                            className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-purple-400 font-bold text-sm shrink-0 mt-0.5">
                                Q{index + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm mb-2 font-medium">
                                  {answer.questionText || "Question text not available"}
                                </p>
                                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-2 border border-purple-500/20">
                                  <p className="text-white text-sm font-medium">
                                    {answer.selectedOption || "No answer"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-purple-300">
                        No responses recorded
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
