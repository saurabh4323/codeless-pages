import React, { useMemo, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Monitor,
  Smartphone,
  Tablet,
  RefreshCcw,
  Eye,
  Layout,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from "lucide-react";

// Helper to map template name to layout folder name
function getLayoutFolder(template) {
  const name = template?.name || "";
  const mapping = {
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
  return mapping[name] || "layoutone";
}

// Helper to build a mock content object from form data and template definition
function buildContentObject(formData, template) {
  const sections = {};
  if (template && Array.isArray(template.sections)) {
    template.sections.forEach((section) => {
      let value = formData[section.id] || "";
      if (value && typeof value === "object" && typeof URL !== "undefined") {
        try {
          value = URL.createObjectURL(value);
        } catch (err) {
          console.error("Failed to create object URL for file", err);
        }
      }

      sections[section.id] = {
        type: section.type,
        value: value,
      };
    });
  }
  return {
    _id: "preview_mode",
    heading: formData.heading || template?.heading || "Your Catchy Heading Here",
    subheading: formData.subheading || template?.subheading || "A brilliant subheading that captures interest instantly.",
    backgroundColor: formData.backgroundColor || template?.backgroundColor || "#ffffff",
    sections,
    askUserDetails: false, // Disable popups in preview
    templateId: template?._id || "preview_id",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const templateImportsDetail = {
  layoutone: React.lazy(() => import('../../../layouts/layoutone/[id]/page.js')),
  layouttwo: React.lazy(() => import('../../../layouts/layouttwo/[id]/page.js')),
  layoutthree: React.lazy(() => import('../../../layouts/layoutthree/[id]/page.js')),
  layoutfour: React.lazy(() => import('../../../layouts/layoutfour/[id]/page.js')),
  layoutfive: React.lazy(() => import('../../../layouts/layoutfive/[id]/page.js')),
  layoutsix: React.lazy(() => import('../../../layouts/layoutsix/[id]/page.js')),
  layoutseven: React.lazy(() => import('../../../layouts/layoutseven/[id]/page.js')),
  layouteight: React.lazy(() => import('../../../layouts/layouteight/[id]/page.js')),
  layoutnine: React.lazy(() => import('../../../layouts/layoutnine/[id]/page.js')),
  layoutten: React.lazy(() => import('../../../layouts/layoutten/[id]/page.js')),
  layouteleven: React.lazy(() => import('../../../layouts/layouteleven/[id]/page.js')),
};

export default function TemplatePreviewer({ templateId, formData, template }) {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [device, setDevice] = useState("desktop"); // desktop, tablet, mobile
  const layoutFolder = getLayoutFolder(template);
  const TemplateComponent = templateImportsDetail[layoutFolder] || templateImportsDetail['layoutone'];

  const content = useMemo(() => buildContentObject(formData, template), [formData, template]);

  const deviceStyles = {
    desktop: "w-full h-full",
    tablet: "w-[768px] h-full mx-auto shadow-2xl border-[12px] border-slate-900 rounded-[3rem]",
    mobile: "w-[375px] h-[812px] mx-auto my-auto shadow-2xl border-[12px] border-slate-900 rounded-[3rem]",
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Top Controls Bar */}
      <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <Layout className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Live Preview</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-200 mx-2" />
          <div className="flex gap-1">
            {[
              { id: 'desktop', icon: Monitor, label: 'Desktop' },
              { id: 'tablet', icon: Tablet, label: 'Tablet' },
              { id: 'mobile', icon: Smartphone, label: 'Mobile' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDevice(d.id)}
                className={`p-2 rounded-xl transition-all duration-300 ${device === d.id
                  ? 'bg-slate-900 text-white shadow-lg scale-105'
                  : 'text-slate-400 hover:bg-slate-100'
                  }`}
                title={d.label}
              >
                <d.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg text-green-600 border border-green-100">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Responsive Mode</span>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-100/30 overflow-hidden relative group">
        <div className={`transition-all duration-500 ease-in-out h-full flex items-center justify-center p-4 ${device === 'mobile' ? 'overflow-auto' : ''}`}>
          <div className={`${deviceStyles[device]} overflow-hidden relative bg-white`}>
            {/* Browser Header for Desktop */}
            {device === 'desktop' && (
              <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="flex-1 max-w-sm mx-auto h-5 bg-white rounded border border-slate-100 flex items-center px-2">
                  <div className="w-2 h-2 text-slate-300 mr-2"><RefreshCcw className="w-2 h-2" /></div>
                  <div className="text-[8px] text-slate-400 italic">preview.codelesspages.com/temp-{templateId}</div>
                </div>
              </div>
            )}

            <div className={`w-full ${device === 'desktop' ? 'h-[calc(100%-32px)]' : 'h-full'} overflow-auto scroll-smooth custom-scrollbar`}>
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full gap-4 bg-white">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-accent rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-accent" />
                    </div>
                  </div>
                  <p className="text-slate-400 font-medium text-sm animate-pulse">Building your preview...</p>
                </div>
              }>
                <TemplateComponent previewContent={content} />
              </Suspense>
            </div>

            {/* Mobile Notch Detail */}
            {device === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-900 rounded-b-2xl z-50">
                <div className="absolute top-1 right-8 w-2 h-2 rounded-full bg-slate-800" />
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-800 rounded-full" />
              </div>
            )}
          </div>
        </div>

        {/* Float Actions */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-white shadow-2xl">
            <button
              onClick={() => {
                if (editId) {
                  window.open(`/layouts/${layoutFolder}/${editId}`, '_blank');
                } else {
                  alert("Please publish your page first to view it in full window.");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Full Window
            </button>
            <button
              onClick={() => {
                if (editId) {
                  window.open(`/layouts/${layoutFolder}/${editId}`, '_blank');
                } else {
                  alert("Please publish your page first to view the live link.");
                }
              }}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              title="View Live Site"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-white border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-none">
            Real-time Sync Active
          </span>
        </div>
        <div className="text-[10px] font-bold text-slate-300 font-mono">
          ID: CP_PX_{templateId}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}