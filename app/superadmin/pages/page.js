"use client";
import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  FileText, 
  User, 
  Building2, 
  Calendar,
  ExternalLink,
  Filter,
  SortAsc,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function SuperadminPagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState(null);
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/superadmin/pages");
      if (!res.ok) throw new Error("Failed to fetch pages");
      const data = await res.json();
      setPages(data.pages || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch pages");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort pages
  const filteredPages = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    
    let filtered = pages.filter(page => {
      if (!query) return true;
      
      return (
        (page.heading || "").toLowerCase().includes(query) ||
        (page.subheading || "").toLowerCase().includes(query) ||
        (page.organizationName || "").toLowerCase().includes(query) ||
        (page.creatorName || "").toLowerCase().includes(query) ||
        (page.templateName || "").toLowerCase().includes(query)
      );
    });

    // Sort
    filtered = filtered.sort((a, b) => {
      if (sortBy === "name") return (a.heading || "").localeCompare(b.heading || "");
      if (sortBy === "creator") return (a.creatorName || "").localeCompare(b.creatorName || "");
      if (sortBy === "organization") return (a.organizationName || "").localeCompare(b.organizationName || "");
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return filtered;
  }, [pages, searchTerm, sortBy]);

  const handlePageClick = (page) => {
    setSelectedPage(page);
  };

  const closeModal = () => {
    setSelectedPage(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8" />
            All Pages
          </h1>
          <p className="text-gray-400">View all pages across all organizations</p>
        </div>
        
        <div className="flex items-center gap-4 bg-[#1e1b4b]/30 backdrop-blur-sm p-2 rounded-xl border border-white/5">
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Pages</p>
            <p className="text-xl font-bold text-white">{pages.length}</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Displayed</p>
            <p className="text-xl font-bold text-blue-400">{filteredPages.length}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="sticky top-24 z-30 bg-[#0f1023]/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-white/5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by headline, creator, organization, or template..."
              className="w-full bg-[#1e1b4b] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-lg shadow-black/20"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3.5 rounded-xl bg-[#1e1b4b] border border-white/10 text-gray-300 focus:outline-none focus:border-blue-500/50"
          >
            <option value="recent">Most Recent</option>
            <option value="name">Page Name (A-Z)</option>
            <option value="creator">Creator (A-Z)</option>
            <option value="organization">Organization (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-[#1e1b4b]/20 rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No pages found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {searchTerm 
              ? `We couldn't find any pages matching "${searchTerm}". Try different keywords.`
              : "No pages have been created yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <motion.div
              key={page._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handlePageClick(page)}
              className="group relative bg-[#1e1b4b]/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:bg-[#1e1b4b]/60 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
            >
              {/* Color Preview */}
              <div 
                className="h-24 relative"
                style={{ backgroundColor: page.backgroundColor || "#1e1b4b" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1e1b4b]/90" />
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/30 backdrop-blur-sm rounded-lg text-[10px] text-white font-mono">
                  {page.backgroundColor}
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Page Title */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {page.heading || "Untitled Page"}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 h-10">
                    {page.subheading || "No description"}
                  </p>
                </div>

                {/* Template Badge */}
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-md text-xs text-purple-300 font-medium">
                    {page.templateName}
                  </div>
                </div>

                {/* Creator Info */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate">{page.creatorName}</span>
                </div>

                {/* Organization Info */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="truncate">{page.organizationName}</span>
                </div>

                {/* Date */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(page.createdAt).toLocaleDateString()}
                  </div>
                  <Eye className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Page Detail Modal */}
      <AnimatePresence>
        {selectedPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1e1b4b] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Color Preview */}
              <div 
                className="h-32 relative"
                style={{ backgroundColor: selectedPage.backgroundColor || "#1e1b4b" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1e1b4b]" />
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-lg text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-8rem)]">
                {/* Page Title */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedPage.heading}
                  </h2>
                  <p className="text-gray-400">
                    {selectedPage.subheading}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Creator Info */}
                  <div className="bg-[#0f1023]/50 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Creator</h3>
                    </div>
                    <p className="text-white font-medium mb-1">{selectedPage.creatorName}</p>
                    <p className="text-sm text-gray-400 font-mono">{selectedPage.creatorEmail}</p>
                  </div>

                  {/* Organization Info */}
                  <div className="bg-[#0f1023]/50 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Building2 className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Organization</h3>
                    </div>
                    <p className="text-white font-medium mb-1">{selectedPage.organizationName}</p>
                    <p className="text-sm text-gray-400 font-mono">{selectedPage.organizationEmail}</p>
                  </div>

                  {/* Template Info */}
                  <div className="bg-[#0f1023]/50 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <FileText className="w-4 h-4 text-green-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Template</h3>
                    </div>
                    <p className="text-white font-medium">{selectedPage.templateName}</p>
                  </div>

                  {/* Dates Info */}
                  <div className="bg-[#0f1023]/50 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Calendar className="w-4 h-4 text-yellow-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Timeline</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">
                        Created: <span className="text-white">{new Date(selectedPage.createdAt).toLocaleString()}</span>
                      </p>
                      <p className="text-sm text-gray-400">
                        Updated: <span className="text-white">{new Date(selectedPage.updatedAt).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <a
                    href={`/template/${selectedPage._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Page
                  </a>
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
