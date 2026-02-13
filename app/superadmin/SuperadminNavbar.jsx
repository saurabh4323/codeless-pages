"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Shield,
  FileText,
  BarChart3,
  Key,
  ClipboardList,
  LogOut,
  Menu,
  X,
  LayoutDashboard
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  // { name: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
  { name: "Tokens", href: "/superadmin/tokens", icon: Key },
  { name: "Organizations", href: "/superadmin/organization", icon: BarChart3 },
  { name: "Admins", href: "/superadmin/admins", icon: Shield },
  { name: "Users", href: "/superadmin/users", icon: Users },
  { name: "Pages", href: "/superadmin/pages", icon: FileText },
  { name: "Templates", href: "/superadmin/templates", icon: FileText },
  { name: "Viewers", href: "/superadmin/responses", icon: ClipboardList },
];

export default function SuperadminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("superadminAuth");
    router.replace("/superadmin/login");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[#0f1023]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
          : "bg-transparent border-b border-transparent"
          }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Super Admin
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">
                  Control Center
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                      ? "text-white shadow-lg shadow-blue-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-blue-600 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-xl font-medium hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#0f1023] border-l border-white/10 z-50 lg:hidden p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-white">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-4 w-full px-4 py-3.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-8 border border-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
