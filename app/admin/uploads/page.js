"use client";
import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  RefreshCw,
  Zap,
  TrendingUp,
  FileText,
  User,
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/utils/apiClient"; // Assuming usage of apiClient

const AdminContentDashboard = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/upload");
      const data = await response.json();

      if (data.success) {
        setContents(data.content || []);
      } else {
        setError(data.message || "Failed to fetch contents");
      }
    } catch (err) {
      setError("Failed to fetch contents");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contentId) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      setDeleteLoading(contentId);
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId }),
      });
      const data = await response.json();

      if (data.success) {
        setContents(contents.filter((c) => c._id !== contentId));
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      alert("Failed to delete content");
    } finally {
      setDeleteLoading(null);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchContents();
    setRefreshing(false);
  };

  const filteredContents = contents.filter(
    (c) =>
      c.heading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subheading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-blue-200 animate-pulse font-medium">Loading Content...</p>
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
             <FileText className="w-8 h-8 text-blue-400" />
             Content Management
          </h1>
          <p className="text-gray-400">Manage user uploaded content and data</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => (window.location.href = "/admin/content/add")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 font-bold"
          >
            <Plus className="w-4 h-4" />
            Add Content
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard icon={FileText} title="Total Content" value={contents.length} color="blue" />
        <StatsCard 
          icon={TrendingUp} 
          title="Recent Update" 
          value={contents.length ? new Date(contents[0].updatedAt).toLocaleDateString() : "N/A"} 
          color="purple" 
        />
        <StatsCard 
          icon={Zap} 
          title="Active Templates" 
          value={new Set(contents.map(c => c.templateId?._id)).size} 
          color="green" 
        />
      </div>

      {/* Search */}
      <div className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2">
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {filteredContents.length === 0 ? (
            <div className="text-center py-20 bg-[#1e1b4b]/20 border border-white/5 rounded-2xl border-dashed">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No content found</p>
            </div>
          ) : (
            filteredContents.map((content) => (
              <motion.div
                key={content._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:bg-[#1e1b4b]/50 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center border border-white/5">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                        {content.heading || "Untitled Content"}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2 max-w-2xl line-clamp-1">
                        {content.subheading || "No description"}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {content.createdBy || "Unknown"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(content.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-400 font-mono">
                          ID: {content._id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => window.location.href = `/edit/${content._id}`}
                      className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(content._id)}
                      disabled={deleteLoading === content._id}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      {deleteLoading === content._id ? <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function StatsCard({ icon: Icon, title, value, color }) {
  const colors = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20"
  };
  
  return (
    <div className={`rounded-2xl p-6 border ${colors[color].split(" ")[2]} bg-[#1e1b4b]/40 backdrop-blur-xl relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
      <div className="flex items-center gap-4 relative z-10">
        <div className={`p-3 rounded-xl ${colors[color]} ${colors[color].split(" ")[1]}`}>
          <Icon className={`w-6 h-6 ${colors[color].split(" ")[0]}`} />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${colors[color].split(" ")[1]} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />
    </div>
  );
}

export default AdminContentDashboard;
