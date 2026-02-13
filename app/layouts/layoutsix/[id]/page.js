"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import DynamicPopup from "@/app/components/DynamicPopup";

// CSS animations
const fadeInClass = "animate-fade-in";
const slideInClass = "animate-slide-in";
const scaleInClass = "animate-scale-in";

const PopupForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const hasSubmitted = sessionStorage.getItem("dataSubmitted");
    if (!hasSubmitted) {
      setIsOpen(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/popop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      sessionStorage.setItem("dataSubmitted", "true");

      setFormData({
        name: "",
        email: "",
        phone: "",
      });
      setIsOpen(false);

      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
    });
    setErrors({});
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .animate-slide-in { animation: slideIn 0.6s ease-out; }
        .animate-scale-in { animation: scaleIn 0.5s ease-out; }
        .animate-bounce-slow { animation: bounce 2s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 2s infinite; }
        .animation-delay-1 { animation-delay: 0.2s; }
        .animation-delay-2 { animation-delay: 0.4s; }
        .animation-delay-3 { animation-delay: 0.6s; }
      `}</style>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-scale-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Fill this please</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${errors.name ? "border-red-500" : "border-gray-300"}`} placeholder="Enter your full name" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${errors.email ? "border-red-500" : "border-gray-300"}`} placeholder="Enter your email address" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${errors.phone ? "border-red-500" : "border-gray-300"}`} placeholder="Enter your phone number" />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">Cancel</button>
                <button type="button" onClick={handleSubmit} disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function LayoutSix({ previewContent = null }) {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 border-4 border-t-purple-300 border-purple-500/20 rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-xl font-medium text-purple-300 animate-pulse-slow">Loading your content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-3xl p-8 max-w-md w-full border border-red-500/30 text-center animate-scale-in">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Oops! Something went wrong</h3>
          <p className="text-sm text-red-300 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="w-full bg-red-600 text-white font-semibold py-4 rounded-2xl hover:bg-red-700 transition-all">Try Again</button>
        </div>
      </div>
    );
  }

  if (!content) return null;

  const sections = Object.keys(content.sections || {}).map((sectionId) => ({
    id: sectionId,
    type: content.sections[sectionId].type,
    value: content.sections[sectionId].value,
  }));

  const images = sections.filter((section) => section.type === "image");
  const texts = sections.filter((section) => section.type === "text");
  const links = sections.filter((section) => section.type === "link");

  const backgroundImage = images[0]?.value || "";
  const remainingImages = images.slice(1);

  const contentItems = remainingImages.map((image, index) => ({
    image: image,
    text: texts[index] || null,
    link: links[index] || null,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Head>
        <title>{content.heading} | Lead Magnet</title>
        <meta name="description" content={content.subheading} />
      </Head>

      <PopupForm />
      {content?.askUserDetails && templateId && <DynamicPopup templateId={templateId} />}

      <div className="relative">
        <div className="relative h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className="absolute inset-0 bg-slate-900/70"></div>
          <div className="relative h-full flex items-center justify-center px-4 z-10">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 text-white">{content.heading}</h1>
              <h2 className="text-lg sm:text-2xl text-gray-200 max-w-4xl mx-auto">{content.subheading}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto py-20 px-4">
        <div className="space-y-24">
          {contentItems.map((item, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 0 ? "" : "lg:flex-row-reverse"}`}>
              <div className={index % 2 === 0 ? "order-1" : "lg:order-2"}>
                <img src={item.image.value} className="w-full h-80 object-cover rounded-2xl shadow-2xl border border-slate-700" />
              </div>
              <div className={index % 2 === 0 ? "order-2" : "lg:order-1"}>
                <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700">
                  <p className="text-slate-300 text-lg">{item.text?.value || "No description available"}</p>
                  {item.link && (
                    <a href={item.link.value} target="_blank" className="mt-6 block bg-purple-600 text-white font-semibold py-4 rounded-xl text-center hover:bg-purple-700">Explore More</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
