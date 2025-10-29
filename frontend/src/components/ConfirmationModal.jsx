import React, { useState, useContext } from "react";
import { ThemeContext } from "../App";
import * as slotSwapApi from "../services/slotSwapApi";

export default function ConfirmationModal({ matches, request, onClose, onConfirmed }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleConfirmSwap = async () => {
    if (!selectedMatch) {
      setError("Please select a match");
      return;
    }

    if (!name || name.trim().length === 0) {
      setError("Please enter your name");
      return;
    }

    if (!phoneNumber || phoneNumber.trim().length === 0) {
      setError("Please enter your phone number");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setConfirming(true);
    setError("");

    try {
      await slotSwapApi.confirmSwap(
        request._id,
        selectedMatch._id,
        phoneNumber,
        name,
        notes
      );
      setSuccess("✓ Swap confirmed! Your contact details have been shared.");
      setTimeout(() => {
        onConfirmed();
        // Don't close modal immediately - let user see confirmation
      }, 2000);
    } catch (err) {
      console.error("Error confirming swap:", err);
      setError(err.message || "Failed to confirm swap");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border ${
          isDarkMode
            ? "bg-gradient-to-br from-black via-gray-900 to-black border-white/20"
            : "bg-gradient-to-br from-white via-gray-50 to-white border-black/10"
        }`}
      >
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Swap Matches Found!
            </h2>
            <button
              onClick={onClose}
              className={`text-2xl font-bold transition-all ${
                isDarkMode
                  ? "text-white/60 hover:text-white"
                  : "text-black/60 hover:text-black"
              }`}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div
              className={`mb-3 p-3 rounded-lg text-sm ${
                isDarkMode
                  ? "bg-red-500/20 text-red-200"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className={`mb-3 p-3 rounded-lg text-sm ${
                isDarkMode
                  ? "bg-green-500/20 text-green-200"
                  : "bg-green-50 text-green-800"
              }`}
            >
              {success}
            </div>
          )}

          {/* Main Content */}
          {matches.length === 0 ? (
            <div
              className={`text-center py-6 ${
                isDarkMode ? "text-white/60" : "text-black/60"
              }`}
            >
              No perfect matches found for this swap request yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left: Matches List */}
              <div>
                <p
                  className={`text-xs font-semibold mb-2 ${
                    isDarkMode ? "text-white/70" : "text-black/70"
                  }`}
                >
                  SELECT MATCH
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {matches.map((match) => (
                    <div
                      key={match._id}
                      onClick={() => setSelectedMatch(match)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedMatch?._id === match._id
                          ? isDarkMode
                            ? "bg-white/10 border-white/40"
                            : "bg-black/5 border-black/40"
                          : isDarkMode
                          ? "bg-white/5 border-white/20 hover:border-white/30"
                          : "bg-black/5 border-black/10 hover:border-black/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold text-sm ${
                              isDarkMode ? "text-white" : "text-black"
                            }`}
                          >
                            {match.studentName || "Anonymous"}
                          </p>
                          <div
                            className={`text-xs mt-1 space-y-0.5 ${
                              isDarkMode
                                ? "text-white/70"
                                : "text-black/70"
                            }`}
                          >
                            <p>
                              <span className="font-semibold">Has:</span> {match.currentFaculty} ({match.currentSlot})
                            </p>
                            <p>
                              <span className="font-semibold">Wants:</span> {match.desiredFaculty} ({match.desiredSlot})
                            </p>
                          </div>
                        </div>
                        <div
                          className={`text-lg flex-shrink-0 ${
                            selectedMatch?._id === match._id
                              ? isDarkMode
                                ? "text-white"
                                : "text-black"
                              : isDarkMode
                              ? "text-white/30"
                              : "text-black/30"
                          }`}
                        >
                          {selectedMatch?._id === match._id ? "✓" : "○"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Form */}
              {selectedMatch ? (
                <div className="space-y-3">
                  <h3
                    className={`text-xs font-semibold ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    YOUR CONTACT INFO
                  </h3>

                  {/* Name Input */}
                  <div>
                    <label
                      className={`block text-xs font-semibold mb-1 ${
                        isDarkMode ? "text-white/80" : "text-black/80"
                      }`}
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className={`w-full px-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40 focus:border-white/40"
                          : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40 focus:border-black/40"
                      }`}
                    />
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label
                      className={`block text-xs font-semibold mb-1 ${
                        isDarkMode ? "text-white/80" : "text-black/80"
                      }`}
                    >
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="10-digit number"
                      className={`w-full px-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40 focus:border-white/40"
                          : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40 focus:border-black/40"
                      }`}
                    />
                  </div>

                  {/* Notes Input */}
                  <div>
                    <label
                      className={`block text-xs font-semibold mb-1 ${
                        isDarkMode ? "text-white/80" : "text-black/80"
                      }`}
                    >
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Bargaining notes..."
                      rows="2"
                      className={`w-full px-3 py-2 rounded-lg border text-xs transition-all focus:outline-none focus:ring-2 resize-none ${
                        isDarkMode
                          ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40 focus:border-white/40"
                          : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40 focus:border-black/40"
                      }`}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={onClose}
                      className={`flex-1 px-3 py-2 rounded-lg font-semibold text-xs transition-all border ${
                        isDarkMode
                          ? "bg-transparent border-white/30 text-white hover:bg-white/10"
                          : "bg-transparent border-black/30 text-black hover:bg-black/5"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmSwap}
                      disabled={
                        !selectedMatch || !phoneNumber || !name || confirming
                      }
                      className={`flex-1 px-3 py-2 rounded-lg font-semibold text-xs transition-all shadow-lg border ${
                        isDarkMode
                          ? "bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/40 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          : "bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/30 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                      }`}
                    >
                      {confirming ? "Confirming..." : "Confirm Swap"}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center h-48 text-center text-sm ${
                    isDarkMode ? "text-white/50" : "text-black/50"
                  }`}
                >
                  Select a match to continue
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}