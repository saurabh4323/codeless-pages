"use client";
import { useEffect, useMemo, useState } from "react";
import { 
  Search, 
  Building2, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  RefreshCw, 
  Power,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function TokenChip({ token }) {
  const [copied, setCopied] = useState(false);

  const copy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(token || "");
      setCopied(true);
      toast.success("Token copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="flex items-center gap-2 bg-[#0f1023] rounded-lg p-1.5 border border-white/10 group-hover:border-blue-500/30 transition-colors max-w-full">
      <code className="flex-1 text-xs font-mono text-blue-200/80 px-2 truncate">
        {token}
      </code>
      <button
        onClick={copy}
        className="p-1.5 hover:bg-blue-600 rounded-md text-gray-400 hover:text-white transition-colors shrink-0"
        title="Copy Token"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function OrgCard({ org, matchingPages = [], onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(matchingPages.length > 0);
  const [showActions, setShowActions] = useState(false);

  // Auto-expand if there are matching pages from search
  useEffect(() => {
    if (matchingPages.length > 0) {
      setExpanded(true);
    }
  }, [matchingPages.length]);

  const handleResetToken = async () => {
    if (!confirm("Are you sure you want to reset the token? This will invalidate the existing token.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/organizations/${org.id}/reset-token`, {
        method: "POST",
        headers: { "x-superadmin": "true" },
      });
      if (!res.ok) throw new Error("Failed to reset token");
      const data = await res.json();
      onUpdate({ ...org, token: data.newToken });
      toast.success("Token reset successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setShowActions(false);
    }
  };

  const handleToggleStatus = async () => {
    const action = org.isActive ? "pause" : "activate";
    if (!confirm(`Are you sure you want to ${action} this organization?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/organizations/${org.id}/toggle-status`, {
        method: "PATCH",
        headers: { "x-superadmin": "true" },
      });
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      onUpdate({ ...org, isActive: data.isActive });
      toast.success(`Organization ${action}d successfully`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setShowActions(false);
    }
  };

  const handleCardClick = () => {
    // Open admin tab (default)
    window.open(`/superadmin/organization/${org.token}`, '_blank');
    // Open users tab
    window.open(`/superadmin/organization/${org.token}?tab=users`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      onClick={handleCardClick}
      className={`group relative bg-[#1e1b4b]/40 backdrop-blur-sm border ${
        matchingPages.length > 0 ? "border-blue-500/50 bg-blue-900/10" : "border-white/5"
      } rounded-2xl overflow-hidden hover:bg-[#1e1b4b]/60 transition-all duration-300 cursor-pointer`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              org.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            }`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {org.name}
                {matchingPages.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] uppercase font-bold tracking-wider">
                    Match Found
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-400">{org.adminEmail}</p>
            </div>
          </div>
          
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-[#1e1b4b] border border-white/10 rounded-xl shadow-xl z-20 py-1 overflow-hidden"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetToken();
                    }}
                    disabled={loading}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/5 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Token
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus();
                    }}
                    disabled={loading}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                      org.isActive ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    {org.isActive ? "Pause Account" : "Activate Account"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4">
          <div onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Access Token</p>
            <TokenChip token={org.token} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
             <div className="flex items-center gap-4 text-xs text-gray-500">
               <span>Pages: {org.pages?.length || 0}</span>
               {org.expiresAt && (
                 <span>Expires: {new Date(org.expiresAt).toLocaleDateString()}</span>
               )}
             </div>
             <div className="flex items-center gap-2">
               <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                  org.isActive 
                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  {org.isActive ? 'Active' : 'Paused'}
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* Pages Section - Expandable */}
      {(org.pages?.length > 0 || matchingPages.length > 0) && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`bg-[#0f1023]/30 border-t border-white/5 transition-all duration-300 ${expanded ? "max-h-[500px]" : "max-h-0"} overflow-hidden`}
        >
          <div className="p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              {matchingPages.length > 0 ? "Matching Pages" : "Organization Pages"}
            </p>
            {(matchingPages.length > 0 ? matchingPages : org.pages).slice(0, 5).map((page) => (
              <div key={page._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group/page">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 font-medium group-hover/page:text-white transition-colors">
                      {page.name || "Untitled Page"}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      /{page.slug || page._id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover/page:opacity-100 transition-opacity">
                  <span className={`px-1.5 py-0.5 text-[10px] rounded border ${
                    page.status === 'published' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {page.status}
                  </span>
                  <a 
                    href={`/template/${page._id}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
            {(matchingPages.length > 0 ? matchingPages : org.pages).length > 5 && (
              <p className="text-xs text-center text-gray-500 py-1">
                +{(matchingPages.length > 0 ? matchingPages : org.pages).length - 5} more pages
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Expand/Collapse Toggle */}
      {org.pages?.length > 0 && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="w-full py-1 bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors text-xs"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      )}
    </motion.div>
  );
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Parallel fetch
        const [orgsRes, templatesRes] = await Promise.all([
          fetch(`/api/organizations`, { headers: { "x-superadmin": "true" } }),
          fetch(`/api/templates?all=true`, { headers: { "x-superadmin": "true" } })
        ]);
        
        const orgData = await orgsRes.json();
        const templateData = await templatesRes.json();
        
        // Process data
        const allTemplates = templateData.templates || [];
        const allOrgs = (orgData.organizations || []).map(org => ({
          ...org,
          pages: allTemplates.filter(t => t.tenantToken === org.token)
        }));
        
        setOrganizations(allOrgs);
        setTemplates(allTemplates);
      } catch (e) {
        console.error(e);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOrgUpdate = (updatedOrg) => {
    setOrganizations(prev => prev.map(o => o.id === updatedOrg.id ? { ...updatedOrg, pages: o.pages } : o));
  };

  // Filter and Sort
  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    
    // First, find matching pages
    const matchingPageMap = new Map(); // OrgID -> [Matching Pages]
    
    if (q) {
      templates.forEach(t => {
        if ((t.name || "").toLowerCase().includes(q)) {
          // Find which org owns this template
          const org = organizations.find(o => o.token === t.tenantToken);
          if (org) {
            const current = matchingPageMap.get(org.id) || [];
            matchingPageMap.set(org.id, [...current, t]);
          }
        }
      });
    }

    let filtered = organizations.filter(o => {
      // If searching, check for org match OR page match
      if (!q) return true;
      
      const orgMatches = 
        (o.name || "").toLowerCase().includes(q) ||
        (o.token || "").toLowerCase().includes(q) ||
        (o.adminEmail || "").toLowerCase().includes(q);
        
      const hasMatchingPages = matchingPageMap.has(o.id);
      
      return orgMatches || hasMatchingPages;
    });

    // Sort
    filtered = filtered.sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "pages") return (b.pages?.length || 0) - (a.pages?.length || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return { filtered, matchingPageMap };
  }, [organizations, templates, searchTerm, sortBy]);
  
  const { filtered, matchingPageMap } = filteredData;
  const total = organizations.length;
  const active = organizations.filter((o) => o.isActive).length;
  const totalPages = templates.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Organizations</h1>
          <p className="text-gray-400">View and manage all tenant organizations and their content.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-[#1e1b4b]/30 backdrop-blur-sm p-2 rounded-xl border border-white/5">
           <div className="px-4 py-2">
             <p className="text-xs text-gray-500 uppercase tracking-wider">Total Orgs</p>
             <p className="text-xl font-bold text-white">{total}</p>
           </div>
           <div className="w-px h-8 bg-white/10" />
           <div className="px-4 py-2">
             <p className="text-xs text-gray-500 uppercase tracking-wider">Active</p>
             <p className="text-xl font-bold text-green-400">{active}</p>
           </div>
           <div className="w-px h-8 bg-white/10" />
           <div className="px-4 py-2">
             <p className="text-xs text-gray-500 uppercase tracking-wider">Total Pages</p>
             <p className="text-xl font-bold text-blue-400">{totalPages}</p>
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
              placeholder="Search organizations, emails, or page titles (Reverse Lookup)..."
              className="w-full bg-[#1e1b4b] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-lg shadow-black/20"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3.5 rounded-xl bg-[#1e1b4b] border border-white/10 text-gray-300 focus:outline-none focus:border-blue-500/50"
          >
            <option value="recent">Most Recent</option>
            <option value="name">Name (A-Z)</option>
            <option value="pages">Most Pages</option>
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
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            We couldn't find any organizations or pages matching "{searchTerm}". Try checking for typos or use different keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((org) => (
            <OrgCard 
              key={org.id} 
              org={org} 
              matchingPages={matchingPageMap.get(org.id) || []}
              onUpdate={handleOrgUpdate} 
            />
          ))}
        </div>
      )}
    </div>
  );
}