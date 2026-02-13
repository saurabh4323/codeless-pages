"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import DynamicPopup from "@/app/components/DynamicPopup";

export default function LayoutTen({ previewContent = null }) {
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
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-700 border-t-emerald-500"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="bg-neutral-800 p-8 rounded-2xl shadow-xl text-center">
          <p className="text-red-400 mb-4">{error || "No content found"}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-emerald-600 text-white rounded-lg">Try Again</button>
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
    <div className="min-h-screen" style={{ backgroundColor: content.backgroundColor || "#171717" }}>
      <Head><title>{content.heading}</title></Head>
      {content?.askUserDetails && templateId && <DynamicPopup templateId={templateId} />}

      <div className="max-w-4xl mx-auto px-6 py-20">
        <header className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 italic">{content.heading}</h1>
          <p className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">{content.subheading}</p>
        </header>

        <div className="space-y-12">
          {images.map((img, i) => (
            <div key={i} className="group relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-800 border border-neutral-700">
              <img src={img.value} className="w-full h-96 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="p-8">
                {texts[i] && <p className="text-neutral-300 text-lg leading-relaxed mb-6">{texts[i].value}</p>}
                {links[i] && (
                  <a href={links[i].value} className="inline-block px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-all">Action {i + 1}</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
