import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('monthly');

const plans = [
  {
    name: 'Starter',
    price: '₹5,000',
    users: '1 agency admin • up to 2 clients',
    features: [
      'No-code page builder',
      'Up to 5 pages',
      'Lead capture forms',
      'Basic analytics',
      'Platform subdomain',
      'Email support'
    ],
    popular: false
  },
  {
    name: 'Agency',
    price: '₹8,000',
    users: 'Up to 5 team users • 10 clients',
    features: [
      'Unlimited pages',
      'Client accounts',
      'Client-wise leads & analytics',
      'Custom domains',
      'Role & permission control',
      'URL shortener & tracking',
      'Email & live chat support'
    ],
    popular: true
  },
  {
    name: 'Pro Agency',
    price: '₹15,000',
    users: 'Up to 10 team users • 25 clients',
    features: [
      'Everything in Agency',
      'White-label branding',
      'Advanced analytics & reports',
      'Workflow automation (basic)',
      'Multiple custom domains',
      'Priority support'
    ],
    popular: false
  },
  {
    name: 'Enterprise',
    price: '₹22,000',
    users: 'Unlimited users • Unlimited clients',
    features: [
      'Full white-label solution',
      'Advanced workflows & automation',
      'Custom integrations',
      'Dedicated account manager',
      'SLA & onboarding support',
      'API access'
    ],
    popular: false
  }
];


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-32 left-16 w-4 h-4 bg-teal-400 rounded-full"></div>
      <div className="absolute top-64 right-32 w-4 h-4 bg-blue-500 rounded-full"></div>
      <div className="absolute bottom-32 right-16 w-6 h-6 bg-pink-500 rounded-full"></div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">OUR PRICING</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            No hidden charge, Choose<br />your plan.
          </h2>

          {/* Toggle */}
          <div className="inline-flex bg-white rounded-full shadow-sm p-1 border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-2.5 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-8 py-2.5 rounded-full font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Most Popular Arrow - positioned above Silver Plan */}
         

          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 transition-all hover:shadow-xl ${
                plan.popular
                  ? 'shadow-lg border-2 border-gray-100 relative'
                  : 'shadow-md border border-gray-100'
              }`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{plan.name}</h3>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{plan.price}</div>
                  <p className="text-sm text-gray-500">{plan.users}</p>
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-full font-medium transition-all ${
                    plan.popular
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
                      : 'bg-white text-orange-500 border-2 border-orange-500 hover:bg-orange-50'
                  }`}
                >
                  Sign up
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}