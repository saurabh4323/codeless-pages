"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import {
  FileText,
  Plus,
  Edit,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Crown,
  Mail,
  Loader2,
  Trash2,
  Filter
} from "lucide-react";
import apiClient from "@/utils/apiClient";
import { motion, AnimatePresence } from "framer-motion";

export default function TemplateList() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    fetchTemplates();
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = () => {
    const premiumStatus = localStorage.getItem("premium");
    setIsPremium(premiumStatus === "true");
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/admin/templatecreate");
      if (response.data.success) {
        setTemplates(response.data.data || []);
      } else {
        setError("Failed to fetch templates");
      }
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError("An error occurred while fetching templates");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    if (isPremium) {
      router.push("/admin/temp");
    } else {
      setShowPremiumModal(true);
    }
  };

  const filteredTemplates = templates?.filter((template) => {
    const matchesSearch =
      template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && template.status === filterStatus;
  }) || [];

  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20", icon: Clock },
      published: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20", icon: CheckCircle },
      archived: { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20", icon: XCircle },
    };
    const style = badges[status] || badges.draft;
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-blue-200 animate-pulse font-medium">Loading Templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <Head>
        <title>Templates | Admin Dashboard</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" />
            Template Management
          </h1>
          <p className="text-gray-400">Create, edit, and manage your templates</p>
        </div>
        
        <button
          onClick={handleCreateTemplate}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Template
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-200 flex items-center gap-3">
          <XCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        
        <div className="relative w-full md:w-64">
           <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
           <select
             value={filterStatus}
             onChange={(e) => setFilterStatus(e.target.value)}
             className="w-full pl-12 pr-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
           >
             <option value="all">All Statuses</option>
             <option value="draft">Drafts</option>
             <option value="published">Published</option>
             <option value="archived">Archived</option>
           </select>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-20 bg-[#1e1b4b]/20 border border-white/5 rounded-2xl border-dashed">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">No templates found</h3>
          <p className="text-gray-400 text-sm">Get started by creating a new template.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTemplates.map((template) => (
              <motion.div
                key={template._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#1e1b4b]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 hover:bg-[#1e1b4b]/60 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                    {template.name.charAt(0).toUpperCase()}
                  </div>
                  {getStatusBadge(template.status)}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-1">
                  {template.name}
                </h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">
                  {template.description || "No description provided."}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(template.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  
                  <button
                    onClick={() => {
                      if (isPremium) {
                        router.push(`/admin/tempall/${template._id}`);
                      } else {
                        setShowPremiumModal(true);
                      }
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-white transition-colors"
                  >
                    Edit Template
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1e1b4b] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20 rotate-3">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Premium Feature</h3>
                <p className="text-blue-200/60 text-sm">
                  Upgrade to unlock unlimited template creation and advanced customization features.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
                <h4 className="text-sm font-semibold text-yellow-400 mb-3 uppercase tracking-wider">Premium Benefits</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" /> Unlimited Templates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" /> Advanced Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" /> Priority Support
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowPremiumModal(false);
                    router.push("/user/contact");
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 rounded-xl text-white font-bold shadow-lg shadow-orange-500/20 transition-all"
                >
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
