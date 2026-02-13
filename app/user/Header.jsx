"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UserNavbar = () => {
  const [abc, setAbc] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Check for userid in localStorage on mount
  useEffect(() => {
    const userid = localStorage.getItem("userid");
    console.log("UserID from localStorage:", userid);
    setIsLoggedIn(!!userid);
    setAbc(userid || "");
  }, []);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userid");
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setAbc("");
    setIsMenuOpen(false);
    router.push("/");
  };

  // Handle profile click
  const handleProfileClick = () => {
    const userid = localStorage.getItem("userid");
    console.log("Header: Profile clicked, navigating with userid:", userid);
    if (userid) {
      try {
        router.push(`/user/profile/${userid}`);
      } catch (error) {
        console.error("Header: Navigation error:", error.message);
        window.location.href = `/user/profile/${userid}`;
      }
    } else {
      router.push("/user/register");
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200'
      : 'bg-white/80 backdrop-blur-lg border-b border-gray-100'
      }`}>
      <div className="relative w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Far Left Side */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-2.5 rounded-xl transform group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-indigo-600 group-hover:to-blue-600 transition-all duration-300" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}>
                Codeless
              </span>
            </Link>
          </div>

          {/* Navigation - Center */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 lg:gap-4">
              {[
                { href: "/", label: "Home" },
                { href: "/user/tem", label: "Templates" },
                { href: "/publish", label: "Publish" },
                { href: "/Plans", label: "Plans" },
                { href: "/manual", label: "Guide" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3 lg:px-4 py-2 mx-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
                  style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Section - Far Right Side */}
          <div className="hidden md:block">
            <div className="flex items-center gap-4">
              <button
                onClick={handleProfileClick}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
              >
                Profile
              </button>

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-sm font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-600"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/user/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
            >
              <svg
                className="h-6 w-6 transition-transform duration-300"
                style={{
                  transform: isMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out ${isMenuOpen
          ? "max-h-screen opacity-100 visible shadow-lg"
          : "max-h-0 opacity-0 invisible"
          }`}
      >
        <div className="px-6 pt-4 pb-6 space-y-2">
          {[
            { href: "/", label: "Home" },
            { href: "/user/tem", label: "Templates" },
            { href: "/publish", label: "Publish" },
            { href: "/Plans", label: "Plans" },
            { href: "/manual", label: "Guide" },
            {
              href: "#",
              label: "Profile",
              onClick: handleProfileClick,
            },
            isLoggedIn
              ? {
                href: "#",
                label: "Logout",
                onClick: handleLogout,
                isLogout: true,
              }
              : { href: "/user/register", label: "Get Started", isRegister: true },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: isMenuOpen
                  ? "fadeInUp 0.3s ease-out forwards"
                  : "none",
              }}
            >
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${item.isLogout
                    ? "text-red-600 bg-red-50 hover:bg-red-100"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${item.isRegister
                    ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default UserNavbar;