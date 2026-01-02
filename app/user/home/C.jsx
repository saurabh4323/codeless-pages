import React, { useState } from 'react';
import { Headphones } from 'lucide-react';

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-1/4 w-1 h-20 bg-gray-300 transform rotate-45"></div>
      <div className="absolute bottom-32 left-1/3 w-1 h-24 bg-gray-300 transform -rotate-45"></div>
      <div className="absolute bottom-20 left-1/2 w-1 h-16 bg-gray-300 transform rotate-12"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl shadow-lg">
              <Headphones className="w-8 h-8 text-white" />
            </div>

            <div>
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Let's talk<br />
                with <span className="relative inline-block">
                  experience
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-orange-300 -z-10"></span>
                </span><br />
                advisors.
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                eiusmod tempor incididunt. Ut enim mim veniam, quis nostrud elit.
              </p>
            </div>

            <div className="pt-8">
              <p className="text-orange-500 font-semibold mb-2">Urgent?</p>
              <p className="text-gray-900">
                Call us <span className="text-3xl font-bold">+8810873-52</span>
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="relative">
            {/* "Fill the form" arrow */}
            <div className="absolute -top-16 right-12 z-10">
              <p className="text-lg font-medium text-gray-800 mb-2">
                Fill the<br />form
              </p>
              <svg width="60" height="80" viewBox="0 0 60 80" className="absolute top-12 left-8">
                <path
                  d="M10,10 Q30,40 40,70"
                  stroke="#374151"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M40,70 L35,65 M40,70 L42,64"
                  stroke="#374151"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-10">
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    rows="5"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-pink-700 transition-all transform hover:scale-[1.02]"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}