"use client";
import { useEffect, useState, useMemo } from "react";
import { 
  Download, 
  Filter, 
  Search, 
  FileText,
  Building2,
  ChevronDown,
  Clock,
  Eye,
  X,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// Helper to download CSV
const downloadCSV = (data, filename) => {
  if (!data || !data.length) {
    toast.error("No data to export");
    return;
  }

  const headers = [
    "User Name",
    "User Email",
    "User Phone",
    "Organization",
    "Template",
    "Page Headline",
    "Submitted At",
    "Questions & Answers"
  ];

  const csvRows = [headers.join(",")];

  data.forEach(row => {
    const questionsAnswers = (row.responses || [])
      .map((r, i) => `Q${i + 1}: ${r.questionText || r.question || 'N/A'} | A: ${r.selectedOption || r.answer || 'N/A'}`)
      .join(" | ");
    
    const values = [
      `"${row.userName || 'Unknown'}"`,
      `"${row.userEmail || 'No Email'}"`,
      `"${row.userPhone || 'No Phone'}"`,
      `"${row.tenantName || 'Unknown'}"`,
      `"${row.templateName || 'Unknown'}"`,
      `"${row.contentHeading || 'Untitled'}"`,
      `"${new Date(row.submittedAt).toLocaleString()}"`,
      `"${questionsAnswers}"`
    ];
    csvRows.push(values.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename || "responses-export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function AdminResponsesDashboard() {
  const [data, setData] = useState({
    responses: [],
    stats: {},
    filters: { tenants: [], contents: [], templates: [] }
  });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  
  // Filters
  const [selectedTemplate, setSelectedTemplate] = useState("all");
  const [selectedTenant, setSelectedTenant] = useState("all");
  const [selectedContent, setSelectedContent] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []); // Initial load

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams({ all: "true" });
      if (selectedTemplate !== "all") params.append("templateId", selectedTemplate);
      if (selectedTenant !== "all") params.append("tenant", selectedTenant);
      if (selectedContent !== "all") params.append("contentId", selectedContent);
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);
      
      const [res, templatesRes] = await Promise.all([
        fetch(`/api/responses?${params.toString()}`, { headers: { "x-superadmin": "true" } }),
        fetch(`/api/templates?all=true`, { headers: { "x-superadmin": "true" } })
      ]);

      const Data = await res.json();
      const templatesData = await templatesRes.json();

      if (Data.success) {
        setData(Data);
        setTemplates(templatesData.templates || []);
      } else {
        toast.error(Data.message || "Failed to load data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchData();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSelectedTemplate("all");
    setSelectedTenant("all");
    setSelectedContent("all");
    setDateRange({ start: "", end: "" });
    setSearchTerm("");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Helper to format response data for display/export
  const flattenedData = useMemo(() => {
    const flattened = [];
    (data.responses || []).forEach(r => {
      const userName = r.userId?.fullName || r.userInfo?.name || "Guest";
      const userEmail = r.userId?.email || r.userInfo?.email || "No Email";
      const userPhone = r.userInfo?.password || "No Phone";
      const templateName = r.templateId?.name || "Unknown Template";
      const tenantName = r.tenantName || "Unknown";
      const pageTitle = r.contentInfo?.heading || "Untitled Page";
      const submittedAt = r.createdAt || r.submittedAt;

      (r.responses || []).forEach(resp => {
        flattened.push({
          _id: `${r._id}-${resp._id || Math.random()}`,
          originalResponse: r,
          userName,
          userEmail,
          userPhone,
          templateName,
          tenantName,
          pageTitle,
          submittedAt,
          question: resp.questionText || resp.question || "Unknown Question",
          answer: resp.selectedOption || resp.answer || "No Response"
        });
      });
    });

    // Apply filters and search
    return flattened.filter(r => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        r.userName.toLowerCase().includes(q) ||
        r.userEmail.toLowerCase().includes(q) ||
        r.pageTitle.toLowerCase().includes(q) ||
        r.tenantName.toLowerCase().includes(q) ||
        r.question.toLowerCase().includes(q)
      );
    });
  }, [data.responses, searchTerm]);

  const stats = data.stats || { totalResponses: 0, totalUsers: 0 };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Viewer Responses</h1>
          <p className="text-gray-400">Detailed table of all visitor answers and information.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button
             onClick={() => setShowFilters(!showFilters)}
             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
               showFilters ? "bg-blue-600 text-white" : "bg-[#1e1b4b] border border-white/10 text-gray-300 hover:text-white"
             }`}
           >
             <Filter className="w-4 h-4" />
             Filters
           </button>
           <button
             onClick={() => downloadCSV(data.responses, `responses-${new Date().toISOString().split('T')[0]}.csv`)}
             className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
           >
             <Download className="w-4 h-4" />
             Export CSV
           </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <div className="bg-[#1e1b4b] border border-white/10 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Template
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full appearance-none bg-[#0f1023] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="all">All Templates</option>
                      {templates.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Organization
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTenant}
                      onChange={(e) => setSelectedTenant(e.target.value)}
                      className="w-full appearance-none bg-[#0f1023] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="all">All Organizations</option>
                      {(data.filters?.tenants || []).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Page Heading
                  </label>
                  <div className="relative">
                    <select
                      value={selectedContent}
                      onChange={(e) => setSelectedContent(e.target.value)}
                      className="w-full appearance-none bg-[#0f1023] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="all">All Pages</option>
                      {(data.filters?.contents || []).map(c => (
                        <option key={c._id || c} value={c._id || c}>{c.heading || c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-full bg-[#0f1023] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-full bg-[#0f1023] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responses Table */}
      <div className="bg-[#1e1b4b]/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <h3 className="text-lg font-bold text-white">Detailed Response Log ({flattenedData.length})</h3>
           <div className="relative max-w-md w-full md:w-auto">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
             <input
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Search by name, email, org, page, or question..."
               className="w-full bg-[#0f1023] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
             />
           </div>
        </div>

        {loading ? (
           <div className="py-20 flex justify-center">
             <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
           </div>
        ) : flattenedData.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400">No response data found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f1023]/50 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-4">Organisation</th>
                  <th className="px-6 py-4">Template</th>
                  <th className="px-6 py-4">Page Title</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email / Phone</th>
                  <th className="px-6 py-4">Question</th>
                  <th className="px-6 py-4">Response</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {flattenedData.map((row) => (
                  <tr key={row._id} className="text-sm text-gray-300 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-medium text-blue-400">{row.tenantName}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {row.templateName}
                    </td>
                    <td className="px-6 py-4 truncate max-w-[150px]" title={row.pageTitle}>
                      {row.pageTitle}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{row.userName}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{new Date(row.submittedAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">{row.userEmail}</div>
                      <div className="text-xs text-gray-500">{row.userPhone}</div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] italic">
                      {row.question}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                        {row.answer}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedResponse(row.originalResponse)}
                        className="p-2 bg-white/5 hover:bg-blue-600 rounded-lg transition-all text-gray-400 hover:text-white"
                        title="View Full Submission"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Response Detail Modal */}
      <AnimatePresence>
        {selectedResponse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedResponse(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1e1b4b] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 text-white relative">
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold mb-2">Full Submission Details</h2>
                <p className="text-white/80 text-sm">Submitted on {new Date(selectedResponse.createdAt || selectedResponse.submittedAt).toLocaleString()}</p>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Meta Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#0f1023] rounded-2xl p-4 border border-white/5">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Context</h3>
                    <div className="space-y-2">
                       <div className="flex justify-between">
                         <span className="text-gray-400 text-xs">Organisation:</span>
                         <span className="text-white text-xs font-medium">{selectedResponse.tenantName}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-400 text-xs">Template:</span>
                         <span className="text-white text-xs font-medium">{selectedResponse.templateId?.name || "N/A"}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-400 text-xs">Page:</span>
                         <span className="text-white text-xs font-medium">{selectedResponse.contentInfo?.heading || "N/A"}</span>
                       </div>
                    </div>
                  </div>
                  <div className="bg-[#0f1023] rounded-2xl p-4 border border-white/5">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Visitor</h3>
                    <div className="space-y-2">
                       <div className="flex justify-between">
                         <span className="text-gray-400 text-xs">Name:</span>
                         <span className="text-white text-xs font-medium">{selectedResponse.userId?.fullName || selectedResponse.userInfo?.name || "Guest"}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-400 text-xs">Email:</span>
                         <span className="text-white text-xs font-medium">{selectedResponse.userId?.email || selectedResponse.userInfo?.email || "N/A"}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-400 text-xs">Phone:</span>
                         <span className="text-white text-xs font-medium">{selectedResponse.userInfo?.password || "N/A"}</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Questions & Answers */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white mb-4">Complete Questionnaire</h3>
                  {selectedResponse.responses && selectedResponse.responses.length > 0 ? (
                    <div className="grid gap-3">
                      {selectedResponse.responses.map((resp, index) => (
                        <div key={index} className="bg-[#0f1023] rounded-xl p-4 border border-white/5 hover:border-blue-500/30 transition-all">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-white font-medium">{resp.questionText || resp.question || `Question ${index + 1}`}</p>
                              <p className="text-sm text-blue-300 bg-blue-500/10 inline-block px-3 py-1 rounded-lg">
                                {resp.selectedOption || resp.answer || "No response"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-[#0f1023] rounded-3xl border border-dashed border-white/5">
                      <p className="text-gray-500">No response data available</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

