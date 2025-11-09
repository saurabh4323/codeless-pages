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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-gradient-to-r from-blue-800 to-blue-900 border-b border-blue-600/50 backdrop-blur-xl shadow-xl' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-500/50 backdrop-blur-xl shadow-lg'
        }`}>
          {/* Enhanced animated background gradient */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            isScrolled 
              ? 'bg-gradient-to-r from-blue-900/20 via-blue-800/30 to-blue-700/20' 
              : 'bg-gradient-to-r from-blue-700/10 via-blue-600/20 to-blue-500/10'
          }`}></div>

      <div className="relative w-full px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Far Left Side */}
          <div className="flex-shrink-0 ml-20">
            <Link
              href="/"
              className="font-black text-3xl text-white hover:text-blue-100 transition-all duration-500 transform hover:scale-110 drop-shadow-lg"
            >
              Codeless
            </Link>
          </div>

          {/* Navigation - Center */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2">
              {[
                { href: "/", label: "Home", icon: "🏠" },
                { href: "/user/tem", label: "Templates", icon: "📋" },
                { href: "/publish", label: "Publish", icon: "📤" },
                { href: "/manual", label: "Guide", icon: "📖" },
              ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group relative px-5 py-3 rounded-xl text-sm font-semibold text-white hover:text-blue-100 transition-all duration-300 overflow-hidden"
                    >
                      <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                        isScrolled 
                          ? 'bg-gradient-to-r from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/20 group-hover:to-blue-600/20'
                          : 'bg-white/0 group-hover:bg-white/10'
                      }`}></div>
                      <span className="relative flex items-center gap-2.5">
                        <span className="text-sm">{item.icon}</span>
                        {item.label}
                      </span>
                      <div className={`absolute bottom-0 left-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0 ${
                        isScrolled 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                          : 'bg-white'
                      }`}></div>
                    </Link>
              ))}
            </div>
          </div>

          {/* Auth Section - Far Right Side */}
          <div className="hidden md:block mr-4">
            <div className="flex items-center space-x-4">
                  <button
                    onClick={handleProfileClick}
                    className="group relative px-5 py-3 rounded-xl text-sm font-semibold text-white hover:text-blue-100 transition-all duration-300 overflow-hidden border border-white/30 hover:border-white/50"
                  >
                    <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                      isScrolled 
                        ? 'bg-gradient-to-r from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/20 group-hover:to-blue-600/20'
                        : 'bg-white/0 group-hover:bg-white/10'
                    }`}></div>
                    <span className="relative flex items-center gap-2.5">
                      <span className="text-sm">👤</span>
                      Profile
                    </span>
                  </button>

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="group relative px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/30 border border-red-400/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 rounded-xl transition-all duration-300"></div>
                  <span className="relative flex items-center gap-2.5">
                    <span className="text-sm">🚪</span>
                    Logout
                  </span>
                </button>
              ) : (
                    <Link
                      href="/user/register"
                      className="group relative px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30 border border-blue-500/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 rounded-xl transition-all duration-300"></div>
                      <span className="relative flex items-center gap-2.5">
                        <span className="text-sm">✨</span>
                        Register
                      </span>
                    </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="group relative inline-flex items-center justify-center p-3 rounded-xl text-white hover:text-blue-100 transition-all duration-300 border border-white/30 hover:border-white/50 hover:bg-white/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/20 group-hover:to-blue-600/20 rounded-xl transition-all duration-300"></div>
              <svg
                className="relative h-6 w-6 transition-transform duration-300"
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
            className={`md:hidden backdrop-blur-xl border-t shadow-lg transition-all duration-300 ease-in-out ${
              isScrolled 
                ? 'bg-blue-900/95 border-blue-600/50' 
                : 'bg-blue-700/95 border-blue-500/50'
            } ${isMenuOpen
              ? "max-h-screen opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
              }`}
          >
        <div className="px-6 pt-4 pb-5 space-y-3">
          {[
            { href: "/", label: "Home", icon: "🏠" },
            { href: "/user/tem", label: "Templates", icon: "📋" },
            { href: "/publish", label: "Uploads", icon: "📤" },
            { href: "/manual", label: "Guide", icon: "📖" },
            {
              href: "#",
              label: "Profile",
              icon: "👤",
              onClick: handleProfileClick,
            },
            isLoggedIn
              ? {
                href: "#",
                label: "Logout",
                icon: "🚪",
                onClick: handleLogout,
              }
              : { href: "/user/register", label: "Register", icon: "✨" },
          ].map((item, index) => (
            <div
              key={item.href}
              className="group"
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
                      className={`w-full text-left px-5 py-4 rounded-xl text-base font-semibold transition-all duration-300 flex items-center gap-4 ${item.label === "Logout"
                        ? "bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white hover:from-red-600 hover:to-pink-600 shadow-lg border border-red-400/30"
                        : item.label === "Profile"
                          ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-white hover:text-blue-100 hover:from-blue-500/30 hover:to-blue-600/30 border border-white/30 hover:border-white/50"
                          : "bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-white hover:text-blue-100 hover:from-blue-500/20 hover:to-blue-600/20 border border-white/20 hover:border-white/50"
                        }`}
                    >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              ) : (
                    <Link
                      href={item.href}
                      className={`block px-5 py-4 rounded-xl text-base font-semibold transition-all duration-300 flex items-center gap-4 ${item.label === "Register"
                        ? "bg-gradient-to-r from-blue-600/80 to-blue-700/80 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg border border-blue-500/30"
                        : "bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-white hover:text-blue-100 hover:from-blue-500/20 hover:to-blue-600/20 border border-white/20 hover:border-white/50"
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                  <span className="text-base">{item.icon}</span>
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