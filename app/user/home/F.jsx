import React from "react";

export default function LeadForGrowHero() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden relative">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-20 left-0 w-32 h-32 bg-blue-500 rounded-full -translate-x-1/2"></div>
      <div className="absolute top-1/2 left-12 w-12 h-12 bg-emerald-400 rounded-full"></div>
      <div className="absolute bottom-0 right-32 w-20 h-20 bg-orange-500 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-pink-500 rounded-full translate-y-1/2 translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">

        {/* ROW 1: Headline + 2 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
          
          {/* Heading */}
          <div>
            <h2 className="text-5xl md:text-6xl font-normal text-gray-900 leading-tight">
              Let's<br />
              Discover all our<br />
              Services.
            </h2>
          </div>

          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mb-6">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <rect x="8" y="16" width="20" height="4" fill="#22D3EE" rx="2" />
                <rect x="8" y="24" width="20" height="4" fill="#F472B6" rx="2" />
                <rect x="8" y="32" width="20" height="4" fill="#FBBF24" rx="2" />
                <path d="M36 12 L52 20 L52 44 L36 52 L20 44 L20 20 Z" stroke="#22D3EE" strokeWidth="3" fill="none" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No-Code Pages</h3>
            <p className="text-gray-600 mb-6">
              Build landing pages, funnels & payment pages — fast.
            </p>
            <span className="text-2xl">→</span>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mb-6">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <rect x="12" y="10" width="12" height="6" fill="#FBBF24" rx="2" />
                <rect x="28" y="10" width="12" height="6" fill="#60A5FA" rx="2" />
                <rect x="44" y="10" width="8" height="6" fill="#F472B6" rx="2" />
                <path d="M16 22 L16 50 M32 22 L32 50 M48 22 L48 50" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Client Accounts</h3>
            <p className="text-gray-600 mb-6">
              Manage multiple clients with separate access & data.
            </p>
            <span className="text-2xl">→</span>
          </div>

        </div>

        {/* ROW 2: Remaining Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mb-6">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <path d="M12 28 L28 12 L44 28" stroke="#EF4444" strokeWidth="3" fill="none" strokeLinecap="round" />
                <circle cx="28" cy="28" r="8" fill="#22D3EE" />
                <path d="M20 36 L36 52" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Lead Management</h3>
            <p className="text-gray-600 mb-6">
              Capture, track & manage leads in one dashboard.
            </p>
            <span className="text-2xl">→</span>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mb-6">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <rect x="8" y="32" width="6" height="20" fill="#22D3EE" rx="2" />
                <rect x="18" y="24" width="6" height="28" fill="#60A5FA" rx="2" />
                <rect x="28" y="16" width="6" height="36" fill="#A78BFA" rx="2" />
                <rect x="38" y="20" width="6" height="32" fill="#F472B6" rx="2" />
                <rect x="48" y="28" width="6" height="24" fill="#FBBF24" rx="2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics & Reports</h3>
            <p className="text-gray-600 mb-6">
              Track performance, conversions & client ROI.
            </p>
            <span className="text-2xl">→</span>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mb-6">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <circle cx="20" cy="32" r="8" fill="#22D3EE" />
                <circle cx="44" cy="32" r="8" fill="#34D399" />
                <path d="M28 32 L36 32" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Domain & Links</h3>
            <p className="text-gray-600 mb-6">
              Custom domains, short links & campaign tracking.
            </p>
            <span className="text-2xl">→</span>
          </div>

        </div>
      </div>
    </div>
  );
}
