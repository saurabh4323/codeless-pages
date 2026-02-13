"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  Settings, 
  Layout, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  Type, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Trash2,
  Brush
} from "lucide-react";
import UserNavbar from "@/app/user/Header";

export default function EditContent() {
  const [content, setContent] = useState(null);
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    sections: {},
    backgroundColor: "#ffffff",
    askUserDetails: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const params = useParams();
  const router = useRouter();
  const contentId = params.id;

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        // Fetch only the specific content by ID
        const response = await fetch(`/api/upload?id=${contentId}`);
        const result = await response.json();
        
        if (result.success && result.content && result.content.length > 0) {
          const contentData = result.content[0];

          const isSuperadmin = localStorage.getItem("superadminAuth") === "true";
          const userId = localStorage.getItem("userid");
          const createdById = (contentData.createdBy || "").toString();
          
          if (!isSuperadmin && (!userId || createdById !== userId)) {
            setHasPermission(false);
            setLoading(false);
            return;
          }

          setContent(contentData);
          setTemplate(contentData.templateId);

          // Handle sections data - ensure it's an object
          const sections = contentData.sections || {};
          
          setFormData({
            heading: contentData.heading || "",
            subheading: contentData.subheading || "",
            sections: sections,
            backgroundColor: contentData.backgroundColor || "#ffffff",
            askUserDetails: contentData.askUserDetails || false,
          });
        } else {
          toast.error(result.message || "Failed to fetch content");
        }
      } catch (error) {
        toast.error("Error fetching content");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [contentId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, askUserDetails: e.target.checked }));
  };

  const handleColorChange = (e) => {
    setFormData((prev) => ({ ...prev, backgroundColor: e.target.value }));
  };

  const handleSectionChange = (sectionId, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: { ...prev.sections[sectionId], value },
      },
    }));
  };

  const handleFileChange = (sectionId, file) => {
    if (!file) return;
    const sectionType = template?.sections?.find(s => s.id === sectionId)?.type || "image";
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: { 
          type: sectionType,
          value: file 
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const isSuperadmin = localStorage.getItem("superadminAuth") === "true";
    const userIdLocal = localStorage.getItem("userid");
    const effectiveUserId = isSuperadmin
      ? (content?.createdBy ? content.createdBy.toString() : userIdLocal)
      : userIdLocal;
      
    if (!effectiveUserId || effectiveUserId === "null") {
      toast.error("Please log in to update content");
      router.push("/user/register");
      setSaving(false);
      return;
    }

    const data = new FormData();
    data.append("contentId", contentId);
    data.append("templateId", content.templateId._id);
    data.append("heading", formData.heading);
    data.append("subheading", formData.subheading);
    data.append("backgroundColor", formData.backgroundColor);
    data.append("askUserDetails", formData.askUserDetails);
    data.append("userId", effectiveUserId);
    
    Object.entries(formData.sections).forEach(([sectionId, section]) => {
      // Handle both { value: ... } object format and legacy string format
      const val = (section && typeof section === 'object' && 'value' in section) ? section.value : section;
      
      if (val instanceof File) {
        data.append(sectionId, val);
      } else if (typeof val === 'string' || typeof val === 'number') {
        data.append(sectionId, String(val));
      }
    });

    try {
      const response = await fetch("/api/upload", {
        method: "PUT",
        body: data,
        headers: isSuperadmin ? { "x-superadmin": "true" } : undefined,
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Changes saved successfully!");
        router.push("/publish");
      } else {
        toast.error(result.message || "Failed to update content");
      }
    } catch (error) {
      toast.error("Error updating content");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-light tracking-wide italic">Preparing your masterpiece...</p>
        </motion.div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl p-12 text-center max-w-xl w-full border border-slate-100"
        >
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Access Denied</h2>
          <p className="text-slate-500 font-light text-lg mb-10 leading-relaxed">
            You do not have permission to edit this content. This masterpiece belongs to another creator.
          </p>
          <button
            onClick={() => router.push("/publish")}
            className="button-primary px-10 py-4"
          >
            Return to Gallery
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] font-outfit">
      <UserNavbar />
      
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        {/* Breadcrumb & Title */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-black font-semibold text-xs mb-6 transition-colors group uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Workspace
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Refine Creation
          </h1>
          <p className="text-slate-500 font-light mt-4 text-lg">
            Template: <span className="text-accent font-medium font-mono text-sm uppercase">{template?.name}</span>
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Core Branding Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-10">
               <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Layout className="w-5 h-5" />
               </div>
               <h2 className="text-2xl font-bold text-slate-900">Visual Identity</h2>
            </div>

            <div className="space-y-8">
              <div className="group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-accent transition-colors">
                  Primary Heading
                </label>
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  className="w-full text-2xl font-bold text-slate-900 bg-slate-50 border-none rounded-2xl px-6 py-5 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-slate-300"
                  placeholder="The soul of your page..."
                  required
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-accent transition-colors">
                  Supporting Message
                </label>
                <textarea
                  name="subheading"
                  value={formData.subheading}
                  onChange={handleInputChange}
                  className="w-full text-lg font-light text-slate-600 bg-slate-50 border-none rounded-2xl px-6 py-5 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-slate-300 min-h-[120px] resize-none"
                  placeholder="Add context and depth..."
                  required
                />
              </div>
            </div>
          </motion.section>

          {/* Configuration & Aesthetic Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-10">
               <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Brush className="w-5 h-5" />
               </div>
               <h2 className="text-2xl font-bold text-slate-900">Style & Engagement</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Atmosphere Color
                </label>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[24px]">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-4 border-white shadow-sm">
                    <input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={handleColorChange}
                      className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={handleColorChange}
                    className="bg-transparent border-none text-slate-600 font-mono text-sm focus:ring-0 w-24 p-0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Visitor Insight
                </label>
                <label className="flex items-center gap-4 bg-slate-50 p-5 rounded-[24px] cursor-pointer group hover:bg-slate-100 transition-colors">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.askUserDetails}
                      onChange={handleCheckboxChange}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent transition-all shadow-inner"></div>
                  </div>
                  <span className="text-slate-600 font-medium text-sm group-hover:text-slate-900 transition-colors">
                    Capture user responses
                  </span>
                </label>
              </div>
            </div>
          </motion.section>

          {/* Dynamic Sections */}
          {template?.sections?.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 px-4">
                 <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Settings className="w-5 h-5" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Component Configuration</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {template.sections.map((section, idx) => {
                  const Icon = section.type === "image" ? ImageIcon : (section.type === "video" ? Video : (section.type === "link" ? LinkIcon : Type));
                  const sectionData = formData.sections[section.id];
                  const currentValue = typeof sectionData === 'string' ? sectionData : (sectionData?.value || "");
                  
                  return (
                    <div key={section.id} className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm group hover:shadow-xl transition-all duration-500">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-accent group-hover:text-white transition-all">
                             <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{section.type}</p>
                          </div>
                        </div>
                        {section.required && (
                           <span className="text-[9px] font-bold text-accent/50 group-hover:text-accent border border-slate-100 px-2 py-1 rounded-md uppercase tracking-widest transition-colors">Required</span>
                        )}
                      </div>

                      {section.type === "text" ? (
                        <textarea
                          value={currentValue}
                          onChange={(e) => handleSectionChange(section.id, e.target.value)}
                          className="w-full text-base font-light text-slate-600 bg-slate-50 border-none rounded-2xl px-6 py-5 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-slate-300 min-h-[150px]"
                          placeholder={`Deepen your content here...`}
                          required={section.required}
                        />
                      ) : section.type === "link" ? (
                        <div className="relative">
                          <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input
                            type="url"
                            value={currentValue}
                            onChange={(e) => handleSectionChange(section.id, e.target.value)}
                            className="w-full text-base font-medium text-slate-900 bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-5 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-slate-300"
                            placeholder="https://your-link.com"
                            required={section.required}
                          />
                        </div>
                      ) : (
                        <div className="space-y-6">
                           <input
                            type="file"
                            accept={section.type === "image" ? "image/*" : "video/*"}
                            onChange={(e) => handleFileChange(section.id, e.target.files[0])}
                            className="hidden"
                            id={`file-${section.id}`}
                          />
                          
                          {currentValue ? (
                            <div className="relative group/media rounded-3xl overflow-hidden bg-slate-50 border-2 border-slate-50">
                               {section.type === "image" ? (
                                 <img 
                                   src={currentValue instanceof File ? URL.createObjectURL(currentValue) : currentValue} 
                                   className="w-full h-auto max-h-[400px] object-cover" 
                                   alt="Preview" 
                                 />
                               ) : (
                                 <video 
                                   src={currentValue instanceof File ? URL.createObjectURL(currentValue) : currentValue} 
                                   controls 
                                   className="w-full h-auto max-h-[400px]" 
                                 />
                               )}
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                  <label htmlFor={`file-${section.id}`} className="bg-white text-black px-8 py-3 rounded-2xl font-bold text-sm shadow-2xl cursor-pointer hover:scale-105 transition-transform">
                                     Replace {section.type}
                                  </label>
                               </div>
                            </div>
                          ) : (
                            <label htmlFor={`file-${section.id}`} className="flex flex-col items-center justify-center w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all p-8 text-center">
                               <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 transition-transform">
                                  <Icon className="w-6 h-6" />
                               </div>
                               <h4 className="text-slate-900 font-bold text-sm mb-1">Empower with {section.type}</h4>
                               <p className="text-slate-400 text-xs font-light tracking-wide">Select a masterpiece from your device</p>
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Action Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 pt-10"
          >
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-black text-white px-8 py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-white/50" />
                  <span>Sealing changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  <span>Update Masterpiece</span>
                </>
              )}
            </button>
          </motion.div>
        </form>
      </main>
    </div>
  );
}