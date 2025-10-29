// Footer.jsx
// Premium footer with glass effect matching the app theme

import React, { useContext } from "react";
import { ThemeContext } from "../App";

export default function Footer() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <footer className={`w-full backdrop-blur-xl border-t shadow-2xl transition-colors duration-300 ${
      isDarkMode
        ? "bg-gradient-to-t from-black via-gray-900/95 to-black/90 border-white/20"
        : "bg-gradient-to-t from-gray-50 via-white/95 to-gray-100/90 border-black/10"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Logo/Brand */}
          <div className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
            isDarkMode
              ? "from-white to-white/60"
              : "from-black to-black/60"
          }`}>
            FacuLytics
          </div>
          
          {/* Description */}
          <p className={`text-sm sm:text-base text-center max-w-2xl ${
            isDarkMode ? "text-white/70" : "text-black/70"
          }`}>
            Made with 💙 for VIT students by students
          </p>
          
          {/* Tagline */}
          <p className={`text-xs sm:text-sm text-center italic ${
            isDarkMode ? "text-white/50" : "text-black/50"
          }`}>
            Empowering informed decisions through real student experiences
          </p>
        </div>

        {/* Divider */}
        <div className={`my-6 border-t ${isDarkMode ? "border-white/10" : "border-black/10"}`}></div>

        {/* Bottom Section */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm ${
          isDarkMode ? "text-white/60" : "text-black/60"
        }`}>
          <div>
            © {new Date().getFullYear()} FacuLytics. All rights reserved.
          </div>
          
          <div className={`flex items-center gap-4 ${isDarkMode ? "text-white/50" : "text-black/50"}`}>
            <span className={`px-3 py-1 backdrop-blur-sm rounded-lg border transition-colors duration-300 ${
              isDarkMode
                ? "bg-white/5 border-white/10"
                : "bg-black/5 border-black/10"
            }`}>
              Beta v1.0
            </span>
            <span>Made for VIT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}