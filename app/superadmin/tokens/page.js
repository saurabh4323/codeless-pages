"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Key, 
  Calendar,
  Building2,
  Mail,
  X
} from "lucide-react";
import toast from "react-hot-toast";

export default function SuperAdminTokensPage() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    tenantName: "",
    adminEmail: "",
    expiresAt: ""
  });

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/superadmin/tokens");
      if (response.data.success) {
        setTokens(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
      toast.error("Failed to fetch tokens");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateToken = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await axios.post("/api/superadmin/tokens", formData);
      if (response.data.success) {
        toast.success("Token created successfully!");
        setFormData({ tenantName: "", adminEmail: "", expiresAt: "" });
        setShowCreateForm(false);
        fetchTokens();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create token");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteToken = async (tokenId) => {
    if (!confirm("Are you sure you want to delete this token? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await axios.delete("/api/superadmin/tokens", {
        data: { tokenId }
      });
      if (response.data.success) {
        toast.success("Token deleted successfully");
        fetchTokens();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete token");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-[#1e1b4b] border border-blue-500/20 text-white px-4 py-2 rounded-lg flex items-center shadow-lg`}>
        <Check className="w-4 h-4 text-green-400 mr-2" />
        Token copied to clipboard!
      </div>
    ));
  };

  // Filter tokens
  const filteredTokens = tokens.filter(token => 
    token.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.adminEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Token Management</h1>
          <p className="text-gray-400">Generate and manage secure access tokens for client tenants.</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
            showCreateForm 
              ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
              : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20 hover:shadow-blue-500/30"
          }`}
        >
          {showCreateForm ? (
            <>
               <X className="w-5 h-5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Generate Token</span>
            </>
          )}
        </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <div className="bg-[#1e1b4b]/50 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6 md:p-8 mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Key className="w-5 h-5 text-blue-400" />
                </div>
                New Admin Token
              </h3>
              <form onSubmit={handleCreateToken} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Client / Tenant Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.tenantName}
                        onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="e.g. Acme Corp"
                        required
                      />
                      <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Admin Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="admin@example.com"
                        required
                      />
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Expiry Date (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]"
                    />
                    <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Generate Secure Token
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e1b4b]/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 flex flex-col justify-center">
          <p className="text-gray-400 text-sm font-medium">Total Active Tokens</p>
          <p className="text-4xl font-bold text-white mt-2">{tokens.length}</p>
        </div>
        <div className="md:col-span-2 bg-[#1e1b4b]/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 flex items-center">
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by tenant name or email..."
              className="w-full bg-[#0f1023] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tokens List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading digital keys...</p>
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="bg-[#1e1b4b]/30 rounded-2xl border border-white/5 p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-300 text-lg font-medium">No tokens found</p>
            <p className="text-gray-500 text-sm mt-1">
              {searchTerm ? "Try adjusting your search terms" : "Get started by generating your first token"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTokens.map((token, index) => (
              <motion.div
                key={token._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-[#1e1b4b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:bg-[#1e1b4b]/60 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      token.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white">{token.tenantName}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          token.isActive 
                            ? "bg-green-500/10 text-green-400 border-green-500/20" 
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {token.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          {token.adminEmail}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Created: {new Date(token.createdAt).toLocaleDateString()}
                        </span>
                        {token.expiresAt && (
                          <span className="flex items-center gap-1.5 text-orange-400/80">
                            <Calendar className="w-3.5 h-3.5" />
                            Expires: {new Date(token.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-center w-full md:w-auto gap-3">
                    <div className="flex items-center gap-2 bg-[#0f1023] rounded-lg p-1.5 border border-white/10 group-hover:border-blue-500/30 transition-colors max-w-full md:max-w-xs">
                      <code className="text-xs font-mono text-blue-200/80 px-2 truncate block w-40 md:w-48">
                        {token.token}
                      </code>
                      <button
                        onClick={() => copyToClipboard(token.token)}
                        className="p-1.5 hover:bg-blue-600 rounded-md text-gray-400 hover:text-white transition-colors shrink-0"
                        title="Copy Token"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteToken(token._id)}
                      className="flex items-center justify-center md:justify-end gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full md:w-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Revoke Access
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}