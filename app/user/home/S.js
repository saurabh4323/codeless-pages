import React from 'react';
import { Check } from 'lucide-react';

export default function AgencyOSLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <main className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          {/* Left Illustration */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12 overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-6 right-6 w-3 h-3 bg-blue-300 rounded-full"></div>
              <div className="absolute bottom-12 left-8 w-16 h-12 border-2 border-white/40 rounded-lg rotate-12"></div>
              <div className="absolute bottom-6 right-12 w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="absolute top-1/3 right-12 opacity-30">
                <div className="w-12 h-16 border-2 border-blue-200 rounded-lg flex flex-col items-center justify-center gap-1">
                  <div className="w-6 h-1 bg-blue-200 rounded"></div>
                  <div className="w-6 h-1 bg-blue-200 rounded"></div>
                </div>
              </div>
              <div className="absolute bottom-16 right-6">
                <div className="w-10 h-10 bg-blue-200 rounded-lg transform rotate-45"></div>
              </div>

              {/* Left person holding yellow puzzle */}
              <div className="absolute left-8 top-1/4 z-10">
                <div className="relative">
                  {/* Person body */}
                  <div className="w-20 h-28 bg-gradient-to-b from-blue-500 to-blue-600 rounded-t-full relative">
                    {/* Arms */}
                    <div className="absolute -left-6 top-8 w-12 h-20 bg-blue-500 rounded-full transform -rotate-45"></div>
                  </div>
                  {/* Head */}
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-800 to-amber-900 rounded-full absolute -top-12 left-2"></div>
                  {/* Lower body */}
                  <div className="absolute -bottom-8 left-2 w-16 h-12 bg-red-500 rounded-b-full"></div>
                  
                  {/* Yellow puzzle piece being held */}
                  <div className="absolute -top-24 -left-8 w-32 h-32 transform rotate-12">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path d="M10,10 L50,10 Q60,10 60,20 L60,35 Q70,35 75,40 Q70,45 60,45 L60,90 L10,90 Z" 
                            fill="#FCD34D" 
                            stroke="#F59E0B" 
                            strokeWidth="1.5"/>
                      <line x1="15" y1="20" x2="45" y2="50" stroke="#F59E0B" strokeWidth="1" opacity="0.3"/>
                      <line x1="45" y1="20" x2="15" y2="50" stroke="#F59E0B" strokeWidth="1" opacity="0.3"/>
                      <line x1="20" y1="60" x2="50" y2="80" stroke="#F59E0B" strokeWidth="1" opacity="0.3"/>
                      <line x1="50" y1="60" x2="20" y2="80" stroke="#F59E0B" strokeWidth="1" opacity="0.3"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right person holding blue puzzle */}
              <div className="absolute right-8 top-1/3 z-10">
                <div className="relative">
                  {/* Person body */}
                  <div className="w-20 h-28 bg-gradient-to-b from-orange-500 to-orange-600 rounded-t-full relative">
                    {/* Arms */}
                    <div className="absolute -right-6 top-8 w-12 h-20 bg-orange-500 rounded-full transform rotate-45"></div>
                  </div>
                  {/* Head */}
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full absolute -top-12 left-2"></div>
                  {/* Lower body */}
                  <div className="absolute -bottom-12 left-2 w-16 h-16 bg-yellow-500 rounded-b-full"></div>
                  <div className="absolute -bottom-12 -right-2 w-8 h-8 bg-slate-800 rounded-full"></div>
                  
                  {/* Blue puzzle piece being held */}
                  <div className="absolute -top-24 -right-12 w-36 h-36 transform -rotate-6">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path d="M20,10 L80,10 L80,40 Q80,50 70,50 Q60,50 60,60 Q60,50 50,50 L40,50 Q40,60 35,65 Q30,60 30,50 L30,90 L20,90 Z" 
                            fill="#3B82F6" 
                            stroke="#2563EB" 
                            strokeWidth="1.5"/>
                      <circle cx="40" cy="50" r="15" fill="none" stroke="#60A5FA" strokeWidth="1.5" opacity="0.5"/>
                      <line x1="45" y1="25" x2="65" y2="25" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                      <line x1="55" y1="20" x2="55" y2="30" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Lightbulb in center */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                  {/* Rays */}
                  <div className="absolute -top-3 left-1/2 w-0.5 h-4 bg-blue-300 transform -translate-x-1/2"></div>
                  <div className="absolute -bottom-3 left-1/2 w-0.5 h-4 bg-blue-300 transform -translate-x-1/2"></div>
                  <div className="absolute top-1/2 -left-4 w-4 h-0.5 bg-blue-300 transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-blue-300 transform -translate-y-1/2"></div>
                  
                  {/* Bulb outline */}
                  <svg width="48" height="48" viewBox="0 0 48 48" className="relative">
                    <path d="M24,8 Q30,8 34,12 Q38,16 38,22 Q38,26 36,29 L32,29 Q32,32 28,32 L20,32 Q16,32 16,29 L12,29 Q10,26 10,22 Q10,16 14,12 Q18,8 24,8 Z" 
                          fill="white" 
                          stroke="#93C5FD" 
                          strokeWidth="2"/>
                    <rect x="20" y="32" width="8" height="4" fill="#D1D5DB" stroke="#93C5FD" strokeWidth="1"/>
                    <line x1="20" y1="28" x2="28" y2="28" stroke="#93C5FD" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            <div className="text-sm text-orange-500 ">
              Over <span className="underline">150,000+ client</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Providing Services with top quality.
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Things go wrong have questions. We've understand. So we have people
            </p>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700">Amazing communication.</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700">Best trending designing experience.</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700">Email & Live chat.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl lg:text-6xl  bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent mb-2">
              20M+
            </div>
            <div className="text-gray-600">3,280 avg rating</div>
          </div>

          <div>
            <div className="text-5xl lg:text-6xl  bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
              50k+
            </div>
            <div className="text-gray-600">Contact Profile</div>
          </div>

          <div>
            <div className="text-5xl lg:text-6xl  bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent mb-2">
              3000+
            </div>
            <div className="text-gray-600">Using LFG</div>
          </div>
        </div>
      </main>
    </div>
  );
}