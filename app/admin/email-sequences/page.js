"use client";
import { useState, useEffect } from "react";
import { 
  Mail, 
  Trash2, 
  Edit3, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Save,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function EmailSequencesAdmin() {
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    fetchSequences();
  }, []);

  const fetchSequences = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem("adminToken");
      const response = await axios.get("/api/email-sequence", {
        headers: { "x-admin-token": adminToken }
      });
      if (response.data.success) {
        setSequences(response.data.sequences);
      }
    } catch (err) {
      setError("Failed to load email sequences");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sequence) => {
    setEditingId(sequence._id);
    setEditForm({ ...sequence });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem("adminToken");
      const response = await axios.post("/api/email-sequence", 
        { ...editForm, tenantToken: adminToken },
        { headers: { "x-admin-token": adminToken } }
      );
      if (response.data.success) {
        setSequences(sequences.map(s => s._id === editingId ? response.data.sequence : s));
        setEditingId(null);
        setEditForm(null);
      }
    } catch (err) {
      setError("Failed to update sequence");
    } finally {
      setLoading(false);
    }
  };

  const addStep = () => {
    setEditForm({
      ...editForm,
      steps: [...editForm.steps, { subject: "", body: "", delay: 0, order: editForm.steps.length }]
    });
  };

  const removeStep = (index) => {
    const newSteps = editForm.steps.filter((_, i) => i !== index);
    setEditForm({
      ...editForm,
      steps: newSteps.map((step, i) => ({ ...step, order: i }))
    });
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...editForm.steps];
    newSteps[index][field] = value;
    setEditForm({ ...editForm, steps: newSteps });
  };

  if (loading && sequences.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Email Automations</h1>
          <p className="text-gray-400">Manage automated email sequences for your templates</p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
        {sequences.length === 0 ? (
          <div className="text-center py-20 bg-[#1e1b4b]/20 border-2 border-dashed border-white/5 rounded-2xl">
            <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No active sequences</h3>
            <p className="text-gray-400">Sequences are created when you publish a template with email automation.</p>
          </div>
        ) : (
          sequences.map((sequence) => (
            <div key={sequence._id} className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              {editingId === sequence._id ? (
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <input 
                      className="bg-transparent text-2xl font-bold text-white focus:outline-none border-b border-white/10 pb-1"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    />
                    <div className="flex gap-2">
                       <button 
                        onClick={() => { setEditingId(null); setEditForm(null); }}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpdate}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {editForm.steps.map((step, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/5 relative group">
                        <button 
                          onClick={() => removeStep(index)}
                          className="absolute top-4 right-4 text-gray-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <input 
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex-1 text-white focus:border-blue-500"
                            placeholder="Subject Line"
                            value={step.subject}
                            onChange={(e) => updateStep(index, 'subject', e.target.value)}
                          />
                        </div>
                        <textarea 
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 min-h-[100px] mb-4"
                          placeholder="Email Body (HTML)"
                          value={step.body}
                          onChange={(e) => updateStep(index, 'body', e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                           <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>Delay:</span>
                              <input 
                                type="number"
                                className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white"
                                value={step.delay}
                                onChange={(e) => updateStep(index, 'delay', parseInt(e.target.value) || 0)}
                              />
                           </div>
                           <select 
                             className="bg-[#0f1023] border border-white/10 rounded px-2 py-1 text-xs text-white"
                             value={step.delayUnit || "minutes"}
                             onChange={(e) => updateStep(index, 'delayUnit', e.target.value)}
                           >
                             <option value="minutes">Minutes</option>
                             <option value="hours">Hours</option>
                             <option value="days">Days</option>
                           </select>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={addStep}
                      className="w-full py-4 border-2 border-dashed border-white/5 rounded-xl text-gray-500 hover:text-blue-400 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Next Email Step
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{sequence.title}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                           <span className={sequence.isEnabled ? "text-green-400" : "text-gray-500"}>
                             {sequence.isEnabled ? "Active" : "Disabled"}
                           </span>
                           • {sequence.steps.length} Steps in sequence
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(sequence)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all shadow-sm"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                    {sequence.steps.map((step, i) => (
                      <div key={i} className="flex-shrink-0 w-64 bg-white/5 border border-white/5 rounded-xl p-4 relative">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-400/10 px-2 py-0.5 rounded">
                             STEP {i + 1}
                           </span>
                           {i > 0 && (
                             <span className="text-[10px] text-gray-500">
                               +{step.delay}{step.delayUnit === 'days' ? 'd' : step.delayUnit === 'hours' ? 'h' : 'm'}
                             </span>
                           )}
                        </div>
                        <h4 className="text-sm font-semibold text-white mb-1 truncate">{step.subject}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2">{step.body.replace(/<[^>]*>/g, '')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
