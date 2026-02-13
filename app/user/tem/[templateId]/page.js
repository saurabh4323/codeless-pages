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
  Upload
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
  }, [templateId]);

  const fetchTemplateDetails = async () => {
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
  };

  const handleInputChange = (e, id) => {
    const val = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    setFormData(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      setSuccess("Your masterpiece is live!");
      setTimeout(() => router.push("/publish"), 1500);
    } catch (err) {
      setErrors({ global: err.message });
    } finally {
      setSubmitting(false);
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

              <form onSubmit={handleSubmit} className="space-y-8">
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
                    disabled={submitting}
                    className="button-primary w-full py-5 text-lg shadow-xl shadow-accent/20 flex items-center gap-2"
                   >
                     {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                     Publish Changes
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
    </div>
  );
}
