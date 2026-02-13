"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  rxDashboard,
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  HelpCircle,
  BarChart3,
  LogOut,
  Menu,
  X,
  UploadCloud
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Dashboard", href: "/admin/hero", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Templates", href: "/admin/tempall", icon: FileText },
  { name: "Content", href: "/admin/uploads", icon: UploadCloud },
  { name: "Reports", href: "/admin/feedback", icon: MessageSquare }, // Feedback as Reports
  { name: "Questions", href: "/admin/questions", icon: HelpCircle },
  { name: "Responses", href: "/admin/responses", icon: BarChart3 },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/register";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1023]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin/hero" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
              A
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all duration-300">
              Admin<span className="font-light">Panel</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 group ${isActive
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-blue-400" : "text-gray-500 group-hover:text-blue-400"}`} />
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="adminNavbarIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0f1023] border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                      ? "bg-blue-600/20 text-blue-200 border border-blue-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-gray-500"}`} />
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 mt-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
