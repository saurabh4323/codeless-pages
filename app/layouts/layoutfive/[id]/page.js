"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import { ChevronDown, ChevronUp, Video, FileText, Award } from "lucide-react";
import DynamicPopup from "@/app/components/DynamicPopup";

export default function LayoutFive({ previewContent = null }) {
  const [dbContent, setDbContent] = useState(null);
  const [groupedSections, setGroupedSections] = useState([]);
  const [openGuides, setOpenGuides] = useState(new Set());
  const [loading, setLoading] = useState(!previewContent);
  const [error, setError] = useState("");
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  
  const content = previewContent || dbContent;
  const templateId = content?.templateId?._id || content?.templateId;

  // Sync grouped sections whenever content changes
  useEffect(() => {
    if (content) {
      const sections = Object.keys(content.sections || {}).map((sectionId) => ({
        id: sectionId,
        type: content.sections[sectionId].type,
        value: content.sections[sectionId].value,
      }));
      
      const groups = [];
      if (sections.length > 0) {
        if (sections.length >= 7) {
          groups.push(sections.slice(0, 7));
          let remainingSections = sections.slice(7);
          while (remainingSections.length > 0) {
            groups.push(remainingSections.slice(0, 6));
            remainingSections = remainingSections.slice(6);
          }
        } else {
          groups.push(sections);
        }
      }
      setGroupedSections(groups);
    }
  }, [content]);

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

        const testimonialSectionTemplate = templateData.data.find(
          (template) => template.name === "Testimonial Section"
        );

        if (!testimonialSectionTemplate) {
          throw new Error("Template 'Testimonial Section' not found");
        }

        const templateId = testimonialSectionTemplate._id;
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
    if (!url || typeof url !== "string") {
      return <p className="text-lg text-gray-600 italic">Invalid video URL</p>;
    }
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
      if (!videoId) {
        return <p className="text-lg text-gray-600 italic">Invalid video URL</p>;
      }
      return (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <iframe
            width="100%"
            height="300"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      );
    } else if (url.includes("mux.com")) {
      return (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <video
            width="100%"
            height="300"
            controls
            src={url}
            className="rounded-lg"
          />
        </div>
      );
    } else {
      return <p className="text-lg text-gray-600 italic">Unsupported video platform</p>;
    }
  };

  const renderText = (text) => {
    if (!text || typeof text !== "string") {
      return <p className="text-lg text-gray-600 leading-relaxed italic">No testimonial text available.</p>;
    }
    return (
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <p className="text-lg text-gray-800 leading-relaxed">{text}</p>
      </div>
    );
  };

  const toggleGuide = (index) => {
    const newOpenGuides = new Set(openGuides);
    if (newOpenGuides.has(index)) {
      newOpenGuides.delete(index);
    } else {
      newOpenGuides.add(index);
    }
    setOpenGuides(newOpenGuides);
  };

  const getSectionStats = (sections) => {
    const videoCount = sections.filter((s) => s.type === "video").length;
    const textCount = sections.filter((s) => s.type === "text").length;
    return `${sections.length} items • ${videoCount} videos • ${textCount} reviews`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-yellow-50 to-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-300 border-t-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-800">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-red-50 to-pink-50">
        <div className="bg-white shadow-xl p-8 rounded-xl max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">!</span>
          </div>
          <p className="text-lg font-medium text-gray-800 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-yellow-50 to-amber-50">
        <p className="text-xl font-medium text-gray-800">No content found.</p>
      </div>
    );
  }

  return (
    <>
        {content?.askUserDetails && templateId && <DynamicPopup templateId={templateId} />}
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-amber-50">
        <Head>
          <title>{content.heading} | Professional Testimonials</title>
          <meta name="description" content={content.subheading} />
        </Head>

        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-3 rounded-full shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">
              {content.heading}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {content.subheading}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-4">
            {groupedSections.length === 0 ? (
              <p className="text-lg text-gray-600 text-center">No testimonials available for this content.</p>
            ) : (
              groupedSections.map((sections, index) => {
                const isOpen = openGuides.has(index);
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <button
                      onClick={() => toggleGuide(index)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">Guide {index + 1}</h3>
                            <p className="text-sm text-gray-600">{getSectionStats(sections)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Video className="w-5 h-5 text-yellow-500" />
                          <FileText className="w-5 h-5 text-amber-500" />
                          {isOpen ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                        </div>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-gray-200 p-4">
                        <div className="space-y-4">
                          {sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="p-4 border border-gray-200 rounded-lg">
                              {section.type === "text" ? renderText(section.value) : renderVideo(section.value)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/layouts/layoutfive")}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-semibold rounded-lg shadow-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-300"
            >
              ← Back to All Testimonials
            </button>
          </div>
        </div>
      </div>
    </>
  );
}