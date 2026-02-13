"use client";
import React from 'react';
import { 
  Upload,
  Heading,
  AlignLeft,
  Palette,
  Video,
  MousePointer2,
  Image as ImageIcon,
  Rocket,
  ClipboardList,
  Edit,
  PlayCircle,
  Search,
  Headphones,
  Mail,
  Clock,
  Wrench,
  Shield,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import UserNavbar from '../user/Header';

export default function ContentUploadManual() {
  const uploadSteps = [
    {
      icon: ClipboardList,
      title: 'Choose Template',
      description: 'Start by selecting the template you want to use for your content.'
    },
    {
      icon: Edit,
      title: 'Add Content', 
      description: 'Follow the template rules for heading, video, CTA, and images.'
    },
    {
      icon: PlayCircle,
      title: 'Create Content',
      description: 'Click the "Create Content" button to generate your final design.'
    },
    {
      icon: CheckCircle2,
      title: 'Review & Check',
      description: 'Review your created content carefully for any mistakes.'
    }
  ];

  const contentRules = [
    { step: 1, title: 'Write Heading', icon: Heading, desc: 'Create a short, clear, and attention-grabbing main title.' },
    { step: 2, title: 'Write Subheading', icon: AlignLeft, desc: 'Support your main title with 1-2 lines of context.' },
    { step: 3, title: 'Choose Color', icon: Palette, desc: 'Enter hex codes (e.g. #4F46E5) to match your brand vibe.' },
    { step: 4, title: 'Add Video Content', icon: Video, desc: 'Embed high-quality video links from YouTube or Vimeo.' },
    { step: 5, title: 'Call-to-Action Button', icon: MousePointer2, desc: 'Add a clear text and valid URL for your main button.' },
    { step: 6, title: 'Upload Images', icon: ImageIcon, desc: 'Upload JPG/PNG files under 5MB for pixel-perfect results.' }
  ];

  return (
    <div className="min-h-screen bg-white font-outfit text-slate-900">
      <UserNavbar />
      
      {/* Hero Header */}
      <section className="pt-32 pb-16 border-b border-slate-50 bg-slate-50/30">
        <div className="container-custom px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">Content Upload Manual</h1>
            <p className="text-slate-500 font-light max-w-2xl mx-auto">
              Complete guide for uploading and managing content on CodelessPages. Follow these steps to build professional pages in record time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4 Core Steps */}
      <section className="py-20">
        <div className="container-custom px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-accent text-[10px] font-bold uppercase tracking-widest mb-4">
              <Rocket className="w-3 h-3" /> Process Overview
            </div>
            <h2 className="text-3xl font-semibold">How to Upload Content</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {uploadSteps.map((step, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-accent mb-4">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules Grid */}
      <section className="py-20 bg-slate-50/50">
        <div className="container-custom px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold mb-4">Template Guidelines</h2>
              <p className="text-slate-500 font-light italic">Follow these precise steps for the best results.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {contentRules.map((rule, i) => (
                <div key={i} className="flex gap-4 items-start p-6 rounded-2xl bg-white border border-slate-100 shadow-sm relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shadow-lg">
                    {rule.step}
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 text-slate-400">
                    <rule.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{rule.title}</h3>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24">
        <div className="container-custom px-6">
          <div className="max-w-5xl mx-auto rounded-[40px] bg-slate-900 p-12 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <HelpCircle className="w-40 h-40" />
             </div>
             
             <h2 className="text-3xl font-semibold mb-6">Need Help?</h2>
             <p className="text-slate-400 font-light mb-10 max-w-xl mx-auto leading-relaxed text-sm">
               {"If you find any mistakes or need assistance, take a screenshot and contact our support team. We're here to help you go live."}
             </p>

             <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
               <a 
                 href="mailto:saurabhiitr01@gmail.com" 
                 className="flex items-center gap-3 px-8 py-3.5 bg-white text-slate-900 rounded-full font-semibold hover:bg-slate-100 transition-colors text-sm shadow-xl"
               >
                 <Mail className="w-4 h-4" /> saurabhiitr01@gmail.com
               </a>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
                {[
                  { icon: Clock, title: 'Quick Response Time' },
                  { icon: Wrench, title: 'Expert Technical Support' },
                  { icon: Shield, title: 'Reliable Solution' }
                ].map((feat, i) => (
                  <div key={i} className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/5">
                    <feat.icon className="w-4 h-4 text-accent" />
                    <span className="text-xs font-medium text-slate-300">{feat.title}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}