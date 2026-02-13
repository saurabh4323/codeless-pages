"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Shield, Globe, Headset, ChevronRight, Loader2 } from "lucide-react";
import UserNavbar from "../user/Header";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || process.env.STRIPE_PUBLIC_KEY);

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "₹199",
    period: "/month",
    subtitle: "Perfect for individuals starting their journey.",
    icon: Zap,
    features: [
      "Up to 3 admin seats",
      "50 active content pages",
      "Standard analytics dashboard",
      "Community support access",
      "Basic customization tools",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    period: "/month",
    highlight: true,
    subtitle: "Built for growing teams and serious scale.",
    icon: Sparkles,
    features: [
      "Up to 10 admin seats",
      "Unlimited content pages",
      "Advanced real-time reports",
      "Priority priority support",
      "Full white-label options",
      "Export raw data metrics",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    subtitle: "For global companies with custom needs.",
    icon: Globe,
    features: [
      "Unlimited admin users",
      "SLA & Custom Contracts",
      "Dedicated account manager",
      "SSO & Advanced Security",
      "Custom development hours",
      "Priority feature requests",
    ],
  },
];

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState("");

  const handleChoosePlan = async (planId) => {
    if (planId === "enterprise") {
      window.location.href = "mailto:sales@codeless.com?subject=Enterprise%20Plan%20Enquiry";
      return;
    }

    try {
      setError("");
      setLoadingPlan(planId);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed context");

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      setError(err.message || "Failed to initiate payment.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-white font-outfit">
      <UserNavbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Pricing Plans</span>
          </motion.div>
          
          <h1 className="heading-xl mb-6">
            Scale your <span className="text-accent underline decoration-slate-200 underline-offset-8">influence</span> without scaling costs
          </h1>
          <p className="text-slate-500 font-light text-xl max-w-2xl mx-auto leading-relaxed">
            Choose the core system that powers thousands of high-converting pages. No hidden fees, cancel anytime.
          </p>
        </div>

        {error && (
          <div className="max-w-xl mx-auto mb-10 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" /> {error}
          </div>
        )}

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-[32px] border flex flex-col transition-all duration-300 ${
                plan.highlight 
                ? "border-accent shadow-2xl shadow-accent/10 bg-white" 
                : "border-slate-100 hover:border-slate-300 bg-slate-50/30"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-accent/20">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${plan.highlight ? "bg-accent text-white" : "bg-white text-slate-400 border border-slate-100"}`}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-medium text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-500 font-light text-sm line-clamp-2">{plan.subtitle}</p>
              </div>

              <div className="mb-8 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                 <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-400 font-light text-sm">{plan.period}</span>}
                 </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                 {plan.features.map(feature => (
                   <div key={feature} className="flex items-start gap-3">
                      <div className="mt-1 w-4 h-4 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                         <Check className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      <span className="text-sm font-light text-slate-600 leading-tight">{feature}</span>
                   </div>
                 ))}
              </div>

              <button
                onClick={() => handleChoosePlan(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all duration-300 ${
                  plan.highlight 
                  ? "button-primary shadow-xl shadow-accent/20" 
                  : "button-secondary"
                } disabled:opacity-50`}
              >
                {loadingPlan === plan.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {plan.id === "enterprise" ? "Contact Support" : "Get Started"}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Global Infrastructure Section */}
        <div className="mt-32 p-12 rounded-[48px] bg-slate-900 text-white relative overflow-hidden">
           {/* Background orbs */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
           
           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
              {[
                { title: "99.9% Uptime", desc: "Reliable global infrastructure", icon: Globe },
                { title: "Secure Payments", desc: "Powered by Stripe ecosystem", icon: Shield },
                { title: "Real-time Sync", desc: "Instant page updates", icon: Zap },
                { title: "24/7 Expert Help", desc: "Always here for you", icon: Headset },
              ].map((item, i) => (
                <div key={i}>
                   <item.icon className="w-8 h-8 text-accent mb-4 mx-auto md:mx-0" />
                   <h4 className="text-lg font-medium mb-1">{item.title}</h4>
                   <p className="text-slate-400 text-sm font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
