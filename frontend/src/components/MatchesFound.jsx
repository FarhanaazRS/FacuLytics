import React, { useState, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../App";
import * as slotSwapApi from "../services/slotSwapApi";

export default function MatchesFound({ match, onConfirmed }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [matchedContact, setMatchedContact] = useState(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(match.status);

  // Fetch matched student's contact info - when status changes to matched
  useEffect(() => {
    if (currentStatus === "matched" && match.requestId) {
      console.log("🔄 FETCHING CONTACT FOR MATCHED REQUEST:", match.requestId);
      fetchMatchedContact();
    }
  }, [currentStatus, match.requestId, match._id]); // Added match._id to trigger when match updates

  const fetchMatchedContact = async () => {
    try {
      setLoadingContact(true);
      const contact = await slotSwapApi.getMatchedStudentPhone(match.requestId);
      setMatchedContact(contact);
    } catch (err) {
      console.error("Error fetching contact:", err);
    } finally {
      setLoadingContact(false);
    }
  };

  const handleConfirmSwap = async () => {
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
      const requestId = match.requestId;
      await slotSwapApi.confirmSwap(
        requestId,
        match._id,
        phoneNumber,
        name,
        notes
      );
      setSuccess("✓ Swap confirmed! Your contact has been shared.");
      
      // Update local status to trigger contact fetch IMMEDIATELY
      setCurrentStatus("matched");
      setShowForm(false);
      setName("");
      setPhoneNumber("");
      setNotes("");
      setConfirming(false);
      
      // Then refresh after a moment
      setTimeout(() => {
        onConfirmed();
      }, 1000);
    } catch (err) {
      console.error("Error confirming swap:", err);
      setError(err.message || "Failed to confirm swap");
      setConfirming(false);
    }
  };

  // If swap is completed, show completion message
  if (currentStatus === "completed") {
    return (
      <div
        className={`backdrop-blur-2xl border rounded-2xl p-6 shadow-xl ${
          isDarkMode
            ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20"
            : "bg-gradient-to-br from-black/5 to-black/0 border-black/10"
        }`}
      >
        <div className="text-center">
          <div
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
              isDarkMode
                ? "bg-purple-500/20 text-purple-200"
                : "bg-purple-50 text-purple-800"
            }`}
          >
            ✓ Swap Completed
          </div>
          <p
            className={`text-sm ${
              isDarkMode ? "text-white/70" : "text-black/70"
            }`}
          >
            This swap has been completed successfully!
          </p>
        </div>
      </div>
    );
  }

  // If swap is matched and contact info is available, show it
  if (matchedContact && currentStatus === "matched") {
    console.log("📱 DISPLAYING MATCHED CONTACT:", matchedContact);
    return (
      <div
        className={`backdrop-blur-2xl border rounded-2xl p-6 shadow-xl ${
          isDarkMode
            ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20"
            : "bg-gradient-to-br from-black/5 to-black/0 border-black/10"
        }`}
      >
        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isDarkMode
                ? "bg-green-500/20 text-green-200"
                : "bg-green-50 text-green-800"
            }`}
          >
            ✓ Matched & Confirmed
          </span>
        </div>

        {/* Their Info */}
        <div
          className="mb-4 pb-4 border-b"
          style={{
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          }}
        >
          <p
            className={`text-xs font-semibold mb-2 ${
              isDarkMode ? "text-white/60" : "text-black/60"
            }`}
          >
            MATCHED WITH
          </p>
          <p
            className={`text-lg font-bold ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {matchedContact.studentName || "Student"}
          </p>
        </div>

        {/* Their Slot Details */}
        <div
          className="mb-4 pb-4 border-b"
          style={{
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          }}
        >
          <p
            className={`text-xs font-semibold mb-2 ${
              isDarkMode ? "text-white/60" : "text-black/60"
            }`}
          >
            THEY HAVE
          </p>
          <div className="space-y-1">
            <p
              className={`text-sm ${
                isDarkMode ? "text-white/90" : "text-black/90"
              }`}
            >
              <span className="font-semibold">Faculty:</span>{" "}
              {match.currentFaculty}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-white/90" : "text-black/90"
              }`}
            >
              <span className="font-semibold">Slot:</span> {match.currentSlot}
            </p>
          </div>
        </div>

        {/* Their Desired Slots */}
        <div
          className="mb-4 pb-4 border-b"
          style={{
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          }}
        >
          <p
            className={`text-xs font-semibold mb-2 ${
              isDarkMode ? "text-white/60" : "text-black/60"
            }`}
          >
            THEY WANT
          </p>
          <div className="space-y-1">
            <p
              className={`text-sm ${
                isDarkMode ? "text-white/90" : "text-black/90"
              }`}
            >
              <span className="font-semibold">Faculty:</span>{" "}
              {match.desiredFaculty}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-white/90" : "text-black/90"
              }`}
            >
              <span className="font-semibold">Slot:</span> {match.desiredSlot}
            </p>
          </div>
        </div>

        {/* Shared Contact Information - NOW WITH ACTUAL PHONE */}
        <div
          className="mb-4 pb-4 border-b"
          style={{
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          }}
        >
          <p
            className={`text-xs font-semibold mb-3 ${
              isDarkMode ? "text-white/60" : "text-black/60"
            }`}
          >
            📞 CONTACT INFORMATION
          </p>
          <div className="space-y-2 bg-white/10 rounded-lg p-3">
            <p
              className={`text-sm ${
                isDarkMode ? "text-white/90" : "text-black/90"
              }`}
            >
              <span className="font-semibold">Name:</span>{" "}
              <span className={isDarkMode ? "text-green-300" : "text-green-700"}>
                {matchedContact.studentName || matchedContact.studentContactName || "N/A"}
              </span>
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-white/90" : "text-black/90"
              }`}
            >
              <span className="font-semibold">Phone:</span>{" "}
              <span className={isDarkMode ? "text-green-300" : "text-green-700"}>
                {matchedContact.studentPhone && matchedContact.studentPhone !== "N/A"
                  ? matchedContact.studentPhone
                  : "Not shared yet"}
              </span>
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-white/90" : "text-black/90"
              }`}
            >
              <span className="font-semibold">Email:</span>{" "}
              <span className={isDarkMode ? "text-blue-300" : "text-blue-700"}>
                {matchedContact.studentEmail || "N/A"}
              </span>
            </p>
            {matchedContact.bargainingNotes && (
              <p
                className={`text-sm italic ${
                  isDarkMode ? "text-white/70" : "text-black/70"
                }`}
              >
                <span className="font-semibold">Notes:</span>{" "}
                {matchedContact.bargainingNotes}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            if (matchedContact.studentPhone && matchedContact.studentPhone !== "N/A") {
              alert(
                `Contact Details:\n\nName: ${matchedContact.studentName}\nPhone: ${matchedContact.studentPhone}\n\nReach out to finalize the swap!`
              );
            } else {
              alert("Waiting for the other student to share their contact information.");
            }
          }}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-all shadow-lg border ${
            isDarkMode
              ? "bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/40 text-white"
              : "bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/30 text-black"
          }`}
        >
          📞 Contact to Finalize Swap
        </button>
      </div>
    );
  }

  // Original state - show perfect match card with form
  return (
    <div
      className={`backdrop-blur-2xl border rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl ${
        isDarkMode
          ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/30"
          : "bg-gradient-to-br from-black/5 to-black/0 border-black/10 hover:border-black/20"
      }`}
    >
      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isDarkMode
              ? "bg-green-500/20 text-green-200"
              : "bg-green-50 text-green-800"
          }`}
        >
          ✓ Perfect Match Found
        </span>
      </div>

      {/* Match Info */}
      <div
        className="mb-4 pb-4 border-b"
        style={{
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)",
        }}
      >
        <p
          className={`text-xs font-semibold mb-2 ${
            isDarkMode ? "text-white/60" : "text-black/60"
          }`}
        >
          MATCHED WITH
        </p>
        <p
          className={`text-lg font-bold ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {match.studentName || "Anonymous"}
        </p>
      </div>

      {/* Their Setup */}
      <div
        className="mb-4 pb-4 border-b"
        style={{
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)",
        }}
      >
        <p
          className={`text-xs font-semibold mb-2 ${
            isDarkMode ? "text-white/60" : "text-black/60"
          }`}
        >
          THEY HAVE
        </p>
        <div className="space-y-1">
          <p
            className={`text-sm ${
              isDarkMode ? "text-white/90" : "text-black/90"
            }`}
          >
            <span className="font-semibold">Faculty:</span>{" "}
            {match.currentFaculty}
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-white/90" : "text-black/90"
            }`}
          >
            <span className="font-semibold">Slot:</span> {match.currentSlot}
          </p>
        </div>
      </div>

      {/* They Want */}
      <div
        className="mb-4 pb-4 border-b"
        style={{
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)",
        }}
      >
        <p
          className={`text-xs font-semibold mb-2 ${
            isDarkMode ? "text-white/60" : "text-black/60"
          }`}
        >
          THEY WANT
        </p>
        <div className="space-y-1">
          <p
            className={`text-sm ${
              isDarkMode ? "text-white/90" : "text-black/90"
            }`}
          >
            <span className="font-semibold">Faculty:</span>{" "}
            {match.desiredFaculty}
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-white/90" : "text-black/90"
            }`}
          >
            <span className="font-semibold">Slot:</span> {match.desiredSlot}
          </p>
        </div>
      </div>

      {/* Their Notes */}
      {match.notes && (
        <div
          className="mb-4 pb-4 border-b"
          style={{
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          }}
        >
          <p
            className={`text-xs font-semibold mb-1 ${
              isDarkMode ? "text-white/60" : "text-black/60"
            }`}
          >
            THEIR NOTES
          </p>
          <p
            className={`text-sm italic ${
              isDarkMode ? "text-white/70" : "text-black/70"
            }`}
          >
            "{match.notes}"
          </p>
        </div>
      )}

      {/* Form or Button */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl border ${
            isDarkMode
              ? "bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/40 text-white"
              : "bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/30 text-black"
          }`}
        >
          Proceed with Swap
        </button>
      ) : (
        <div className="space-y-4">
          {error && (
            <div
              className={`p-3 rounded-lg text-sm ${
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
              className={`p-3 rounded-lg text-sm ${
                isDarkMode
                  ? "bg-green-500/20 text-green-200"
                  : "bg-green-50 text-green-800"
              }`}
            >
              {success}
            </div>
          )}

          {/* Name Input */}
          <div>
            <label
              className={`block text-xs font-semibold mb-2 ${
                isDarkMode ? "text-white/80" : "text-black/80"
              }`}
            >
              Your Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 text-sm ${
                isDarkMode
                  ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40 focus:border-white/40"
                  : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40 focus:border-black/40"
              }`}
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label
              className={`block text-xs font-semibold mb-2 ${
                isDarkMode ? "text-white/80" : "text-black/80"
              }`}
            >
              Your Phone Number *
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="10-digit number"
              className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 text-sm ${
                isDarkMode
                  ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40 focus:border-white/40"
                  : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40 focus:border-black/40"
              }`}
            />
            <p
              className={`text-xs mt-1 ${
                isDarkMode ? "text-white/50" : "text-black/50"
              }`}
            >
              Only shared after you confirm
            </p>
          </div>

          {/* Notes Input (Optional) */}
          <div>
            <label
              className={`block text-xs font-semibold mb-2 ${
                isDarkMode ? "text-white/80" : "text-black/80"
              }`}
            >
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add bargaining notes or special requests..."
              rows="2"
              className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 text-sm resize-none ${
                isDarkMode
                  ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40 focus:border-white/40"
                  : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40 focus:border-black/40"
              }`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowForm(false);
                setName("");
                setPhoneNumber("");
                setNotes("");
                setError("");
              }}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all border ${
                isDarkMode
                  ? "bg-transparent border-white/30 text-white hover:bg-white/10"
                  : "bg-transparent border-black/30 text-black hover:bg-black/5"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSwap}
              disabled={!phoneNumber || !name || confirming}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg border ${
                isDarkMode
                  ? "bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/40 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/30 text-black disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {confirming ? "Confirming..." : "Confirm Swap"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}