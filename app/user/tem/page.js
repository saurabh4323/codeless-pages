"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "../Header";

export default function TemplatesGallery() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userid");
      const response = await fetch("/api/templatecreate", {
        headers: {
          "x-user-token": userId || ""
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      const data = await response.json();
      setTemplates(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTemplates(nextPage);
  };

  const handleTemplateSelect = (templateId, template) => {
    if (templateId === 'SPECIFIC_TESTIMONIAL_TEMPLATE_ID') {
      router.push('/acordial/create');
    } 
    else if (template && template.name === 'Testimonial Section') {
      router.push('/acordial/create');
    } 
    else if (template && template.type === 'testimonial') {
      router.push('/acordial/create');
    }
    else {
      router.push(`/user/tem/${templateId}`);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Templates Gallery - Create Amazing Content</title>
      </Head>

      {/* Navbar */}
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Templates Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover premium templates crafted to bring your ideas to life with
            stunning design and functionality
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8"
          >
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <span>Error: {error}</span>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {templates.map((template, index) => (
              <TemplateCard
                key={template._id}
                template={template}
                index={index}
                onSelect={() => handleTemplateSelect(template._id, template)}
                variants={cardVariants}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center my-12"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          </motion.div>
        )}

        {!loading && hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={loadMore}
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200"
            >
              Load More Templates
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function TemplateCard({ template, index, onSelect, variants }) {
  const typeIcons = {
    basic: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    article: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    gallery: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    portfolio: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    report: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  };

  const typeColors = {
    basic: {
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      arrowBg: "bg-gray-900",
    },
    article: {
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
      arrowBg: "bg-gray-900",
    },
    gallery: {
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      arrowBg: "bg-gray-900",
    },
    portfolio: {
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      arrowBg: "bg-gray-900",
    },
    report: {
      iconBg: "bg-pink-50",
      iconColor: "text-pink-500",
      arrowBg: "bg-gray-900",
    },
  };

  const colors = typeColors[template.type] || typeColors.basic;

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -8 }}
      className="group cursor-pointer"
      onClick={onSelect}
    >
      <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Icon */}
        <div className="mb-6">
          <div className={`${colors.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center ${colors.iconColor}`}>
            {typeIcons[template.type] || typeIcons.basic}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {template.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6">
          {template.description ||
            "Our deep understanding of project and program management has enabled the success of our clients."}
        </p>

        {/* Arrow */}
        <div className="flex items-center">
          <motion.div
            className="text-gray-900"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}