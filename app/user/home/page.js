'use client';

import React from 'react';
import LeadForGrowHero from './F';
import AgencyOSLanding from './S';
import PricingPage from '@/app/plans/page';
import PricingSection from './P';
import ContactFormSection from './C';
import UserNavbar from '../Header';

export default function LeadForGrowHerods() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <UserNavbar></UserNavbar>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-8 py-20 mt-25">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-purple-600 rounded-full opacity-90 blur-sm"></div>
        <div className="absolute top-40 right-32 w-16 h-16 bg-pink-500 rounded-full opacity-80"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-emerald-400 rounded-full opacity-70"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-yellow-400 rounded-full opacity-75"></div>
        
        {/* Profile Images */}
        <div className="absolute top-32 left-20 w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl z-10">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="w-32 h-32 bg-gray-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute top-48 right-24 w-72 h-72 rounded-full overflow-hidden border-8 border-white shadow-2xl z-10">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="w-36 h-36 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Small Profile Badge */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20"style={{marginTop:"-70px"}}>
          <div className="bg-white rounded-full p-1 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-center mt-2 text-sm text-gray-600 font-medium">Hi, I'm Alex</p>
        </div>

        {/* Main Content */}
        <div className="relative z-20 text-center pt-40" style={{marginTop:"-130px"}}>
          <h1 className="text-7xl md:text-8xl font-serif text-gray-900 leading-tight ">
            Build pages. Manage<br />
            clients. Capture<br />
            leads. Track analytics.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-4 font-light">
            Scale your agency — all from one dashboard.
          </p>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            No more juggling tools. No more chaos. This is the platform agencies use to run their entire client operation.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition shadow-lg">
              Start Free Trial
            </button>
            <button className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-medium border-2 border-gray-900 hover:bg-gray-50 transition">
              Watch Demo
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Free 14-day trial
          </p>
        </div>

        {/* Decorative Arrows */}
        <div className="absolute bottom-10 left-12 text-gray-400">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
        
        <div className="absolute top-72 right-1/3 text-gray-400 transform rotate-180">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      </div>

    
      <LeadForGrowHero></LeadForGrowHero>
      <AgencyOSLanding></AgencyOSLanding>
      <PricingSection></PricingSection>
      <ContactFormSection></ContactFormSection>
    </div>
  );
}