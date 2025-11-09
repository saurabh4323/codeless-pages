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
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
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
    <div className="min-h-screen bg-[#0a0e27] text-white relative overflow-hidden pt-20">
      <Head>
        <title>Templates Gallery - Create Amazing Content</title>
      </Head>

      {/* Navbar with higher z-index */}
      <div className="relative z-50">
        <UserNavbar />
      </div>

      {/* Animated hexagon pattern background */}
      <div className="absolute inset-0 overflow-hidden z-0 opacity-20">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              <path d="M24.9 0L49.8 14.5v29L24.9 58 0 43.4v-29L24.9 0z" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)"/>
        </svg>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div 
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div 
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div 
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      {/* Glowing lines */}
      <div className="absolute inset-0 overflow-hidden z-0 opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              left: 0,
              right: 0,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            animate={{
              textShadow: [
                "0 0 20px rgba(139, 92, 246, 0.5)",
                "0 0 40px rgba(139, 92, 246, 0.3)",
                "0 0 20px rgba(139, 92, 246, 0.5)",
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Templates Gallery
          </motion.h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Discover premium templates crafted to bring your ideas to life with
            stunning design and functionality
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/30 border border-red-500/50 text-red-300 p-6 rounded-lg mb-8 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
              <span>Error: {error}</span>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
            className="flex justify-center my-16"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
              <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-r-4 border-l-4 border-blue-500" style={{ animationDirection: 'reverse' }}></div>
            </div>
          </motion.div>
        )}

        {!loading && hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-16"
          >
            <button
              onClick={loadMore}
              className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              <span className="relative z-10">Load More Templates</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
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
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    article: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    gallery: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    portfolio: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    ),
    report: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  };

  const typeColors = {
    basic: {
      bg: "bg-gradient-to-br from-blue-900/40 to-blue-800/40",
      icon: "text-blue-400",
      gradient: "from-blue-500 to-blue-600",
      border: "border-blue-500/30",
      hover: "hover:border-blue-400/50",
      accent: "bg-gradient-to-r from-blue-500 to-blue-600",
      glow: "shadow-blue-500/50",
    },
    article: {
      bg: "bg-gradient-to-br from-green-900/40 to-green-800/40",
      icon: "text-green-400",
      gradient: "from-green-500 to-green-600",
      border: "border-green-500/30",
      hover: "hover:border-green-400/50",
      accent: "bg-gradient-to-r from-green-500 to-green-600",
      glow: "shadow-green-500/50",
    },
    gallery: {
      bg: "bg-gradient-to-br from-purple-900/40 to-purple-800/40",
      icon: "text-purple-400",
      gradient: "from-purple-500 to-purple-600",
      border: "border-purple-500/30",
      hover: "hover:border-purple-400/50",
      accent: "bg-gradient-to-r from-purple-500 to-purple-600",
      glow: "shadow-purple-500/50",
    },
    portfolio: {
      bg: "bg-gradient-to-br from-orange-900/40 to-orange-800/40",
      icon: "text-orange-400",
      gradient: "from-orange-500 to-orange-600",
      border: "border-orange-500/30",
      hover: "hover:border-orange-400/50",
      accent: "bg-gradient-to-r from-orange-500 to-orange-600",
      glow: "shadow-orange-500/50",
    },
    report: {
      bg: "bg-gradient-to-br from-pink-900/40 to-pink-800/40",
      icon: "text-pink-400",
      gradient: "from-pink-500 to-pink-600",
      border: "border-pink-500/30",
      hover: "hover:border-pink-400/50",
      accent: "bg-gradient-to-r from-pink-500 to-pink-600",
      glow: "shadow-pink-500/50",
    },
  };

  const colors = typeColors[template.type] || typeColors.basic;

  return (
    <motion.div
      variants={variants}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 },
      }}
      className="group cursor-pointer"
      onClick={onSelect}
    >
      <div className={`relative bg-[#1a1f3a]/80 backdrop-blur-md rounded-xl border ${colors.border} ${colors.hover} overflow-hidden shadow-xl hover:shadow-2xl hover:${colors.glow} transition-all duration-300 transform-gpu`}>
        {/* Gradient overlay on hover */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          whileHover={{
            opacity: 0.1
          }}
        />
        
        {/* Animated border glow */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.gradient} rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-500`}></div>
        
        {/* Content */}
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className={`${colors.bg} rounded-xl p-4 backdrop-blur-sm border ${colors.border}`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <div className={colors.icon}>
                {typeIcons[template.type] || typeIcons.basic}
              </div>
            </motion.div>

            {/* Arrow icon */}
            <motion.div 
              className={`${colors.accent} rounded-full p-2 shadow-lg`}
              whileHover={{ scale: 1.1, x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </motion.div>
          </div>

          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-all duration-300 leading-tight">
            {template.name}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
            {template.description ||
              "A carefully crafted template designed to help you create professional content with ease."}
          </p>

          {/* Template metadata */}
          <div className="flex items-center justify-between text-xs mb-4">
            <span className={`capitalize ${colors.bg} ${colors.icon} px-3 py-1 rounded-full font-medium border ${colors.border}`}>
              {template.type} template
            </span>
            <span className="text-gray-500">
              {new Date(template.updatedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Hover effect indicators */}
          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className={`text-xs ${colors.icon} font-medium`}>
              Click to explore
            </span>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1.5 h-1.5 ${colors.accent} rounded-full`}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom accent line */}
          <motion.div 
            className={`absolute bottom-0 left-0 right-0 h-1 ${colors.accent}`}
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}