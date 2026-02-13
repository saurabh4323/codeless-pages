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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function GiftPageLayout({ previewContent = null }) {
  const params = useParams();
  const id = params?.id;
  const [dbContent, setDbContent] = useState(null);
  const [loading, setLoading] = useState(!previewContent);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-rose-300 border-t-rose-600"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <p className="text-lg font-semibold text-red-600 mb-4">{error || "No content found"}</p>
          <button onClick={() => window.location.reload()} className="bg-rose-500 text-white px-8 py-3 rounded-2xl">Try Again</button>
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

  const images = sections.filter((section) => section.type === "image");
  const texts = sections.filter((section) => section.type === "text");
  const links = sections.filter((section) => section.type === "link");
  const videos = sections.filter((section) => section.type === "video");

  const backgroundImage = images[0]?.value || "";
  const featuredImage = images[1]?.value || "";
  const giftImages = images.slice(2);
  const videoUrl = videos[0]?.value || "";
  const buttonLink = links[0]?.value || "#";
  const additionalLinks = links.slice(1);

  const giftCards = [
    ...giftImages.map((img, index) => ({ id: `gift-${index}`, value: img.value, title: `Special Gift ${index + 1}`, type: "image" })),
    ...additionalLinks.map((link, index) => ({ id: `link-${index}`, value: link.value, title: `Collection ${index + 1}`, type: "link" })),
  ];

  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  return (
    <>
      <Head>
        <title>{content.heading || "Gift Collection"}</title>
      </Head>
      {content?.askUserDetails && templateId && <DynamicPopup templateId={templateId} />}

      <div className="min-h-screen" style={{ backgroundColor: content.backgroundColor || "#fef7f0" }}>
        {/* Hero */}
        <header className="relative h-[70vh] bg-cover bg-center flex flex-col justify-center items-center text-center px-6" style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : "linear-gradient(to right, #fb7185, #db2777)" }}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">{content.heading}</h1>
            <h2 className="text-xl md:text-2xl text-white/95 max-w-4xl drop-shadow-md">{content.subheading}</h2>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto px-6 py-20">
          {texts.map((text, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-lg mb-12 max-w-4xl mx-auto border border-rose-100 italic text-lg text-gray-700">
              "{text.value}"
            </div>
          ))}

          {featuredImage && <img src={featuredImage} className="w-full h-[500px] object-cover rounded-3xl shadow-2xl mb-20" />}

          {videoUrl && (
            <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-black mb-20">
              {getYouTubeVideoId(videoUrl) ? (
                <iframe src={`https://www.youtube.com/embed/${getYouTubeVideoId(videoUrl)}`} className="w-full h-[500px]" frameBorder="0" allowFullScreen></iframe>
              ) : (
                <video src={videoUrl} className="w-full h-[500px] object-cover" controls />
              )}
            </div>
          )}

          {buttonLink && (
            <div className="text-center mb-20">
              <a href={buttonLink} className="inline-flex items-center px-10 py-5 bg-rose-500 text-white font-bold text-xl rounded-full shadow-xl hover:scale-105 transition-all">
                Click Here <span className="ml-2">→</span>
              </a>
            </div>
          )}

          {giftCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {giftCards.map((card) => (
                <div key={card.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-rose-50 hover:shadow-2xl transition-all cursor-pointer" onClick={() => card.type === 'link' && window.open(card.value, '_blank')}>
                  <div className="aspect-square">
                    {card.type === 'image' ? (
                      <img src={card.value} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-rose-50 text-6xl">🎁</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-xl text-gray-800">{card.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
