"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import DynamicPopup from "@/app/components/DynamicPopup";

export default function LayoutNine({ previewContent = null }) {
  const params = useParams();
  const id = params?.id;
  const [dbContent, setDbContent] = useState(null);
  const [loading, setLoading] = useState(!previewContent);
  const [error, setError] = useState(null);

  const content = previewContent || dbContent;
  const templateId = content?.templateId?._id || content?.templateId;

  useEffect(() => {
    if (previewContent) {
      setLoading(false);
      return;
    }

    if (!id) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/upload`);
        if (!response.ok) throw new Error("Failed to fetch content");
        const data = await response.json();
        if (!data.success) throw new Error("Failed to fetch content");

        const matchedContent = data.content.find((item) => item._id === id);
        if (!matchedContent) throw new Error("Content not found");

        setDbContent(matchedContent);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, previewContent]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-blue-500"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl text-center">
          <p className="text-red-400 mb-4">{error || "No content found"}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Try Again</button>
        </div>
      </div>
    );
  }

  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
    order: content.sections[sectionId].order || 0,
  })).sort((a, b) => a.order - b.order);

  const images = sections.filter((s) => s.type === "image");
  const texts = sections.filter((s) => s.type === "text");
  const links = sections.filter((s) => s.type === "link");

  return (
    <div className="min-h-screen" style={{ backgroundColor: content.backgroundColor || "#0f172a" }}>
      <Head><title>{content.heading}</title></Head>
      {content?.askUserDetails && templateId && <DynamicPopup templateId={templateId} />}

      {/* Hero */}
      <div className="relative h-[80vh] flex items-center justify-center text-center px-6 overflow-hidden">
        {images[0] && <img src={images[0].value} className="absolute inset-0 w-full h-full object-cover opacity-30" />}
        <div className="relative z-10 max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter italic">{content.heading}</h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto">{content.subheading}</p>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {images.slice(1).map((img, i) => (
            <div key={i} className="group relative rounded-3xl overflow-hidden shadow-2xl bg-slate-800 border border-slate-700 aspect-video">
              <img src={img.value} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent p-8 flex flex-col justify-end">
                {texts[i] && <p className="text-white text-lg font-medium">{texts[i].value}</p>}
                {links[i] && (
                  <a href={links[i].value} className="mt-4 inline-block text-blue-400 font-bold hover:text-blue-300">Learn More →</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
