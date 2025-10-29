import React, { useState, useContext } from "react";
import { ThemeContext } from "../App";
import * as slotSwapApi from "../services/slotSwapApi";

export default function CreateSwapForm({ onSwapCreated }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    courseCode: "",
    currentFaculty: "",
    currentSlot: "",
    desiredFaculty: "",
    desiredSlot: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.courseCode || !formData.currentFaculty || !formData.currentSlot || 
        !formData.desiredFaculty || !formData.desiredSlot) {
      setError("All fields are required");
      return;
    }

    if (formData.currentFaculty.trim() === formData.desiredFaculty.trim() && 
        formData.currentSlot.trim() === formData.desiredSlot.trim()) {
      setError("Current and desired slots must be different");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await slotSwapApi.createSwapRequest(formData);
      setSuccess("Swap request posted successfully!");
      setFormData({
        courseCode: "",
        currentFaculty: "",
        currentSlot: "",
        desiredFaculty: "",
        desiredSlot: "",
        notes: "",
      });
      setTimeout(() => {
        setSuccess("");
        onSwapCreated();
      }, 2000);
    } catch (err) {
      console.error("Error creating swap request:", err);
      setError(err.message || "Failed to create swap request");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40 focus:border-white/40"
      : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40 focus:border-black/40"
  }`;

  const labelClass = `block text-sm font-semibold mb-2 ${isDarkMode ? "text-white" : "text-black"}`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`backdrop-blur-2xl border rounded-2xl p-8 shadow-2xl ${
        isDarkMode
          ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20"
          : "bg-gradient-to-br from-black/5 to-black/0 border-black/10"
      }`}>
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-black"}`}>
          Post a Swap Request
        </h2>

        {error && (
          <div className={`mb-4 p-4 rounded-lg ${
            isDarkMode ? "bg-red-500/20 text-red-200" : "bg-red-50 text-red-800"
          }`}>
            {error}
          </div>
        )}

        {success && (
          <div className={`mb-4 p-4 rounded-lg ${
            isDarkMode ? "bg-green-500/20 text-green-200" : "bg-green-50 text-green-800"
          }`}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Code - Text Input */}
          <div>
            <label className={labelClass}>Course Code</label>
            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              placeholder="e.g., CSE2001, MAT2001"
              className={inputClass}
            />
          </div>

          {/* Current Faculty & Slot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Current Faculty</label>
              <input
                type="text"
                name="currentFaculty"
                value={formData.currentFaculty}
                onChange={handleChange}
                placeholder="e.g., Dr. Smith or Prof. John"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Current Slot</label>
              <input
                type="text"
                name="currentSlot"
                value={formData.currentSlot}
                onChange={handleChange}
                placeholder="e.g., A1, B2, C1"
                className={inputClass}
              />
            </div>
          </div>

          {/* Desired Faculty & Slot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Desired Faculty</label>
              <input
                type="text"
                name="desiredFaculty"
                value={formData.desiredFaculty}
                onChange={handleChange}
                placeholder="e.g., Dr. Johnson or Prof. Alice"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Desired Slot</label>
              <input
                type="text"
                name="desiredSlot"
                value={formData.desiredSlot}
                onChange={handleChange}
                placeholder="e.g., A1, B2, C1"
                className={inputClass}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Additional Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g., Prefer morning slots, flexible with faculty..."
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 resize-none ${
                isDarkMode
                  ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40 focus:border-white/40"
                  : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40 focus:border-black/40"
              }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl border ${
              isDarkMode
                ? "bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/40 text-white disabled:opacity-50"
                : "bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/30 text-black disabled:opacity-50"
            }`}
          >
            {loading ? "Posting..." : "Post Swap Request"}
          </button>
        </form>

        {/* Info Section */}
        <div className={`mt-6 p-4 rounded-lg ${
          isDarkMode ? "bg-white/5" : "bg-black/5"
        }`}>
          <p className={`text-sm ${isDarkMode ? "text-white/70" : "text-black/70"}`}>
            <strong>ℹ️ Tips:</strong> Be specific with faculty names and slot codes. Your request will be visible to other students who can match with you.
          </p>
        </div>
      </div>
    </div>
  );
}