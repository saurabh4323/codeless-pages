"use client";
import { useState, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  Zap,
  Globe,
  Smartphone,
  Share2,
  Users,
  Target,
  Building2,
  GraduationCap,
  MessageCircle,
  Mail,
  CheckCircle2,
  ChevronRight,
  MousePointer2,
  Layout as LayoutIcon,
  Eye,
  Rocket,
  Search,
  ZapOff,
  Briefcase,
  UserCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  BarChart3,
  UserPlus
} from "lucide-react";
import { motion } from "framer-motion";
import UserNavbar from "../Header";
import Link from "next/link";
import Image from "next/image";

export default function UserDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userid = typeof window !== "undefined" ? localStorage.getItem("userid") : null;
    setIsLoggedIn(!!userid);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "No-Code Simplicity",
      description: "Build your page with zero tech skills. If you can type, you're ready to create web pages.",
    },
    {
      icon: LayoutIcon,
      title: "Ready-Made Templates",
      description: "Choose a layout. Add your content. Your brand, your vibe - already designed.",
    },
    {
      icon: Upload,
      title: "Upload Anything",
      description: "Text, headlines, images, videos, buttons - drop it in, and it fits perfectly.",
    },
    {
      icon: Eye,
      title: "Instant Preview & Publish",
      description: "Click once. Your page is live. Share the link anywhere - no extra tools needed.",
    },
    {
      icon: Smartphone,
      title: "Mobile & SEO Ready",
      description: "Looks great on any screen. Google loves it too. High-performance images by default.",
    },
    {
      icon: Share2,
      title: "Smart Sharable Link",
      description: "Each page gets a custom link - perfect for Bios, Messages, DMs, QR codes, and more.",
    },
  ];

  const categories = [
    { title: "Solopreneurs & Hustlers", icon: Users, desc: "Want to look pro online, without hiring anyone." },
    { title: "Coaches & Trainers", icon: Target, desc: "Need a page for their next workshop or course." },
    { title: "Sales & Marketers", icon: Briefcase, desc: "Want to pitch or promote fast, zero tech-blocks." },
    { title: "Creators & Influencers", icon: UserCircle, desc: "Share your link-in-bio page or latest drop." },
    { title: "Startup Founders", icon: Rocket, desc: "MVP page? Investor deck? Handle it in minutes." },
    { title: "Students & Educators", icon: GraduationCap, desc: "Create a project, resume, or profile page." },
  ];

  const testimonials = [
    { name: "Riya M.", role: "Freelance Coach", text: "I created my event page during lunch. No calls, no help, no stress. This thing's a blessing!" },
    { name: "Aditya K.", role: "Startup Founder", text: "CodelessPages saved me from hiring a designer. I launched my course page in 5 minutes flat." },
    { name: "Sonal P.", role: "Career Mentor", text: "I'm not techy at all. But this? I just typed and boom — my link was live." },
    { name: "Imran D.", role: "Solopreneur", text: "Finally… something that doesn't make me feel dumb. Looks great, works instantly." },
    { name: "Manisha R.", role: "Design Student", text: "Used it for my portfolio. Sent the link. Got 3 callbacks. Not kidding." },
    { name: "Rahul S.", role: "Marketing Consultant", text: "This replaced Canva + Google Docs + my dev guy. All in one." },
  ];

  const futureFeatures = [
    { title: "Connect Your Own Domain", desc: "Use your own domain name for your pages", icon: Globe },
    { title: "Lead Capture + Form Builder", desc: "Collect leads and build forms easily", icon: MousePointer2 },
    { title: "Simple Payment Links", desc: "Accept payments directly on your pages", icon: CreditCard },
    { title: "Basic Analytics", desc: "Track page views and engagement", icon: BarChart3 },
    { title: "More Templates & Layout Packs", desc: "Expanded design options for every need", icon: LayoutIcon },
    { title: "Team Collaboration", desc: "Work together with your team", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-white font-outfit text-slate-900">
      <UserNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-slate-50">
        <div className="container-custom px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6 font-medium text-accent text-xs">
                No designers. No developers. No delays.
              </div>
              <h1 className="text-4xl md:text-6xl font-semibold mb-6 leading-tight tracking-tight">
                Just your message — <span className="text-accent">launched.</span>
              </h1>
              <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed font-light">
                Built for People Who Hate Waiting on Developers. If you want to say or sell something without learning code — this is for you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/user/tem" className="button-primary px-8 py-3.5">
                  Get Started Free
                </Link>
                <Link href="/manual" className="button-secondary px-8 py-3.5">
                  See 3-Step Guide
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative bg-white p-2 rounded-3xl border border-slate-100 shadow-2xl overflow-hidden aspect-[4/3]">
                <Image 
                  src="/codeless_v2.png" 
                  alt="Codeless Dashboard" 
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="py-16 bg-slate-900 text-white overflow-hidden">
        <div className="container-custom px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-2 tracking-tight">3 Steps. That is It.</h2>
            <p className="text-slate-400 text-sm font-light">From blank to brilliant in under a minute.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { step: "1", title: "Drop Your Content", desc: "Write your headline, add text, upload a video or image — whatever you've got.", icon: MousePointer2 },
              { step: "2", title: "Pick a Layout", desc: "Choose a ready-made design. No settings. No tweaking. It just fits.", icon: LayoutIcon },
              { step: "3", title: "Go Live & Share", desc: "Hit publish. Get your link. Send it anywhere - from DMs to QR codes.", icon: Rocket },
            ].map((s, i) => (
              <div key={i} className="relative z-10 p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-slate-400 text-xs font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase Section - NEW */}
      <section className="py-20 bg-slate-50/30">
        <div className="container-custom px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-100 mb-4 font-medium text-accent text-[10px] uppercase tracking-widest shadow-sm">
              Ready-Made Designs
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Focus on Content. <br/>We handle the <span className="text-accent underline decoration-indigo-200 underline-offset-8">Aesthetics.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Landing Page", 
                desc: "A clean, modern layout designed for high engagement and smooth performance.",
                img: "/landing_template.png",
                tag: "BASIC"
              },
              { 
                title: "Payment Page", 
                desc: "A clean, modern layout designed for high engagement and smooth performance.",
                img: "/payment_template.png",
                tag: "BASIC"
              },
              { 
                title: "Thankyou Page", 
                desc: "A clean, modern layout designed for high engagement and smooth performance.",
                img: "/thankyou_template.png",
                tag: "BASIC"
              }
            ].map((tmpl, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[9px] font-bold text-slate-900 border border-slate-100 shadow-sm">
                      {tmpl.tag}
                    </span>
                  </div>
                  <Image src={tmpl.img} alt={tmpl.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-500" />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold">{tmpl.title}</h3>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-accent group-hover:text-white transition-all transform group-hover:translate-x-1">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-light leading-relaxed mb-6">
                    {tmpl.desc}
                  </p>
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Available Now</span>
                    <button className="text-xs font-semibold text-accent flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Use Template
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container-custom px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">{feature.title}</h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Codeless - High Availability Highlight */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-full h-full text-white fill-current">
            <path d="M50 50 L350 50 L350 350 L50 350 Z" />
          </svg>
        </div>
        <div className="container-custom px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6">
                Professional Infrastructure
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold mb-6 tracking-tight">Enterprise-Grade Performance.<br/>For Everyone.</h2>
              <p className="text-slate-400 font-light text-lg leading-relaxed mb-8">
                Your pages are hosted on a highly available, global edge network. Whether it&apos;s 10 or 10,000 visitors — your site stays fast and secure.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { title: "99.9% Uptime", desc: "Reliability you can bank on." },
                  { title: "SSL Included", desc: "Security is non-negotiable." },
                  { title: "Global CDN", desc: "Fast loading everywhere." },
                  { title: "Auto-Scale", desc: "Built for sudden traffic." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-white font-semibold">{item.title}</span>
                    <span className="text-slate-500 text-xs">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-3xl shadow-2xl relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/50" />
                       <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                       <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Infrastructure Monitor</span>
                  </div>
                  <div className="space-y-6">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${60 + Math.random() * 30}%` }}
                            transition={{ duration: 1.5, delay: i * 0.2 }}
                            className="h-full bg-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                          />
                       </div>
                     ))}
                  </div>
                  <div className="mt-10 flex items-center justify-center">
                    <div className="text-center group cursor-default">
                       <div className="text-4xl font-bold text-accent mb-2 transition-transform duration-500 group-hover:scale-110">99.99%</div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">System Health</div>
                    </div>
                  </div>
               </div>
               <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories / Use Cases */}
      <section className="py-20">
        <div className="container-custom px-6 text-center max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-3 tracking-tight tracking-tight">Built for People Who Hate Waiting.</h2>
          <p className="text-slate-500 font-light mb-12 italic">If you have ever said “I just wish someone could do it for me”… this is that someone.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-accent/30 transition-shadow text-left flex items-start gap-4 shadow-sm group">
                <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                  <c.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-accent transition-colors">{c.title}</h3>
                  <p className="text-[11px] text-slate-500 font-light mt-1 leading-snug">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50/50">
        <div className="container-custom px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight">Real People. Real Wins.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
                <p className="text-slate-600 text-sm font-light leading-relaxed mb-6 italic relative z-10">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{t.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline / Roadmap Section - REFINED */}
      <section className="py-24 border-t border-slate-100 relative overflow-hidden">
        <div className="container-custom px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-4">The Pipeline</p>
            <h2 className="text-3xl font-semibold mb-3 tracking-tight">On the Horizon</h2>
            <p className="text-sm text-slate-500 font-light">We&apos;re building fast. Here is what is coming next.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {futureFeatures.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-slate-200 transition-all text-center group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-4 h-4 text-slate-300" />
                </div>
                <h4 className="text-[11px] font-semibold text-slate-700 h-10 flex items-center justify-center mb-4">{f.title}</h4>
                <div className="flex items-center justify-center gap-1.5 bg-slate-50/50 py-1 rounded-full border border-slate-100/50">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                   <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">In Dev</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support & CTA */}
      <section className="py-24">
        <div className="container-custom px-6">
          <div className="bg-slate-900 rounded-[48px] p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent -z-10" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />
            
            <h2 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight">Stop Waiting.<br/>Start Sharing.</h2>
            <p className="text-slate-400 text-lg font-light mb-12 max-w-xl mx-auto leading-relaxed">
              You&apos;ve got something to show. Let the world see it — without a single line of code.
            </p>
            
            <Link href="/user/register" className="inline-block button-primary px-12 py-4 bg-white text-slate-900 hover:bg-slate-50 shadow-xl shadow-white/5 text-base rounded-2xl transition-all hover:-translate-y-1">
              Try It Instantly
            </Link>

            <div className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-10">
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">WhatsApp</p>
                  <p className="text-sm text-slate-200">Instant Chat Support</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <Mail className="w-5 h-5 text-accent" />
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email</p>
                  <p className="text-sm text-slate-200 font-medium">support@codelesspages.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
