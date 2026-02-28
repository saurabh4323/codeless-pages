"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, FileText, X, ChevronRight, ShieldCheck, Mail, Calendar } from "lucide-react";

export default function OrganizationDetailsPage() {
  const { token } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "admins");
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userContent, setUserContent] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admins`, {
        headers: { "x-admin-token": decodeURIComponent(token) },
      });
      if (!res.ok) throw new Error("Failed to fetch admins");
      const data = await res.json();
      setAdmins(data.admins || []);
      setError("");
    } catch (e) {
      console.error(e);
      setError("Failed to fetch admins.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/superadmin/organization/${token}/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users || []);
      setError("");
    } catch (e) {
      console.error(e);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      if (activeTab === "admins") {
        fetchAdmins();
      } else {
        fetchUsers();
      }
    }
  }, [token, activeTab, fetchAdmins, fetchUsers]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setContentLoading(true);
    try {
      const res = await fetch(`/api/superadmin/user/${user._id}/content`);
      if (!res.ok) throw new Error("Failed to fetch user content");
      const data = await res.json();
      setUserContent(data.content || []);
    } catch (e) {
      console.error(e);
      // Handle error visually if needed
    } finally {
      setContentLoading(false);
    }
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setUserContent([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Organization Details</h1>
          <p className="text-blue-200/60 text-sm mt-1 font-mono">{token}</p>
        </div>
        <Link 
          href="/superadmin/organization" 
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-blue-200 rounded-lg transition-colors text-sm font-medium"
        >
          ← Back to Organizations
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/5 p-1 rounded-xl w-fit border border-white/10">
        <button
          onClick={() => setActiveTab("admins")}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "admins" 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
              : "text-blue-200 hover:text-white hover:bg-white/5"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Admins
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "users" 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
              : "text-blue-200 hover:text-white hover:bg-white/5"
          }`}
        >
          <Users className="w-4 h-4" />
          Users
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-400 mb-2 font-medium">{error}</div>
            <button 
              onClick={activeTab === "admins" ? fetchAdmins : fetchUsers}
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Try Again
            </button>
          </div>
        ) : activeTab === "admins" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                      No admins found for this organization.
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                            {(admin.fullName || admin.name || "A").charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{admin.fullName || admin.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-mono text-sm">{admin.email}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{admin.phone || "—"}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                      No users found for this organization.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr 
                      key={user._id} 
                      onClick={() => handleUserClick(user)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">
                            {(user.fullName || "U").charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white font-medium group-hover:text-blue-400 transition-colors">
                            {user.fullName || "Unknown User"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-mono text-sm">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.validated 
                            ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                            : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }`}>
                          {user.validated ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-500 hover:text-white transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Content Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeUserModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1e1b4b] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0f1023]">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                      {(selectedUser.fullName || "U").charAt(0).toUpperCase()}
                   </div>
                   <div>
                      <h2 className="text-xl font-bold text-white">{selectedUser.fullName}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedUser.email}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={closeUserModal}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1 bg-[#0f1023]/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  {"Created Pages & Content"}
                </h3>
                
                {contentLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                ) : userContent.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No content created by this user yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userContent.map((content) => (
                      <div key={content._id} className="group bg-[#1e1b4b] border border-white/10 rounded-xl p-4 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                        <div className="flex justify-between items-start mb-3">
                           <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                              <FileText className="w-5 h-5" />
                           </div>
                           <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                             {content.templateId?.name || "Template"}
                           </span>
                        </div>
                        <h4 className="text-white font-medium mb-1 truncate" title={content.heading}>
                          {content.heading || "Untitled Page"}
                        </h4>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
                          {content.subheading || "No description provided"}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-3">
                          <span>Updated: {new Date(content.updatedAt).toLocaleDateString()}</span>
                          {/* Add a preview link if applicable */}
                          {/* <a href="#" className="text-blue-400 hover:underline">Preview</a> */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}