"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../Header";
import { Search, Filter, Layout, ArrowRight, Loader2, Info } from "lucide-react";

export default function TemplatesGallery() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userid");
      const response = await fetch("/api/templatecreate", {
        headers: {
          "x-user-token": userId || ""
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      const data = await response.json();
      setTemplates(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleTemplateSelect = (templateId, template) => {
    if (templateId === 'SPECIFIC_TESTIMONIAL_TEMPLATE_ID' || 
        (template && (template.name === 'Testimonial Section' || template.type === 'testimonial'))) {
      router.push('/acordial/create');
    } else {
      router.push(`/user/tem/${templateId}`);
    }
  };

  const getTemplateConfig = (name) => {
    const config = {
      "Landing page": {
        img: "/landing_template.png",
        desc: "High-conversion layout for projects, products, or personal brands. Optimized for clear communication and speed.",
      },
      "Payment Page": {
        img: "/payment_template.png",
        desc: "Secure and sleek checkout interface with clear pricing breakdown, trust signals, and focused layout.",
      },
      "Thankyou Page": {
        img: "/thankyou_template.png",
        desc: "Delight your customers after a successful action with social links, next steps, and professional confirmation.",
      },
      "Testimonial Images": {
        img: "/templates_v2.png",
        desc: "Showcase your best customer photos in a beautiful, high-density masonry grid that builds instant credibility.",
      },
      "Testimonial Section": {
        img: "/templates_v2.png",
        desc: "A dedicated landing page section to highlight powerful quotes and build authority with social proof.",
      },
      "All Products": {
        img: "/landing_template.png",
        desc: "Comprehensive catalog layout to display your entire range of offerings professionally and clearly.",
      },
      "Gift Page": {
        img: "/payment_template.png",
        desc: "Festive and warm design perfect for special offers, rewards, or holiday-themed promotional content.",
      },
      "Video Testimonial": {
        img: "/codeless_v2.png",
        desc: "Let your customers speak for you with a video-first testimonial layout that increases conversion rates.",
      },
      "MainThankyou Page": {
        img: "/thankyou_template.png",
        desc: "The ultimate post-purchase experience including order tracking hooks and social sharing options.",
      },
      "Basic": {
        img: "/codeless_v2.png",
        desc: "Ultra-minimalist canvas for pure, focused communication without any visual distractions or complexity.",
      },
      "form": {
        img: "/landing_template.png",
        desc: "Clean, multi-step data capture system optimized for lead generation, surveys, or user registrations.",
      }
    };
    return config[name] || {
      img: "/templates_v2.png",
      desc: "A clean, modern layout designed for high engagement and smooth performance across all devices."
    };
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-outfit">
      <UserNavbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-semibold text-slate-900 mb-6 tracking-tight"
            >
              Choose a template <br /> 
              <span className="text-slate-400 italic font-light">to start your masterpiece.</span>
            </motion.h1>
            <p className="text-lg text-slate-500 font-light">
              Each template is pixel-perfect and optimized for focus. Select one to begin your creation journey.
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search templates..." 
                className="input-field pl-11 bg-slate-50 border-slate-200 focus:bg-white transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-100 text-red-600 mb-8 flex items-center gap-3 shadow-sm">
             <Info className="w-5 h-5" />
             <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template) => {
                const config = getTemplateConfig(template.name);
                return (
                  <motion.div
                    key={template._id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group cursor-pointer"
                    onClick={() => handleTemplateSelect(template._id, template)}
                  >
                    <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-500 group">
                      <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden">
                         <img 
                           src={config.img} 
                           alt={template.name} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                         />
                         
                         <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-indigo-600/5 transition-colors duration-500" />
                         
                         {/* Badge */}
                         <div className="absolute top-5 left-5">
                           <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm border border-slate-100 text-[9px] font-bold text-slate-800 uppercase tracking-widest">
                             {template.type || "Universal"}
                           </span>
                         </div>
                      </div>
                      
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <h3 className="text-xl font-semibold text-slate-900 group-hover:text-accent transition-colors">
                            {template.name}
                          </h3>
                          <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-accent group-hover:text-white group-hover:translate-x-1 transition-all">
                             <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                        
                        <p className="text-slate-500 font-light text-sm line-clamp-3 mb-8 leading-relaxed">
                          {config.desc}
                        </p>
                        
                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                           <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] font-mono">
                             Created on {new Date(template.createdAt).toLocaleDateString()}
                           </span>
                           <span className="text-[10px] text-accent font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                             USE TEMPLATE
                           </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredTemplates.length === 0 && (
          <div className="text-center py-40">
            <Layout className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">No templates found</h3>
            <p className="text-slate-500 font-light">Try adjusting your search query.</p>
          </div>
        )}
      </main>
    </div>
  );
}
