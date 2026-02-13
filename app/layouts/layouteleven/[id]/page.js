"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import DynamicPopup from "@/app/components/DynamicPopup";

export default function LayoutEleven({ previewContent = null }) {
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
      <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-700 border-t-indigo-400"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-indigo-950 flex items-center justify-center p-4">
        <div className="bg-indigo-900 p-8 rounded-2xl shadow-xl text-center">
          <p className="text-red-400 mb-4">{error || "No content found"}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-500 text-white rounded-lg">Try Again</button>
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
    <div className="min-h-screen" style={{ backgroundColor: content.backgroundColor || "#1e1b4b" }}>
      <Head><title>{content.heading}</title></Head>
      {content?.askUserDetails && templateId && <DynamicPopup templateId={templateId} />}

      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-20 grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tighter uppercase">{content.heading}</h1>
              <p className="text-xl text-indigo-200 leading-relaxed font-light">{content.subheading}</p>
            </div>
            <div className="order-1 lg:order-2">
              {images[0] && (
                <div className="relative border-2 border-indigo-400 rounded-[3rem] p-4 scale-95 hover:scale-100 transition-transform duration-500">
                  <img src={images[0].value} className="w-full h-[600px] object-cover rounded-[2.5rem] shadow-3xl" />
                </div>
              )}
            </div>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.slice(1).map((img, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                <img src={img.value} className="w-full h-48 object-cover rounded-2xl mb-6" />
                {texts[i] && <p className="text-white text-lg font-medium mb-4">{texts[i].value}</p>}
                {links[i] && (
                  <a href={links[i].value} className="inline-block text-indigo-400 font-bold hover:translate-x-2 transition-transform">Explore →</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
