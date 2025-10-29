import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FacuContext, ThemeContext } from "../App";

export default function Navbar() {
  const { user, handleLogout } = useContext(FacuContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const onLogout = () => {
    handleLogout();
    navigate("/auth");
  };

  return (
    <nav className={`fixed top-0 w-full backdrop-blur-xl border-b z-50 shadow-2xl transition-colors duration-300 ${
      isDarkMode
        ? "bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 border-white/20"
        : "bg-gradient-to-r from-gray-50/90 via-white/90 to-gray-50/90 border-gray-200/30"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 flex justify-between items-center">
        <Link to="/" className={`text-2xl font-bold bg-clip-text text-transparent hover:opacity-80 transition-all ${
          isDarkMode
            ? "bg-gradient-to-r from-white to-white/70"
            : "bg-gradient-to-r from-black to-gray-700"
        }`}>
          FacuLytics
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link
            to="/"
            className={`transition-all font-medium ${
              isActive("/")
                ? isDarkMode
                  ? "text-white font-semibold bg-white/10 px-4 py-2 rounded-lg border border-white/30"
                  : "text-black font-semibold bg-black/10 px-4 py-2 rounded-lg border border-black/30"
                : isDarkMode
                ? "text-white/80 hover:text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            Home
          </Link>
          <Link
            to="/planner"
            className={`transition-all font-medium ${
              isActive("/planner")
                ? isDarkMode
                  ? "text-white font-semibold bg-white/10 px-4 py-2 rounded-lg border border-white/30"
                  : "text-black font-semibold bg-black/10 px-4 py-2 rounded-lg border border-black/30"
                : isDarkMode
                ? "text-white/80 hover:text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            Planner
          </Link>

          <Link
            to="/scheduler"
            className={`transition-all font-medium ${
              isActive("/scheduler")
                ? isDarkMode
                  ? "text-white font-semibold bg-white/10 px-4 py-2 rounded-lg border border-white/30"
                  : "text-black font-semibold bg-black/10 px-4 py-2 rounded-lg border border-black/30"
                : isDarkMode
                ? "text-white/80 hover:text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            Scheduler
          </Link>
          
          <Link
            to="/add-review"
            className={`transition-all font-medium ${
              isActive("/add-review")
                ? isDarkMode
                  ? "text-white font-semibold bg-white/10 px-4 py-2 rounded-lg border border-white/30"
                  : "text-black font-semibold bg-black/10 px-4 py-2 rounded-lg border border-black/30"
                : isDarkMode
                ? "text-white/80 hover:text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            Add Review
          </Link>

          <Link
            to="/slotswap"
            className={`transition-all font-medium ${
              isActive("/slotswap")
                ? isDarkMode
                  ? "text-white font-semibold bg-white/10 px-4 py-2 rounded-lg border border-white/30"
                  : "text-black font-semibold bg-black/10 px-4 py-2 rounded-lg border border-black/30"
                : isDarkMode
                ? "text-white/80 hover:text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            SlotSwap
          </Link>

          {/* Admin Link - Desktop */}
          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className={`transition-all font-medium ${
                isActive("/admin/dashboard")
                  ? isDarkMode
                    ? "text-white font-semibold bg-white/10 px-4 py-2 rounded-lg border border-white/30"
                    : "text-black font-semibold bg-black/10 px-4 py-2 rounded-lg border border-black/30"
                  : isDarkMode
                  ? "text-white/80 hover:text-white"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Admin
            </Link>
          )}

          <div className={`pl-6 border-l flex items-center gap-4 ${
            isDarkMode ? "border-white/20" : "border-black/20"
          }`}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${
                isDarkMode
                  ? "bg-white/10 hover:bg-white/20 border border-white/30 text-white"
                  : "bg-black/10 hover:bg-black/20 border border-black/30 text-black"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.828-2.828l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 101.414 1.414zM13 11a1 1 0 110 2h-1a1 1 0 110-2h1zm4-4a1 1 0 11-2 0 1 1 0 012 0zM9 2a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <span className={`text-sm ${isDarkMode ? "text-white/70" : "text-black/70"}`}>{user?.name}</span>
            <button
              onClick={onLogout}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-xl ${
                isDarkMode
                  ? "bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/40 text-white"
                  : "bg-black/10 hover:bg-black/20 border border-black/30 hover:border-black/40 text-black"
              }`}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode
                ? "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                : "bg-black/10 hover:bg-black/20 border border-black/20 text-black"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.828-2.828l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 101.414 1.414zM13 11a1 1 0 110 2h-1a1 1 0 110-2h1zm4-4a1 1 0 11-2 0 1 1 0 012 0zM9 2a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-lg transition-all border ${
              isDarkMode
                ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                : "bg-black/10 hover:bg-black/20 border-black/20 text-black"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden border-t backdrop-blur-2xl p-4 space-y-3 shadow-2xl transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-b from-black/95 via-gray-900/95 to-black/95 border-white/20"
            : "bg-gradient-to-b from-gray-50/95 via-white/95 to-gray-50/95 border-gray-200/30"
        }`}>
          <Link
            to="/"
            className={`block transition-all py-3 px-4 rounded-lg font-medium ${
              isActive("/")
                ? isDarkMode
                  ? "text-white bg-white/20 border border-white/30"
                  : "text-black bg-black/20 border border-black/30"
                : isDarkMode
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-black/60 hover:text-black hover:bg-black/10"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/planner"
            className={`block transition-all py-3 px-4 rounded-lg font-medium ${
              isActive("/planner")
                ? isDarkMode
                  ? "text-white bg-white/20 border border-white/30"
                  : "text-black bg-black/20 border border-black/30"
                : isDarkMode
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-black/60 hover:text-black hover:bg-black/10"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Planner
          </Link>

          <Link
            to="/scheduler"
            className={`block transition-all py-3 px-4 rounded-lg font-medium ${
              isActive("/scheduler")
                ? isDarkMode
                  ? "text-white bg-white/20 border border-white/30"
                  : "text-black bg-black/20 border border-black/30"
                : isDarkMode
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-black/60 hover:text-black hover:bg-black/10"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Scheduler
          </Link>

          <Link
            to="/add-review"
            className={`block transition-all py-3 px-4 rounded-lg font-medium ${
              isActive("/add-review")
                ? isDarkMode
                  ? "text-white bg-white/20 border border-white/30"
                  : "text-black bg-black/20 border border-black/30"
                : isDarkMode
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-black/60 hover:text-black hover:bg-black/10"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Add Review
          </Link>

          <Link
            to="/slotswap"
            className={`block transition-all py-3 px-4 rounded-lg font-medium ${
              isActive("/slotswap")
                ? isDarkMode
                  ? "text-white bg-white/20 border border-white/30"
                  : "text-black bg-black/20 border border-black/30"
                : isDarkMode
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-black/60 hover:text-black hover:bg-black/10"
            }`}
            onClick={() => setIsOpen(false)}
          >
            SlotSwap
          </Link>

          {/* Admin Link - Mobile */}
          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className={`block transition-all py-3 px-4 rounded-lg font-medium ${
                isActive("/admin/dashboard")
                  ? isDarkMode
                    ? "text-white bg-white/20 border border-white/30"
                    : "text-black bg-black/20 border border-black/30"
                  : isDarkMode
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-black/60 hover:text-black hover:bg-black/10"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}

          <div className={`pt-3 border-t ${isDarkMode ? "border-white/20" : "border-black/20"}`}>
            <p className={`text-sm mb-3 px-4 ${isDarkMode ? "text-white/70" : "text-black/70"}`}>{user?.name}</p>
            <button
              onClick={onLogout}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-xl ${
                isDarkMode
                  ? "bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/40 text-white"
                  : "bg-black/10 hover:bg-black/20 border border-black/30 hover:border-black/40 text-black"
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}