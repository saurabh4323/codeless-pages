"use client";
import { useState, useEffect } from "react";

const UserNavbar = () => {
  const [abc, setAbc] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    // router.push("/");
    window.location.href = "/";
  };

  // Handle profile click
  const handleProfileClick = () => {
    const userid = localStorage.getItem("userid");
    console.log("Header: Profile clicked, navigating with userid:", userid);
    if (userid) {
      try {
        window.location.href = `/user/profile/${userid}`;
      } catch (error) {
        console.error("Header: Navigation error:", error.message);
        window.location.href = `/user/profile/${userid}`;
      }
    } else {
      window.location.href = "/user/register";
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-md' 
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left Side */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="flex items-center"
            >
              <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                LeadForGrow
              </span>
            </a>
          </div>

          {/* Navigation - Center */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {[
                
                { href: "/user/tem", label: "Templates" },
                { href: "/publish", label: "Publish" },
                { href: "/plans", label: "Plans" },
                { href: "/user/url", label: "URL Shortener" },
              
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-base  text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Auth Section - Right Side */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleProfileClick}
                className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
              >
                Profile
              </button>

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 text-base font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-200"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                >
                  Logout
                </button>
              ) : (
                <a
                  href="/user/register"
                  className="px-6 py-2.5 text-base font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-200"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                >
                  Get Started
                </a>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              <svg
                className="h-6 w-6"
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
        className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible overflow-hidden"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {[
            { href: "/", label: "Home" },
            { href: "/user/tem", label: "Templates" },
            { href: "/publish", label: "Publish" },
            { href: "/plans", label: "Plans" },
            { href: "/user/url", label: "URL Shortener" },
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
          ].map((item) => (
            <div key={item.href}>
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    item.isLogout
                      ? "text-red-600 hover:bg-red-50"
                      : item.isRegister
                      ? "text-white bg-gray-900 hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                >
                  {item.label}
                </button>
              ) : (
                <a
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    item.isRegister
                      ? "text-white bg-gray-900 hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;