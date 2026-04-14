"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../../Header";
import TemplatePreviewer from "./TemplatePreviewer";
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  Type,
  Eye,
  Save,
  Palette,
  Settings,
  Upload,
  X,
  Trash2,
  Plus,
  Clock
} from "lucide-react";

export default function ContentUploadPage({ params }) {
  const router = useRouter();
  const { templateId } = React.use(params);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    backgroundColor: "#ffffff",
    askUserDetails: false,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [userId, setUserId] = useState(null);
  const [usertoken, setUsertoken] = useState(null);
  
  // Email Sequence State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [emailSteps, setEmailSteps] = useState([
    { subject: "", body: "", delay: 0, delayUnit: "minutes", order: 0 }
  ]);

  const fetchTemplateDetails = useCallback(async () => {
    try {
      setLoading(true);
      const userToken = localStorage.getItem("userid");
      const response = await fetch(`/api/templatecreate/${templateId}`, {
        headers: { 'x-user-token': userToken || '' }
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch");
      
      setTemplate(data.data);
      
      // Initialize dynamic sections
      const initialSections = {};
      data.data.sections?.forEach(s => {
        initialSections[s.id] = "";
      });
      
      setFormData(prev => ({ ...prev, ...initialSections }));
    } catch (err) {
      setErrors({ global: err.message });
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  // Initialize data
  useEffect(() => {
    const storedUserId = localStorage.getItem("userid");
    const storedUsertoken = localStorage.getItem("usertoken");
    
    if (storedUserId) {
      setUserId(storedUserId);
      setUsertoken(storedUsertoken);
    } else {
      router.push("/user/register");
      return;
    }

    if (templateId) {
      fetchTemplateDetails();
    }
  }, [templateId, fetchTemplateDetails, router]);

  const handleInputChange = (e, id) => {
    const val = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    setFormData(prev => ({ ...prev, [id]: val }));
  };

  const handleOpenEmailConfig = (e) => {
    e.preventDefault();
    setShowEmailModal(true);
  };

  const addEmailStep = () => {
    setEmailSteps([...emailSteps, { subject: "", body: "", delay: 0, delayUnit: "minutes", order: emailSteps.length }]);
  };

  const removeEmailStep = (index) => {
    const newSteps = emailSteps.filter((_, i) => i !== index);
    setEmailSteps(newSteps.map((step, i) => ({ ...step, order: i })));
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...emailSteps];
    newSteps[index][field] = value;
    setEmailSteps(newSteps);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrors({});
    
    try {
      const submissionData = new FormData();
      submissionData.append("templateId", templateId);
      submissionData.append("heading", formData.heading);
      submissionData.append("subheading", formData.subheading);
      submissionData.append("backgroundColor", formData.backgroundColor);
      submissionData.append("userId", userId);
      submissionData.append("tenantToken", usertoken || "");
      submissionData.append("askUserDetails", formData.askUserDetails);
      
      template.sections.forEach(s => {
        submissionData.append(s.id, formData[s.id]);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { 'x-user-token': userId },
        body: submissionData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Submission failed");

      // Save Email Sequence if enabled
      if (sendEmail && data.data?._id) {
        await fetch("/api/email-sequence", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Sequence for ${formData.heading}`,
            templateId,
            contentId: data.data._id,
            tenantToken: usertoken,
            steps: emailSteps
          }),
        });
      }

      setSuccess("Your masterpiece is live!");
      setTimeout(() => router.push("/publish"), 1500);
    } catch (err) {
      setErrors({ global: err.message });
    } finally {
      setSubmitting(false);
      setShowEmailModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
        <p className="text-slate-400 font-light">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      <UserNavbar />
      
      <div className="flex-1 flex overflow-hidden pt-20">
        {/* Left: Editor Panel */}
        <div className="w-full lg:w-[450px] border-r border-slate-100 flex flex-col bg-slate-50/30 overflow-y-auto">
           <div className="p-8">
              <Link href="/user/tem" className="inline-flex items-center text-slate-400 hover:text-slate-600 transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to gallery
              </Link>
              
              <div className="mb-10">
                <h1 className="text-3xl font-medium text-slate-900 mb-2">{template?.name}</h1>
                <p className="text-slate-500 font-light text-sm">{template?.description}</p>
              </div>

              <form onSubmit={handleOpenEmailConfig} className="space-y-8">
                {/* Core Details Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Base Configuration</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Primary Heading</label>
                    <input 
                      type="text" 
                      className="input-field"
                      placeholder="e.g. The Future of Design"
                      value={formData.heading}
                      onChange={e => handleInputChange(e, 'heading')}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subheading</label>
                    <textarea 
                      className="input-field min-h-[80px]"
                      placeholder="e.g. Explore our world-class templates..."
                      value={formData.subheading}
                      onChange={e => handleInputChange(e, 'subheading')}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Background Color</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 overflow-hidden"
                        value={formData.backgroundColor}
                        onChange={e => handleInputChange(e, 'backgroundColor')}
                      />
                      <input 
                        type="text" 
                        className="input-field flex-1"
                        value={formData.backgroundColor}
                        onChange={e => handleInputChange(e, 'backgroundColor')}
                      />
                    </div>
                  </div>

                  {/* Ask User Details Toggle */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="askUserDetails"
                        checked={formData.askUserDetails}
                        onChange={e => setFormData(prev => ({ ...prev, askUserDetails: e.target.checked }))}
                        className="mt-1 w-4 h-4 text-accent border-slate-300 rounded focus:ring-accent focus:ring-2 cursor-pointer"
                      />
                      <div className="flex-1">
                        <label htmlFor="askUserDetails" className="block text-sm font-medium text-slate-700 cursor-pointer">
                          Collect Visitor Responses
                        </label>
                        <p className="text-xs text-slate-500 mt-1">
                          Show a popup to collect visitor information (name, email, phone) and custom questions when they view this page
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Sections */}
                {template?.sections?.length > 0 && (
                  <div className="pt-8 border-t border-slate-100 space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Layout Sections</span>
                    </div>

                    {template.sections.map(section => (
                      <div key={section.id}>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                          {section.type === 'image' && <ImageIcon className="w-4 h-4" />}
                          {section.type === 'video' && <Video className="w-4 h-4" />}
                          {section.type === 'text' && <Type className="w-4 h-4" />}
                          {section.type === 'link' && <LinkIcon className="w-4 h-4" />}
                          {section.title}
                          {section.required && <span className="text-red-400 ml-1">*</span>}
                        </label>
                        
                        {section.type === 'text' ? (
                          <textarea 
                            className="input-field min-h-[100px]"
                            placeholder={`Enter content for ${section.title}...`}
                            value={formData[section.id]}
                            onChange={e => handleInputChange(e, section.id)}
                            required={section.required}
                          />
                        ) : section.type === 'image' ? (
                           <div className="space-y-4">
                             <input 
                               type="text" 
                               placeholder="Image URL..."
                               className="input-field"
                               value={typeof formData[section.id] === 'string' ? formData[section.id] : ''}
                               onChange={e => handleInputChange(e, section.id)}
                             />
                             <div className="relative">
                               <input 
                                 type="file" 
                                 id={`file-${section.id}`}
                                 className="hidden"
                                 onChange={e => handleInputChange(e, section.id)}
                               />
                               <label htmlFor={`file-${section.id}`} className="button-secondary w-full cursor-pointer py-3">
                                 <Upload className="w-4 h-4 mr-2" /> Upload Image
                               </label>
                             </div>
                           </div>
                        ) : (
                          <input 
                            type="text" 
                            className="input-field"
                            placeholder={section.type === 'link' ? "https://..." : "Enter value..."}
                            value={formData[section.id]}
                            onChange={e => handleInputChange(e, section.id)}
                            required={section.required}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-8 mb-20">
                   <button 
                    type="submit"
                    disabled={submitting}
                    className="button-primary w-full py-5 text-lg shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                   >
                     {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                     Next
                   </button>
                   
                   {errors.global && (
                     <p className="mt-4 text-sm text-red-500 flex items-center gap-2 alert bg-red-50 p-3 rounded-lg border border-red-100">
                       <AlertCircle className="w-4 h-4 flex-shrink-0" />
                       {errors.global}
                     </p>
                   )}
                   
                   {success && (
                     <p className="mt-4 text-sm text-green-600 flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-100">
                       <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                       {success}
                     </p>
                   )}
                </div>
              </form>
           </div>
        </div>

        {/* Right: Live Preview Panel */}
        <div className="hidden lg:flex flex-1 bg-slate-100/50 p-12 relative overflow-hidden">
           <div className="absolute top-6 left-12 flex items-center gap-2 z-10">
              <div className="px-3 py-1 bg-white border border-slate-200 rounded-full flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Preview</span>
              </div>
           </div>

           <div className="w-full h-full flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full max-w-4xl bg-white rounded-[32px] shadow-2xl border border-slate-200/50 overflow-hidden relative"
              >
                  <TemplatePreviewer 
                    templateId={templateId} 
                    formData={formData} 
                    template={template} 
                  />
              </motion.div>
           </div>
        </div>
      </div>

      {/* Email Sequence Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmailModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Email Automation</h2>
                  <p className="text-slate-500 text-sm">Configure automated emails for your visitors</p>
                </div>
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="flex items-center justify-between p-4 bg-accent/5 rounded-2xl border border-accent/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${sendEmail ? 'bg-accent' : 'bg-slate-300'}`}
                         onClick={() => setSendEmail(!sendEmail)}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${sendEmail ? 'translate-x-6' : ''}`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Enable Email Sequence</p>
                      <p className="text-xs text-slate-500">Send automated follow-ups to registered users</p>
                    </div>
                  </div>
                </div>

                {sendEmail && (
                  <div className="space-y-6">
                    {emailSteps.map((step, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative group"
                      >
                        <button 
                          onClick={() => removeEmailStep(index)}
                          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <h3 className="font-semibold text-slate-800">Email Step {index + 1}</h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Subject Line</label>
                            <input 
                              type="text"
                              className="input-field"
                              placeholder="e.g. Welcome to our community!"
                              value={step.subject}
                              onChange={(e) => handleStepChange(index, 'subject', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Email Body (HTML supported)</label>
                            <textarea 
                              className="input-field min-h-[120px]"
                              placeholder="Hello {{name}}, welcome..."
                              value={step.body}
                              onChange={(e) => handleStepChange(index, 'body', e.target.value)}
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-[2]">
                              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Delay Amount</label>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <input 
                                  type="number"
                                  className="input-field"
                                  value={step.delay}
                                  onChange={(e) => handleStepChange(index, 'delay', parseInt(e.target.value) || 0)}
                                  min="0"
                                />
                              </div>
                            </div>
                            <div className="flex-[3]">
                              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Unit</label>
                              <select 
                                className="input-field py-[10px]"
                                value={step.delayUnit || "minutes"}
                                onChange={(e) => handleStepChange(index, 'delayUnit', e.target.value)}
                              >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                              </select>
                            </div>
                            <div className="flex-[4] flex flex-col justify-end pt-5">
                              <p className="text-[10px] text-slate-400 italic">
                                {index === 0 
                                  ? "Send immediately after signup" 
                                  : `Send ${step.delay} ${step.delayUnit || 'minutes'} after previous email`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <button 
                      onClick={addEmailStep}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      Add Another Email Step
                    </button>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/50">
                <button 
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 py-4 px-6 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-all"
                >
                  Back to Editor
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-[2] py-4 px-6 bg-accent text-white rounded-xl font-semibold shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Finish and Publish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
