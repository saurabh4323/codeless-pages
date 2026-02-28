"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import DynamicPopup from "@/app/components/DynamicPopup";

export default function ThankyouPage({ previewContent = null }) {
  const [dbContent, setDbContent] = useState(null);
  const [loading, setLoading] = useState(!previewContent);
  const [error, setError] = useState("");
  const params = useParams();
  const id = params?.id;
  
  const content = previewContent || dbContent;
  const templateId = content?.templateId?._id || content?.templateId;

  useEffect(() => {
    if (previewContent) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const templateResponse = await fetch("/api/admin/templatecreate");
        const templateData = await templateResponse.json();

        if (!templateData.success) {
          throw new Error("Failed to fetch templates");
        }

        const thankyouPageTemplate = templateData.data.find((template) => {
          return template.name === "Thankyou Page";
        });

        if (!thankyouPageTemplate) {
          throw new Error("Template 'Thankyou Page' not found");
        }

        const templateId = thankyouPageTemplate._id;
        const contentResponse = await fetch("/api/upload");
        const contentData = await contentResponse.json();

        if (!contentData.success) {
          throw new Error("Failed to fetch content");
        }

        const filteredContent = contentData.content.find((content) => {
          const contentTemplateId = content.templateId?._id;
          const matchesTemplate =
            contentTemplateId &&
            contentTemplateId.toString() === templateId.toString();
          const matchesId = content._id.toString() === id;
          return matchesTemplate && matchesId;
        });

        if (!filteredContent) {
          setError("No content found for this template and ID");
          setLoading(false);
          return;
        }

        setDbContent(filteredContent);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, previewContent]);

  const renderVideo = (url) => {
    console.log("Video URL:", url);
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
      return (
        <div className="relative group">
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-2xl shadow-xl border border-gray-100 transition-transform duration-300 group-hover:scale-102"
          />
        </div>
      );
    } else if (url.includes("mux.com")) {
      return (
        <div className="relative group">
          <video
            width="100%"
            height="500"
            controls
            src={url}
            className="rounded-2xl shadow-xl border border-gray-100"
          />
        </div>
      );
    } else {
      console.error("Unsupported video platform:", url);
      return <p className="text-red-600">Unsupported video platform</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mx-auto mb-6"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-purple-400/30 border-b-purple-400 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <p className="text-xl font-medium text-white/80 animate-pulse">
            Loading your content...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-800 p-4">
        <div className="bg-white/5 backdrop-blur-lg p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-white/10">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="h-8 w-8 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">
            Something went wrong
          </h3>
          <p className="text-red-300 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
        <p className="text-xl font-medium text-white/70">
          No content available.
        </p>
      </div>
    );
  }

  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
  }));

  const linkSection = sections.find((section) => section.type === "link");
  const backgroundImageSection = sections.find(
    (section) => section.type === "image"
  );
  const videoSection = sections.find((section) => section.type === "video");
  const textSections = sections.filter((section) => section.type === "text");
  
  // Separate body text from button label
  const bodyTextSections = textSections.length > 1 ? textSections.slice(0, -1) : textSections;
  const buttonTextLabel = textSections.length > 1 ? textSections[textSections.length - 1].value : "Continue Your Journey";

  return (
    <>
        {content?.askUserDetails && templateId && <DynamicPopup templateId={templateId} />}
      <Head>
        <title>{content.heading} | Thank You</title>
        <meta name="description" content="Thank you for your action!" />
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Background with overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: backgroundImageSection?.value
              ? `url(${backgroundImageSection.value})`
              : "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 via-transparent to-purple-900/20"></div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Top/Center Content section */}
          <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            {/* Heading */}
            <div className="text-center mb-20 max-w-5xl">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 mb-8 leading-tight tracking-tight">
                {content.heading}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-purple-400 mx-auto rounded-full mb-10"></div>
              {content.subheading && (
                <p className="text-xl sm:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
                  {content.subheading}
                </p>
              )}
            </div>
 
            {/* Video section */}
            <div className="w-full max-w-5xl mb-24 px-4">
              {videoSection ? (
                renderVideo(videoSection.value)
              ) : (
                <div className="w-full max-w-4xl mx-auto h-64 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center">
                  <p className="text-white/60 text-lg">No video available</p>
                </div>
              )}
            </div>
 
            {/* Body text */}
            <div className="text-center mb-12 max-w-4xl px-4 space-y-6">
              {bodyTextSections.length > 0 ? (
                bodyTextSections.map((s, idx) => (
                  <p key={idx} className="text-xl sm:text-2xl text-white/90 leading-relaxed font-light tracking-wide">
                    {s.value}
                  </p>
                ))
              ) : (
                <p className="text-xl text-white/60 leading-relaxed italic">
                  No description available.
                </p>
              )}
            </div>
          </div>
 
          {/* Bottom Button section */}
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-24 text-center">
            {linkSection?.value ? (
              <a
                href={linkSection.value}
                className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-400/50 w-full sm:w-auto min-w-[280px] max-w-md mx-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 rounded-3xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-teal-500/25"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-4 text-center">
                  <span className="truncate max-w-[320px]">
                    {buttonTextLabel.length > 40 ? "Continue Experience" : buttonTextLabel}
                  </span>
                  <svg
                    className="w-6 h-6 flex-shrink-0 transform group-hover:translate-x-2 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </a>
            ) : (
              <div className="px-12 py-4 bg-white/10 backdrop-blur-sm text-white/60 rounded-2xl border border-white/20 inline-block text-sm font-medium">
                No action available
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
