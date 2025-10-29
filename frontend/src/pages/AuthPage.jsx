import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FacuContext, ThemeContext } from "../App";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { handleLogin } = useContext(FacuContext);
  const { isDarkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const endpoint = `${API_URL}/api/auth/${isLogin ? "login" : "signup"}`;
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      // Save token to localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("Token saved to localStorage:", data.token);
      }

      // Call handleLogin with user data and token
      handleLogin(data.user, data.token);

      setLoading(false);
      navigate("/");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
      style={{ fontFamily: "Times New Roman, serif" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className={`text-6xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-black"}`}>
            FacuLytics
          </h1>
          <p className={`text-lg italic ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Real feedback from real students
          </p>
        </div>

        {/* Auth Card */}
        <div className={`backdrop-blur-lg border rounded-2xl p-8 shadow-2xl transition-colors duration-300 ${
          isDarkMode
            ? "bg-white/10 border-white/20"
            : "bg-black/5 border-black/10"
        }`}>
          {/* Toggle Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setFormData({ name: "", email: "", password: "", confirmPassword: "" });
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                isLogin
                  ? isDarkMode
                    ? "bg-white/30 border border-white/40 text-white shadow-lg"
                    : "bg-black/20 border border-black/30 text-black shadow-lg"
                  : isDarkMode
                  ? "bg-white/10 border border-white/20 text-gray-400 hover:bg-white/15"
                  : "bg-black/10 border border-black/20 text-gray-600 hover:bg-black/15"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setFormData({ name: "", email: "", password: "", confirmPassword: "" });
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                !isLogin
                  ? isDarkMode
                    ? "bg-white/30 border border-white/40 text-white shadow-lg"
                    : "bg-black/20 border border-black/30 text-black shadow-lg"
                  : isDarkMode
                  ? "bg-white/10 border border-white/20 text-gray-400 hover:bg-white/15"
                  : "bg-black/10 border border-black/20 text-gray-600 hover:bg-black/15"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg text-sm border ${
                isDarkMode
                  ? "bg-red-500/20 border-red-500/40 text-red-300"
                  : "bg-red-500/10 border-red-500/30 text-red-700"
              }`}
            >
              <div className="flex gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-2.5 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                    isDarkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-500 focus:ring-white/40 focus:bg-white/15"
                      : "bg-black/5 border-black/20 text-black placeholder-gray-600 focus:ring-black/40 focus:bg-black/10"
                  }`}
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2.5 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                  isDarkMode
                    ? "bg-white/10 border-white/20 text-white placeholder-gray-500 focus:ring-white/40 focus:bg-white/15"
                    : "bg-black/5 border-black/20 text-black placeholder-gray-600 focus:ring-black/40 focus:bg-black/10"
                }`}
                placeholder="you@vitstudent.ac.in"
              />
              {!isLogin && (
                <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  ✓ Must be a VIT student email (@vitstudent.ac.in)
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2.5 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                  isDarkMode
                    ? "bg-white/10 border-white/20 text-white placeholder-gray-500 focus:ring-white/40 focus:bg-white/15"
                    : "bg-black/5 border-black/20 text-black placeholder-gray-600 focus:ring-black/40 focus:bg-black/10"
                }`}
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-2.5 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                    isDarkMode
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-500 focus:ring-white/40 focus:bg-white/15"
                      : "bg-black/5 border-black/20 text-black placeholder-gray-600 focus:ring-black/40 focus:bg-black/10"
                  }`}
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed border ${
                isDarkMode
                  ? "bg-white/20 hover:bg-white/30 border-white/30 text-white"
                  : "bg-black/10 hover:bg-black/20 border-black/20 text-black"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {isLogin ? "Logging in..." : "Creating account..."}
                </span>
              ) : isLogin ? (
                "Login"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Link */}
          <div className={`text-center mt-6 pt-6 border-t transition-colors duration-300 ${
            isDarkMode ? "border-white/10" : "border-black/10"
          }`}>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFormData({ name: "", email: "", password: "", confirmPassword: "" });
                }}
                className={`font-semibold transition-colors ${
                  isDarkMode
                    ? "text-white hover:text-gray-300"
                    : "text-black hover:text-gray-700"
                }`}
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className={`text-center text-xs mt-6 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
          Only VIT students can access this platform
        </p>
      </motion.div>
    </div>
  );
}