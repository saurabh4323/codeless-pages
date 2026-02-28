"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { CheckCircle, Plus, Save, X, Trash2, Edit3, Image as ImageIcon, Video, FileText, Link as LinkIcon, GripVertical, Settings, Upload } from "lucide-react";
import apiClient from "@/utils/apiClient";
import { motion, AnimatePresence, Reorder } from "framer-motion";

export default function CreateTemplate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [template, setTemplate] = useState({
    name: "",
    description: "",
    heading: "",
    subheading: "",
    type: "basic",
    status: "draft",
    sections: [],
    createdBy: "",
    thumbnail: "",
  });

  useEffect(() => {
    const createdBy = localStorage.getItem("adminToken") || "admin";
    setTemplate((prev) => ({ ...prev, createdBy }));
  }, []);

  const sectionTypes = [
    { id: "text", label: "Text Block", icon: Edit3 },
    { id: "image", label: "Image Upload", icon: ImageIcon },
    { id: "video", label: "Video Embed", icon: Video },
    { id: "file", label: "File Upload", icon: FileText },
    { id: "link", label: "External Link", icon: LinkIcon },
  ];

  const templateTypes = [
    { id: "basic", label: "Basic Template" },
    { id: "article", label: "Article Template" },
    { id: "gallery", label: "Gallery Template" },
    { id: "portfolio", label: "Portfolio Template" },
    { id: "report", label: "Report Template" },
  ];

  const addSection = (type) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type,
      title: "",
      description: "",
      required: false,
      order: template.sections.length,
      config: getDefaultConfig(type),
    };

    setTemplate({
      ...template,
      sections: [...template.sections, newSection],
    });
  };

  const getDefaultConfig = (type) => {
    switch (type) {
      case "text": return { minLength: 0, maxLength: 1000, placeholder: "Enter text here...", format: "plain" };
      case "image": return { maxSize: 5, allowedTypes: ["jpg", "jpeg", "png", "gif"], width: 800, height: 600, aspectRatio: "4:3" };
      case "video": return { maxDuration: 300, maxSize: 100, allowedSources: ["upload", "youtube", "vimeo"] };
      case "file": return { maxSize: 10, allowedTypes: ["pdf", "doc", "docx", "xls", "xlsx"] };
      case "link": return { validateUrl: true, allowedDomains: [] };
      default: return {};
    }
  };

  const removeSection = (sectionId) => {
    setTemplate({
      ...template,
      sections: template.sections.filter((section) => section.id !== sectionId),
    });
  };

  const updateSection = (sectionId, field, value) => {
    setTemplate({
      ...template,
      sections: template.sections.map((section) => 
        section.id === sectionId ? { ...section, [field]: value } : section
      ),
    });
  };

  const updateSectionConfig = (sectionId, configField, value) => {
    setTemplate({
      ...template,
      sections: template.sections.map((section) => 
        section.id === sectionId ? { ...section, config: { ...section.config, [configField]: value } } : section
      ),
    });
  };

  const handleTemplateChange = (field, value) => {
    setTemplate({ ...template, [field]: value });
  };

  const saveTemplate = async (status = "draft") => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      if (!template.name.trim()) {
        setError("Template name is required");
        setLoading(false);
        return;
      }

      const response = await apiClient.post("/api/admin/templatecreate", { ...template, status });

      if (response.data.success) {
        setMessage(status === "published" ? "Template published successfully!" : "Template saved as draft!");
        if (status === "published") {
          setTimeout(() => router.push("/admin/tempall"), 2000);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("upload_preset", "tempelate"); 

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/ddyhobnzf/image/upload`,
        { method: "POST", body: uploadForm }
      );

      const data = await response.json();
      if (data.secure_url) {
        handleTemplateChange("thumbnail", data.secure_url);
        setMessage("Thumbnail uploaded successfully!");
      } else {
        setError("Failed to upload thumbnail");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload thumbnail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Head>
        <title>Create Template | Admin Dashboard</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Plus className="w-6 h-6 text-white" />
             </div>
             Create New Template
          </h1>
          <p className="text-gray-400">Design your template structure and settings</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/tempall")}
            className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium border border-transparent hover:border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={() => saveTemplate("draft")}
            disabled={loading}
            className="bg-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => saveTemplate("published")}
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/20 transition-all flex items-center gap-2 font-bold"
          >
            <CheckCircle className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-200 flex items-center gap-3">
            <X className="w-5 h-5" /> {error}
          </motion.div>
        )}
        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-200 flex items-center gap-3">
            <CheckCircle className="w-5 h-5" /> {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Template Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Template Settings
            </h3>
            
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Template Name</label>
                <input
                  type="text"
                  value={template.name}
                  onChange={(e) => handleTemplateChange("name", e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="e.g. Monthly Report"
                />
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Type</label>
                <select
                  value={template.type}
                  onChange={(e) => handleTemplateChange("type", e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                >
                  {templateTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Heading</label>
                <input type="text" value={template.heading} onChange={(e) => handleTemplateChange("heading", e.target.value)} className="w-full px-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all" placeholder="Main Heading" />
              </div>

               <div className="group">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Thumbnail</label>
                <div className="flex items-center gap-4">
                  {template.thumbnail && (
                    <img src={template.thumbnail} alt="Thumbnail preview" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                  )}
                  <div className="flex-1">
                    <label className="flex items-center justify-center w-full px-4 py-3 bg-[#0f1023] border border-white/10 border-dashed rounded-xl cursor-pointer hover:bg-white/5 transition-all text-gray-400 hover:text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      <span className="text-sm">{template.thumbnail ? "Change Image" : "Upload Image"}</span>
                      <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Subheading</label>
                <input type="text" value={template.subheading} onChange={(e) => handleTemplateChange("subheading", e.target.value)} className="w-full px-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all" placeholder="Subtitle" />
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea rows={4} value={template.description} onChange={(e) => handleTemplateChange("description", e.target.value)} className="w-full px-4 py-3 bg-[#0f1023] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all resize-none" placeholder="Brief description..." />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sections Builder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1e1b4b]/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Sections Builder</h3>
              <div className="relative group">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Section
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f1023] border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-20">
                  {sectionTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => addSection(type.id)}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors"
                    >
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {template.sections.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                  <p className="text-gray-400">No sections added yet. Start adding content blocks.</p>
                </div>
              ) : (
                <Reorder.Group axis="y" values={template.sections} onReorder={(newSections) => setTemplate({...template, sections: newSections})}>
                  {template.sections.map((section, index) => (
                    <Reorder.Item key={section.id} value={section} className="bg-[#0f1023] border border-white/10 rounded-xl overflow-hidden mb-4 shadow-lg">
                      <div className="bg-white/5 px-4 py-3 flex items-center justify-between cursor-move">
                        <div className="flex items-center gap-3">
                           <GripVertical className="text-gray-500 w-5 h-5" />
                           <span className="text-sm font-bold text-white uppercase tracking-wider">{section.type} Section</span>
                        </div>
                        <button onClick={() => removeSection(section.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="p-4 space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                           <input 
                              type="text" 
                              placeholder="Section Title" 
                              value={section.title} 
                              onChange={(e) => updateSection(section.id, "title", e.target.value)}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                           />
                           <input 
                              type="text" 
                              placeholder="Description (Optional)" 
                              value={section.description} 
                              onChange={(e) => updateSection(section.id, "description", e.target.value)}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                           />
                         </div>
                         
                         {/* Config Fields based on Type */}
                         <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Configuration</h4>
                            <div className="grid grid-cols-2 gap-4">
                               {Object.entries(section.config).map(([key, val]) => (
                                 <div key={key} className="flex flex-col">
                                   <label className="text-[10px] text-gray-500 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                   {Array.isArray(val) ? (
                                     <div className="text-xs text-gray-300">{val.join(", ") || "None"}</div>
                                   ) : (
                                      <input 
                                        type={typeof val === 'number' ? 'number' : 'text'}
                                        value={val}
                                        onChange={(e) => updateSectionConfig(section.id, key, typeof val === 'number' ? parseInt(e.target.value) : e.target.value)}
                                        className="px-2 py-1 bg-[#0f1023] border border-white/10 rounded text-xs text-white focus:border-blue-500 outline-none"
                                      />
                                   )}
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
