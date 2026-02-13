"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../user/Header";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Layout,
  ArrowRight,
  Loader2,
  Plus,
  Search,
  Eye,
  Edit2,
  MoreVertical,
  Share2,
  LayoutGrid,
  History,
  Info
} from "lucide-react";

const LAYOUT_MAPPING = {
  "Landing page": "layoutone",
  "Payment Page": "layouttwo",
  "Thankyou Page": "layoutthree",
  "Testimonial Images": "layoutfour",
  "Testimonial Section": "layoutfive",
  "All Products": "layoutsix",
  "Gift Page": "layoutseven",
  "Video Testimonial": "layouteight",
  "MainThankyou Page": "layoutnine",
  "Basic": "layoutten",
  "form": "layouteleven"
};

export default function YourPublishedContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userPages, setUserPages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/templatecreate", {
        headers: { "status": "published" } // Logic to only get published blueprints
      });
      const data = await response.json();
      if (!data.success) throw new Error("Failed to fetch templates");
      setTemplates(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPagesForTemplate = async (template) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userid");
      
      let endpoint = "/api/upload";
      if (template.name === "Testimonial Section") {
        endpoint = "/api/acordial/create";
      }

      const response = await fetch(`${endpoint}?userId=${userId}`);
      const data = await response.json();
      
      if (!data.success) throw new Error("Failed to fetch pages");
      
      // Filter strictly by templateId AND createdBy user
      const pages = endpoint === "/api/upload" 
        ? (data.content || []).filter(p => 
            String(p.templateId?._id || p.templateId) === String(template._id) && 
            String(p.createdBy) === String(userId)
          )
        : (data.data || []).filter(p => 
            String(p.createdBy) === String(userId)
          );

      setUserPages(pages);
      setSelectedTemplate(template);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page) => {
    if (selectedTemplate.name === "Testimonial Section") {
       router.push(`/acordial/edit/${page._id}`);
    } else {
       router.push(`/edit/${page._id}`);
    }
  };

  const handleView = (page) => {
    if (selectedTemplate.name === "Testimonial Section") {
       window.open(`/acordial/view/${page._id}`, '_blank');
    } else {
       const layoutFolder = LAYOUT_MAPPING[selectedTemplate.name] || "layoutone";
       window.open(`/layouts/${layoutFolder}/${page._id}`, '_blank');
    }
  };

  const handleShare = (page) => {
    const layoutFolder = LAYOUT_MAPPING[selectedTemplate.name] || "layoutone";
    const url = `${window.location.origin}/layouts/${layoutFolder}/${page._id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const getTemplateConfig = (name) => {
    const config = {
      "Landing page": { img: "/landing_template.png" },
      "Payment Page": { img: "/payment_template.png" },
      "Thankyou Page": { img: "/thankyou_template.png" },
      "Testimonial Images": { img: "/templates_v2.png" },
      "Testimonial Section": { img: "/templates_v2.png" },
      "All Products": { img: "/landing_template.png" },
      "Gift Page": { img: "/payment_template.png" },
      "Video Testimonial": { img: "/codeless_v2.png" },
      "MainThankyou Page": { img: "/thankyou_template.png" },
      "Basic": { img: "/codeless_v2.png" },
    };
    return config[name] || { img: "/templates_v2.png" };
  };

  return (
    <div className="min-h-screen bg-white font-outfit">
      <UserNavbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            {selectedTemplate && (
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-black font-semibold text-xs mb-6 transition-colors group uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Templates
              </button>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              {selectedTemplate ? selectedTemplate.name : "Your Masterpieces"}
            </h1>
            <p className="text-slate-500 font-light mt-4 text-lg">
              {selectedTemplate 
                ? `You have created ${userPages.length} pages using this layout.`
                : "Select a layout blueprint to manage your published pages."}
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative w-64 hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search your pages..." 
                 className="input-field pl-10 py-3 bg-white border-2 border-slate-100 focus:border-black transition-all"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
             <Link href="/user/tem" className="button-primary px-8 py-3.5 flex items-center gap-2 shadow-xl shadow-accent/20">
               <Plus className="w-4 h-4" /> New Page
             </Link>
          </div>
        </div>

        {error && (
          <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-100 text-red-600 mb-8 flex items-center gap-3">
             <Info className="w-5 h-5" />
             <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        {loading && !templates.length ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!selectedTemplate ? (
              /* Template Selection View */
              <motion.div 
                key="templates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {templates.map((template) => {
                  const config = getTemplateConfig(template.name);
                  return (
                    <div 
                      key={template._id}
                      onClick={() => fetchUserPagesForTemplate(template)}
                      className="bg-white rounded-[40px] border-2 border-slate-50 hover:border-black overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer group p-4"
                    >
                      <div className="aspect-[16/10] bg-slate-50 rounded-[30px] relative overflow-hidden">
                         <Image 
                           src={config.img} 
                           alt={template.name} 
                           fill
                           className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                         />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                         <div className="absolute bottom-6 right-6 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="w-12 h-12 rounded-full bg-black text-white shadow-2xl flex items-center justify-center">
                               <ArrowRight className="w-5 h-5" />
                            </div>
                         </div>
                      </div>
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-accent transition-colors">{template.name}</h3>
                        <p className="text-slate-500 font-light text-sm line-clamp-1">{template.description}</p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              /* User Pages View */
              <motion.div 
                key="pages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {userPages.length > 0 ? (
                  userPages.map((page) => (
                    <div key={page._id} className="bg-white rounded-[32px] border-2 border-black p-8 hover:shadow-2xl transition-all group flex flex-col h-full relative">
                       <div className="flex items-start justify-between mb-8">
                         <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 group-hover:bg-black group-hover:text-white transition-all">
                           <Layout className="w-6 h-6" />
                         </div>
                         <div className="flex gap-2">
                           <button onClick={() => handleView(page)} className="p-3 rounded-xl bg-slate-50 text-slate-900 hover:bg-black hover:text-white transition-all border border-slate-200 shadow-sm" title="View Page">
                             <Eye className="w-4.5 h-4.5" />
                           </button>
                           <button onClick={() => handleEdit(page)} className="p-3 rounded-xl bg-slate-50 text-slate-900 hover:bg-black hover:text-white transition-all border border-slate-200 shadow-sm" title="Edit Content">
                             <Edit2 className="w-4.5 h-4.5" />
                           </button>
                         </div>
                       </div>

                       <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-accent transition-colors">
                          {page.heading || page.title || "Untitled Masterpiece"}
                       </h3>
                       <p className="text-slate-600 font-light text-sm line-clamp-3 leading-relaxed mb-8">
                          {page.subheading || page.subtitle || "No description provided for this page."}
                       </p>

                       <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-slate-400">
                             <History className="w-4 h-4" />
                             <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">
                               {new Date(page.createdAt).toLocaleDateString()}
                             </span>
                          </div>
                           <button 
                             onClick={() => handleShare(page)}
                             className="p-2.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-black transition-colors"
                             title="Copy Shareable Link"
                           >
                              <Share2 className="w-4.5 h-4.5" />
                           </button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-32 bg-slate-50/50 rounded-[60px] border-2 border-dashed border-slate-200">
                     <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <Plus className="w-8 h-8 text-slate-200" />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-2">No pages found</h3>
                     <p className="text-slate-500 font-light mb-10 max-w-sm mx-auto">{"You haven't created any pages using the"} <b>{selectedTemplate.name}</b> {"layout yet."}</p>
                     <Link href={`/user/tem/${selectedTemplate._id}`} className="button-primary px-10 py-4 text-base">
                        Build Your First Page
                     </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
