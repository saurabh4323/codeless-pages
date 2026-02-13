"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import DynamicPopup from "@/app/components/DynamicPopup";

// Animation variants
const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ModernVideoTestimonialLayout({ previewContent = null }) {
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

  const renderVideo = (url, size = "normal") => {
    if (!url) return null;
    const aspectClass = "aspect-video";
    
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtube.com") ? url.split("v=")[1]?.split("&")[0] : url.split("youtu.be/")[1]?.split("?")[0];
      if (!videoId) return <div className={`${aspectClass} bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-500`}>Invalid video URL</div>;
      return (
        <div className={`${aspectClass} rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-black`}>
          <iframe src={`https://www.youtube.com/embed/${videoId}`} className="w-full h-full" frameBorder="0" allowFullScreen />
        </div>
      );
    }
    return (
      <div className={`${aspectClass} rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-black`}>
        <video controls className="w-full h-full object-cover" src={url} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-black"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-gray-200 text-center">
          <p className="text-lg font-semibold text-red-600 mb-4">{error || "No content found"}</p>
          <button onClick={() => window.location.reload()} className="w-full bg-black text-white py-3 rounded-2xl">Try Again</button>
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

  const testimonials = [];
  let currentGroup = {};
  sections.forEach((s) => {
    if (s.type === 'link') {
      if (Object.keys(currentGroup).length > 0) testimonials.push(currentGroup);
      currentGroup = { link: s };
    } else if (s.type === 'video') currentGroup.video = s;
    else if (s.type === 'text') currentGroup.text = s;
  });
  if (Object.keys(currentGroup).length > 0) testimonials.push(currentGroup);

  return (
    <>
      <Head><title>{content.heading}</title></Head>
      {content?.askUserDetails && templateId && <DynamicPopup templateId={templateId} />}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <header className="py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">{content.heading}</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{content.subheading}</p>
        </header>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all">
                {renderVideo(t.video?.value)}
                <div className="p-6">
                  {t.text && <blockquote className="text-gray-600 italic mb-6">{t.text.value}</blockquote>}
                  {t.link && (
                    <a href={t.link.value} target="_blank" className="block w-full text-center px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all">
                      Click Here to Get Started
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}