"use client";
import { useState } from "react";
import UserNavbar from "../user/Header";

// Lead Generation Templates
const templates = [
  {
    name: "Landing Page",
    description: "We run our service on Google Cloud, which guarantees premium availability and reliability and one of the fastest networks out there.",
    redirect: "/layouts/layoutone",
    iconType: "layout",
    type: "marketing",
    featured: false,
  },
  {
    name: "Payment Page",
    description: "We are consistently among the first to integrate and offer the latest speed technologies such as the newest PHP versions.",
    redirect: "/layouts/layouttwo",
    iconType: "card",
    type: "commerce",
    featured: true,
  },
  {
    name: "Thank You Page",
    description: "We developed a custom PHP setup that cuts the TTFB (time to first byte) and makes the overall resource usage more efficient.",
    redirect: "/layouts/layoutthree",
    iconType: "heart",
    type: "conversion",
    featured: false,
  },
  {
    name: "Testimonial Image",
    description: "Free CDN powered by CloudFlare allows you to cache content and serve it from servers closest to your visitors for faster web serving.",
    redirect: "/layouts/layoutfour",
    iconType: "image",
    type: "social proof",
    featured: false,
  },
  {
    name: "Testimonial",
    description: "Our MySQL setup allows for a large number of requests to be processed simultaneously and masterfully handles heavy queries.",
    redirect: "/acordial/publish",
    iconType: "message",
    type: "social proof",
    featured: false,
  },
  {
    name: "All Products",
    description: "For WordPress sites we have developed a powerful plugin that gives you control over the server and make it significantly faster.",
    redirect: "/layouts/layoutsix",
    iconType: "package",
    type: "catalog",
    featured: false,
  },
  {
    name: "Gift Page",
    description: "We run our service on Google Cloud, which guarantees premium availability and reliability and one of the fastest networks out there.",
    redirect: "/layouts/layoutseven",
    iconType: "gift",
    type: "promotion",
    featured: false,
  },
  {
    name: "Video Testimonial",
    description: "We are consistently among the first to integrate and offer the latest speed technologies such as the newest PHP versions.",
    redirect: "/layouts/layouteight",
    iconType: "video",
    type: "social proof",
    featured: false,
  },
  {
    name: "Main Thank You",
    description: "We developed a custom PHP setup that cuts the TTFB (time to first byte) and makes the overall resource usage more efficient.",
    redirect: "/layouts/layoutnine",
    iconType: "check",
    type: "conversion",
    featured: false,
  },
  {
    name: "Basic",
    description: "Free CDN powered by CloudFlare allows you to cache content and serve it from servers closest to your visitors for faster web serving.",
    redirect: "/layouts/layoutten",
    iconType: "file",
    type: "basic",
    featured: false,
  },
  {
    name: "Form",
    description: "Our MySQL setup allows for a large number of requests to be processed simultaneously and masterfully handles heavy queries.",
    redirect: "/layouts/layouteleven",
    iconType: "book",
    type: "lead capture",
    featured: false,
  },
];

const Icon = ({ type, className }) => {
  const icons = {
    layout: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
      </svg>
    ),
    card: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    heart: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    image: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    message: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    package: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    gift: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    video: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    check: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    file: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    book: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  };
  
  return icons[type] || icons.layout;
};

export default function YourPublishedContent() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
    <UserNavbar></UserNavbar>
      <div className="max-w-7xl mx-auto">
      

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-20">
            Lead Generation Content
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our collection of high-converting templates designed to capture and nurture leads effectively.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <div
              key={template.name + index}
              className="group cursor-pointer transform transition-transform duration-200 hover:-translate-y-1"
              onClick={() => (window.location.href = template.redirect)}
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-gray-900">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100">
                    <Icon 
                      type={template.iconType} 
                      className="h-8 w-8 text-gray-700"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {template.name}
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-sm">
                    {template.description}
                  </p>
                </div>

                {/* Type Badge */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
                    {template.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}