"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Send, FileText, CheckCircle, PlusCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminFeedback() {
  const [formData, setFormData] = useState({
    topic: "",
    changes: "",
    updates: "",
    feedback: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/feedback", {
        adminid: localStorage.getItem("adminToken"),
        topic: formData.topic,
        changes: formData.changes,
        updates: formData.updates,
        feedback: formData.feedback,
      });

      setSuccess("Report submitted successfully!");
      setFormData({
        topic: "",
        changes: "",
        updates: "",
        feedback: "",
      });
      setTimeout(() => {
        router.push("/admin/hero");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 rotate-3"
        >
          <FileText className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">Daily Admin Report</h1>
        <p className="text-gray-400">Submit your daily progress and system updates</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-500/10 border border-green-500/20 text-green-200 px-6 py-4 rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group"
          >
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Report Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#1e1b4b]/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
              placeholder="e.g. User Module Refactoring"
            />
          </motion.div>

          {/* Spacer or another small field could go here */}
        </div>

        {[
          { label: "Changes Implemented", name: "changes", placeholder: "Detail the code changes or refactoring done today..." },
          { label: "New Updates / Features", name: "updates", placeholder: "List any new features added to the platform..." },
          { label: "General Feedback / Notes", name: "feedback", placeholder: "Any blockers, suggestions, or additional notes..." }
        ].map((field, i) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
             <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{field.label}</label>
             <textarea
               name={field.name}
               value={formData[field.name]}
               onChange={handleChange}
               className="w-full px-4 py-3 bg-[#1e1b4b]/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[120px] resize-none"
               required={field.name !== 'feedback'}
               placeholder={field.placeholder}
             />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                Submit Daily Report
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
