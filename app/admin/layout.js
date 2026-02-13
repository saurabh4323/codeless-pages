"use client";
import AdminNavbar from "./Navbar";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes("/register") || pathname.includes("/login") || pathname.includes("/setup");

  return (
    <div className="min-h-screen bg-[#0f1023] text-white font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0f1023] to-[#0f1023] pointer-events-none" />
      
      {!isAuthPage && <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0f1023]/80 backdrop-blur-md border-b border-white/10" />}
      {!isAuthPage && <AdminNavbar />}
      
      <main className={`relative z-10 w-full ${!isAuthPage ? "pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" : ""}`}>
        {children}
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e1b4b",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          success: {
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#1e1b4b",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#1e1b4b",
            },
          },
        }}
      />
    </div>
  );
}
