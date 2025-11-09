"use client";
import { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Image,
  Video,
  ExternalLink,
  Search,
  User,
  Sparkles,
  ArrowRight,
  Plus,
  Grid3X3,
  Zap,
  Palette,
  Globe,
  Star,
  TrendingUp,
  Play,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  ThumbsUp,
  PlayCircle,
  CheckCircle,
  Smartphone,
  Share2,
  Rocket,
  Users,
  Target,
  BookOpen,
  GraduationCap,
  Building2,
  MessageCircle,
  Mail,
  HelpCircle,
  Settings,
  CreditCard,
  BarChart3,
  Globe2,
  Languages,
} from "lucide-react";
import UserNavbar from "../Header";

export default function UserDashboard() {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userid = typeof window !== "undefined" ? localStorage.getItem("userid") : null;
    setIsLoggedIn(!!userid);
  }, []);

  const handleTryInstantly = () => {
    console.log("Try It Instantly clicked");
  };

  const handleSignUpFree = () => {
    console.log("Sign Up Free clicked");
  };

  const features = [
    {
      icon: Settings,
      title: "No-Code Simplicity",
      description: "Build your page with zero tech skills. If you can type, you're ready to create wen pages.",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
    },
    {
      icon: Palette,
      title: "Ready-Made Templates",
      description: "Choose a layout. Add your content. Your brand, your vibe - already designed.",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    },
    {
      icon: Upload,
      title: "Upload Anything",
      description: "Text, headlines, images, videos, buttons - drop it in, and it fits perfectly.",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    },
    {
      icon: Rocket,
      title: "Instant Preview & Publish",
      description: "Click once. Your page is live. Share the link anywhere - no extra tools needed.",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
    },
    {
      icon: Smartphone,
      title: "Mobile & SEO Ready",
      description: "Looks great on any screen. Google loves it too and dont forget about the images",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    },
    {
      icon: Share2,
      title: "Smart Sharable Link",
      description: "Each page gets a custom link - perfect for Bios, Messages, DMs, QR codes, and more.",
      gradient: "from-pink-500 via-rose-500 to-red-500",
    },
  ];

  const targetUsers = [
    {
      icon: Users,
      title: "Solopreneurs & Hustlers",
      description: "Want to look pro online, without hiring anyone.",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
    },
    {
      icon: Target,
      title: "Coaches & Trainers",
      description: "Need a page for their next workshop, session, or course.",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    },
    {
      icon: TrendingUp,
      title: "Salespeople & Marketers",
      description: "Want to pitch or promote fast, with zero tech-blocks.",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    },
    {
      icon: Star,
      title: "Creators & Influencers",
      description: "Share your link-in-bio page, media kit, or latest drop.",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
    },
    {
      icon: Building2,
      title: "Startup Founders",
      description: "MVP page? Investor deck? Hiring? Handle it in minutes.",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    },
    {
      icon: GraduationCap,
      title: "Students & Educators",
      description: "Create a project, resume, or profile page - and impress.",
      gradient: "from-pink-500 via-rose-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Riya M.",
      role: "Freelance Coach",
      text: "I created my event page during lunch. No calls, no help, no stress. This thing's a blessing!",
      rating: 5,
    },
    {
      id: 2,
      name: "Aditya K.",
      role: "Startup Founder",
      text: "CodelessPages saved me from hiring a designer. I launched my course page in 5 minutes flat.",
      rating: 5,
    },
    {
      id: 3,
      name: "Sonal P.",
      role: "Career Mentor",
      text: "I'm not techy at all. But this? I just typed and boom — my link was live.",
      rating: 5,
    },
    {
      id: 4,
      name: "Imran D.",
      role: "Solopreneur",
      text: "Finally… something that doesn't make me feel dumb. Looks great, works instantly.",
      rating: 5,
    },
    {
      id: 5,
      name: "Manisha R.",
      role: "Design Student",
      text: "Used it for my portfolio. Sent the link. Got 3 callbacks. Not kidding.",
      rating: 5,
    },
    {
      id: 6,
      name: "Rahul S.",
      role: "Marketing Consultant",
      text: "This replaced Canva + Google Docs + my dev guy. All in one.",
      rating: 5,
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Drop Your Content",
      description: "Write your headline, add to some text, upload a video or image — whatever you've got.",
      icon: Upload,
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      step: 2,
      title: "Pick a Layout",
      description: "Choose a ready-made design. No settings. No tweaking. It just fits.",
      icon: Palette,
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      step: 3,
      title: "Go Live & Share",
      description: "Hit publish. Get your link. Send it anywhere - from DMs to QR codes.",
      icon: Rocket,
      gradient: "from-violet-500 to-fuchsia-600",
    },
  ];

  const comingSoonFeatures = [
    {
      icon: Globe2,
      title: "Connect Your Own Domain",
      description: "Use your own domain name for your pages",
    },
    {
      icon: Target,
      title: "Lead Capture + Form Builder",
      description: "Collect leads and build forms easily",
    },
    {
      icon: CreditCard,
      title: "Simple Payment Links",
      description: "Accept payments directly on your pages",
    },
    {
      icon: BarChart3,
      title: "Basic Analytics",
      description: "Track page views and engagement",
    },
    {
      icon: Palette,
      title: "More Templates & Layout Packs",
      description: "Expanded design options for every need",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team or agency",
    },
    {
      icon: Languages,
      title: "Multilingual Page Support",
      description: "Create pages in multiple languages",
    },
  ];

  return (
    <><UserNavbar></UserNavbar>
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-32 mt-20">
          <div className="inline-block mb-6">
            <div className="px-6 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full backdrop-blur-sm">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-semibold text-sm">
                ✨ The Future of Page Building
              </span>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300">
              Type. Upload.
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Go Live.
            </span>
          </h1>

          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-12 font-light">
            Just bring your content. No coding. No waiting. No calling your geeky friend for help. One page. All yours. In seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleTryInstantly}
              className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <Zap className="mr-3 h-5 w-5" />
                Try It Instantly
              </div>
            </button>

            {!isLoggedIn && (
              <button
                onClick={handleSignUpFree}
                className="group relative px-10 py-5 bg-slate-800/50 border border-slate-700/50 text-slate-200 font-semibold text-lg rounded-2xl hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm transform hover:scale-105"
              >
                <div className="relative flex items-center">
                  <User className="mr-3 h-5 w-5" />
                  Sign Up Free
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-100 mb-4">
              Everything You Need. Nothing You Do not.
            </h2>
            <p className="text-xl text-slate-400 font-light">
              Let&apos;s keep it sharp, visual, and clear for fast decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group cursor-pointer">
                  <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-3xl overflow-hidden hover:border-slate-700/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    <div className="relative p-8">
                      <div className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-4 w-fit mb-6 shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-slate-100 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center space-y-2">
            <p className="text-xl text-slate-300 font-medium">
              No designers. No developers. No delays.
            </p>
            <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-semibold">
              Just your message - launched.
            </p>
          </div>
        </div>

        {/* Who It's For Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-100 mb-4">
              Built for People Who Hate Waiting on Developers.
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light">
              If you have got something to say or sell - but do not want to learn code, chase freelancers, or spend hours on &quot;digital stuff&quot; - this is made for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {targetUsers.map((user, index) => {
              const IconComponent = user.icon;
              return (
                <div key={index} className="group cursor-pointer">
                  <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-3xl overflow-hidden hover:border-slate-700/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                    <div className={`absolute inset-0 bg-gradient-to-br ${user.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    <div className="relative p-8">
                      <div className={`bg-gradient-to-br ${user.gradient} rounded-2xl p-4 w-fit mb-6 shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-slate-100 mb-4">
                        {user.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {user.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-xl text-slate-300 font-medium">
              If you have ever said <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">&ldquo;I just wish someone could do it for me&rdquo;</span>… this is that someone.
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-100 mb-4">
              Real People. Real Wins.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-8 hover:border-slate-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-slate-100 font-semibold text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">
                  {testimonial.text}
                </p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "text-amber-400 fill-current"
                          : "text-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-100 mb-4">
              3 Steps. That is It.
            </h2>
            <p className="text-xl text-slate-400 font-light">
              From blank to brilliant in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorks.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.step} className="text-center group">
                  <div className="relative mb-8">
                    <div className={`w-24 h-24 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                      <IconComponent className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 left-0 right-0 mx-auto w-10 h-10 bg-slate-800 border-2 border-slate-700 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-slate-100 font-bold">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center mb-32">
          <h2 className="text-5xl font-bold text-slate-100 mb-4">
            Stop Waiting. Start Sharing.
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light">
            You have got something to show. Let the world see it - without a single line of code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={handleTryInstantly}
              className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <Zap className="mr-3 h-5 w-5" />
                Try It Instantly
              </div>
            </button>

            {!isLoggedIn && (
              <button
                onClick={handleSignUpFree}
                className="group relative px-10 py-5 bg-slate-800/50 border border-slate-700/50 text-slate-200 font-semibold text-lg rounded-2xl hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm transform hover:scale-105"
              >
                <div className="relative flex items-center">
                  <User className="mr-3 h-5 w-5" />
                  Sign Up Free
                </div>
              </button>
            )}
          </div>

          {/* Support Badge */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-3xl p-10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-slate-100 mb-4">
              Have a question or stuck somewhere?
            </h3>
            <p className="text-slate-300 mb-6">
              Message us on WhatsApp or email support@codelesspages.com — we are real people, and we respond fast.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="flex items-center px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-slate-200 rounded-xl transition-all duration-300 backdrop-blur-sm">
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp
              </button>
              <button className="flex items-center px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-slate-200 rounded-xl transition-all duration-300 backdrop-blur-sm">
                <Mail className="h-5 w-5 mr-2" />
                Email Support
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-100 mb-4">
              Coming Soon on CodelessPages
            </h2>
            <p className="text-xl text-slate-400 font-light">
              We are constantly adding new features to make your experience even better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group cursor-pointer">
                  <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-3xl overflow-hidden hover:border-slate-700/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative p-8">
                      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 w-fit mb-6 shadow-lg">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>

                      <div className="flex items-center mb-3">
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30 font-medium">
                          Coming Soon
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-100 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}