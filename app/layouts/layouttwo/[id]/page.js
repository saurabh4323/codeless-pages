"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import DynamicPopup from "@/app/components/DynamicPopup";

export default function PaymentPage({ previewContent = null }) {
  const [dbContent, setDbContent] = useState(null);
  const [loading, setLoading] = useState(!previewContent);
  const [error, setError] = useState("");
  const params = useParams();
  const id = params?.id;
  
  const content = previewContent || dbContent;
  // Get template ID from content data
  const templateId = content?.templateId?._id || content?.templateId;

  useEffect(() => {
    if (previewContent) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch templates
        console.log("Fetching templates from /api/admin/templatecreate...");
        const templateResponse = await fetch("/api/admin/templatecreate");
        console.log("Template Response Status:", templateResponse.status);
        const templateData = await templateResponse.json();
        console.log("Template Data:", templateData);

        if (!templateData.success) {
          throw new Error("Failed to fetch templates");
        }

        console.log("Templates List:", templateData.data);

        // Step 2: Find the "Payment Page" template
        console.log("Searching for template named 'Payment Page'...");
        const paymentPageTemplate = templateData.data.find((template) => {
          console.log(
            `Comparing template name: "${template.name}" with "Payment Page"`
          );
          return template.name === "Payment Page";
        });

        if (!paymentPageTemplate) {
          console.log("Template 'Payment Page' not found in the data.");
          throw new Error("Template 'Payment Page' not found");
        }

        console.log("Found Template:", paymentPageTemplate);
        const templateId = paymentPageTemplate._id;
        console.log("Template ID:", templateId);

        // Step 3: Fetch content associated with this templateId
        console.log("Fetching content from /api/upload...");
        const contentResponse = await fetch("/api/upload");
        console.log("Content Response Status:", contentResponse.status);
        const contentData = await contentResponse.json();
        console.log("Content Data:", contentData);

        if (!contentData.success) {
          throw new Error("Failed to fetch content");
        }

        console.log("All Content Entries:", contentData.content);

        // Step 4: Filter content by templateId and the specific content ID
        console.log(
          `Filtering content for templateId: ${templateId} and content ID: ${id}`
        );
        const filteredContent = contentData.content.find((content) => {
          const contentTemplateId = content.templateId?._id;
          const matchesTemplate =
            contentTemplateId &&
            contentTemplateId.toString() === templateId.toString();
          const matchesId = content._id.toString() === id;
          console.log(
            `Content ID: ${content._id}, Template ID: ${contentTemplateId}, Matches Template: ${matchesTemplate}, Matches ID: ${matchesId}`
          );
          return matchesTemplate && matchesId;
        });

        if (!filteredContent) {
          console.log("No content found for this template and ID.");
          setError("No content found for this template and ID");
          setLoading(false);
          return;
        }

        console.log("Filtered Content:", filteredContent);
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

  const renderImage = (url) => (
    <div className="relative group overflow-hidden rounded-2xl">
      <img
        src={url}
        alt="Section Image"
        className="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );

  const handleCTAClick = (link) => {
    if (link) {
      // Check if it's an external link or internal
      if (link.startsWith('http://') || link.startsWith('https://')) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = link;
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyan-400 rounded-full animate-pulse mx-auto"></div>
          </div>
          <p className="text-xl font-semibold text-gray-800 animate-pulse">Loading your experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-md w-full text-center border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xl font-medium text-gray-600">Content not available</p>
        </div>
      </div>
    );
  }

  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
  }));

  const imageSections = sections.filter(
    (section) => section.type === "image" && section.value
  );
  const textSections = sections.filter(
    (section) => section.type === "text" && section.value
  );
  const linkSections = sections.filter(
    (section) => section.type === "link" && section.value
  );

  // Get available sections dynamically
  const leftImage = imageSections[0];
  const rightImage = imageSections[1];
  const rightText = textSections[0];
  const bottomText1 = textSections[1];
  const bottomText2 = textSections[2];
  const primaryLink = linkSections[0];

  return (
    <>
      {content?.askUserDetails && templateId && <DynamicPopup templateId={templateId} />}
      <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #4f46e5 2px, transparent 0), radial-gradient(circle at 75px 75px, #06b6d4 2px, transparent 0)`,
              backgroundSize: '100px 100px'
            }}></div>
          </div>
          
          <div key={content._id} className="relative">
            <Head>
              <title>{content.heading} | Payment Page</title>
              <meta name="description" content={content.subheading} />
            </Head>

            {/* Header Section */}
            <div className="max-w-7xl mx-auto text-center py-20 px-4 sm:px-6 lg:px-8">
              <div className="space-y-8">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 leading-tight">
                  {content.heading}
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {content.subheading}
                </h2>
              </div>
            </div>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pb-20">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 -mx-2">
                
                {/* Left Column */}
                <div className="space-y-6 px-2">
                  {/* First Image */}
                  {leftImage && (
                    <div className="rounded-2xl overflow-hidden shadow-2xl">
                      {renderImage(leftImage.value)}
                    </div>
                  )}
                  
                  {/* Text Section Below First Image */}
                  {rightText && (
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                      <p className="text-lg text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                        {rightText.value}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6 px-2">
                  {/* Second Image */}
                  {rightImage && (
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                      {renderImage(rightImage.value)}
                    </div>
                  )}
                  
                  {/* Two Text Sections Below Second Image */}
                  {bottomText1 && (
                    <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
                      <p className="text-lg text-gray-700 leading-relaxed font-medium whitespace-pre-wrap group-hover:text-gray-800 transition-colors">
                        {bottomText1.value}
                      </p>
                    </div>
                  )}

                  {bottomText2 && (
                    <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
                      <p className="text-lg text-gray-700 leading-relaxed font-medium whitespace-pre-wrap group-hover:text-gray-800 transition-colors">
                        {bottomText2.value}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Call to Action Section */}
              <div className="text-center mt-12">
                <div className="inline-flex flex-col sm:flex-row items-center gap-6">
                  {primaryLink ? (
                    <button
                      onClick={() => handleCTAClick(primaryLink.value)}
                      className="group relative px-12 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                      <span className="relative z-10">Proceed to Payment</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  ) : (
                    <button className="group relative px-12 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                      <span className="relative z-10">Proceed to Payment</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  )}
                </div>
                <p className="mt-4 text-sm text-gray-500">Secure payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}