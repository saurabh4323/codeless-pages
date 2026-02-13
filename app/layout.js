import Footer from "./components/Footer";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "Codeless | Professional No-Code Pages",
  description: "Create world-class landing pages and sections without writing a single line of code. Built for high-growth companies.",
  icons: {
    icon: "/image.png",
    shortcut: "/image.png",
    apple: "/image.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} antialiased`}>
        {children}
        <Toaster position="top-right" />
        <Footer />
      </body>
    </html>
  );
}
