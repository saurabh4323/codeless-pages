"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import apiClient from "@/utils/apiClient";
import { motion } from "framer-motion";
import useAdminAuth from "@/utils/useAdminAuth";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  HelpCircle, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

export default function AdminHome() {
  const { loading: authLoading, admin, error: authError } = useAdminAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    activeTemplates: 0,
    pendingUploads: 0,
    totalResponses: 0,
    totalQuestions: 0,
    monthlyGrowth: 0,
    avgResponseRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!admin) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          usersResponse,
          templatesResponse,
          statsResponse,
          activitiesResponse,
          responsesResponse,
          questionsResponse,
        ] = await Promise.all([
          apiClient.get("/api/admin/users").catch(() => ({ data: { users: [] } })),
          apiClient.get("/api/admin/templatecreate").catch(() => ({ data: { data: [] } })),
          apiClient.get("/api/admin/dashboard/stats").catch(() => ({
            data: { pendingApprovals: 0, pendingUploads: 0 },
          })),
          apiClient.get("/api/admin/dashboard/activities").catch(() => ({ data: [] })),
          apiClient.get("/api/user/responses?admin=true").catch(() => ({ data: { data: [] } })),
          apiClient.get("/api/admin/questions").catch(() => ({ data: { data: [] } })),
        ]);

        const totalUsers = usersResponse.data.users?.length || 0;
        const totalResponses = responsesResponse.data.data?.length || 0;

        setStats({
          totalUsers,
          activeTemplates: templatesResponse.data.data?.length || 0,
          pendingApprovals: statsResponse.data.pendingApprovals || 0,
          pendingUploads: statsResponse.data.pendingUploads || 0,
          totalResponses,
          totalQuestions: questionsResponse.data.data?.length || 0,
          monthlyGrowth: 12, // Placeholder
          avgResponseRate: totalUsers > 0 ? Math.round((totalResponses / totalUsers) * 100) : 0,
        });

        setRecentActivities(activitiesResponse.data || []);
      } catch (error) {
        setError("Error loading data. Backend might be offline.");
        console.error("Fetch dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [admin]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-blue-200 animate-pulse font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (authError || error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Connection Error</h3>
          <p className="text-red-200/80">{authError || error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Head>
        <title>Dashboard | Admin Panel</title>
      </Head>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-blue-200/60 text-lg">
            Welcome back, {admin?.name || "Admin"}. Here is what is happening today.
          </p>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-semibold flex items-center gap-1">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             System Online
           </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          trend="+12%" 
          color="blue" 
          href="/admin/users"
        />
        <StatsCard 
          title="Active Templates" 
          value={stats.activeTemplates} 
          icon={FileText} 
          trend="Active" 
          color="green" 
          href="/admin/tempall"
        />
        <StatsCard 
          title="Total Responses" 
          value={stats.totalResponses} 
          icon={MessageSquare} 
          trend={`${stats.avgResponseRate}% Rate`} 
          color="purple" 
          href="/admin/responses"
        />
        <StatsCard 
          title="Pending Actions" 
          value={stats.pendingApprovals + stats.pendingUploads} 
          icon={Clock} 
          trend="Review" 
          color="orange" 
          href="/admin/feedback"
        />
      </motion.div>

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Area (Placeholder for now) */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           className="lg:col-span-2 bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/5 rounded-3xl p-6 h-[400px] flex flex-col relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all duration-700 group-hover:bg-blue-500/20" />
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Platform Growth
            </h3>
            <select className="bg-[#0f1023] border border-white/10 text-xs text-gray-400 rounded-lg px-2 py-1 outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2 relative z-10">
            {/* Fake bars for visualization */}
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="w-full bg-blue-500/10 rounded-t-xl relative group/bar hover:bg-blue-500/20 transition-all cursor-pointer">
                 <div 
                   className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-xl transition-all duration-1000"
                   style={{ height: `${h}%` }}
                 />
                 <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-lg transition-all">
                   {h * 10}
                 </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-blue-200/40 px-4 mt-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.3 }}
           className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Recent Activity
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{activity.title || "System Update"}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.description || "Activity details..."}</p>
                    <p className="text-[10px] text-gray-600 mt-2">{new Date(activity.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
               <div className="text-center py-10 text-gray-500">
                 <p>No recent activities</p>
               </div>
            )}
          </div>
          
          <Link href="/admin/feedback" className="mt-4 text-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View All Reports →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, trend, color, href }) {
  const colors = {
    blue: "from-blue-600 to-indigo-600",
    green: "from-emerald-500 to-green-600",
    purple: "from-purple-600 to-fuchsia-600",
    orange: "from-orange-500 to-red-500",
  };

  return (
    <Link href={href}>
      <div className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-all duration-300 relative overflow-hidden">
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
          <Icon className="w-24 h-24" />
        </div>
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg shadow-${color}-500/20 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/5 text-white/60 border border-white/5">
            {trend}
          </span>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
            {value}
          </h3>
          <p className="text-sm text-blue-200/60 font-medium tracking-wide uppercase">{title}</p>
        </div>
      </div>
    </Link>
  );
}
