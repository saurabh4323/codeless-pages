import React from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const links = {
    links: ['Home', 'Pricing', 'About us', 'Service', 'Blog'],
    support: ['Item Support', 'Forum', 'Report Abuse', 'Live'],
    products: ['Take the tour', 'Live chat', 'Self-service', 'Social', 'Jano Reviews']
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Decorative yellow dot */}
      <div className="w-3 h-3 bg-yellow-400 rounded-full ml-auto mr-32 -mt-1.5"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">LeadForGrow.</h2>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
              LINKS
            </h3>
            <ul className="space-y-4">
              {links.links.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
              SUPPORT
            </h3>
            <ul className="space-y-4">
              {links.support.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
              PRODUCTS
            </h3>
            <ul className="space-y-4">
              {links.products.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Address */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
              OUR ADDRESS
            </h3>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                Plot No. 123, Sector 62,<br />
                Noida, Uttar Pradesh 201301,<br />
                India
              </p>
              <p>
                <a href="mailto:contact@leadforgrow.com" className="hover:text-gray-900 transition-colors">
                  contact@leadforgrow.com
                </a>
              </p>
              <p className="text-xl font-semibold text-gray-900">
                +91 8810873052
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                <a 
                  href="#" 
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-600" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-gray-600" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-gray-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}