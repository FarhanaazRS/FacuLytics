import React, { useState, useContext } from "react";
import { ThemeContext } from "../App";
import ConfirmationModal from "./ConfirmationModal";
import MatchedRequestDisplay from "./MatchedRequestDisplay";
import * as slotSwapApi from "../services/slotSwapApi";

export default function SwapRequestCard({ request, isOwn = false, onDeleted, onConfirmed }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleFindMatches = async () => {
    setLoadingMatches(true);
    try {
      const data = await slotSwapApi.findMatches(request._id);
      setMatches(data.matches || []);
      setShowModal(true);
    } catch (err) {
      console.error("Error finding matches:", err);
      alert("Failed to find matches");
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this swap request?")) {
      setDeleting(true);
      try {
        await slotSwapApi.deleteSwapRequest(request._id);
        onDeleted();
      } catch (err) {
        console.error("Error deleting request:", err);
        alert("Failed to delete request");
      } finally {
        setDeleting(false);
      }
    }
  };

  const getStatusBadge = () => {
    const statusColors = {
      open: isDarkMode ? "bg-blue-500/20 text-blue-200" : "bg-blue-50 text-blue-800",
      matched: isDarkMode ? "bg-green-500/20 text-green-200" : "bg-green-50 text-green-800",
      completed: isDarkMode ? "bg-purple-500/20 text-purple-200" : "bg-purple-50 text-purple-800",
    };
    return statusColors[request.status] || statusColors.open;
  };

  const getStatusLabel = () => {
    switch (request.status) {
      case "open":
        return "Open";
      case "matched":
        return isOwn ? "Matched" : "Matched";
      case "completed":
        return "Completed";
      default:
        return request.status;
    }
  };

  // If it's own matched request, show special display with contact info
  if (isOwn && request.status === "matched") {
    return <MatchedRequestDisplay request={request} />;
  }

  // Only show card if it's NOT a matched request (those go to Matches tab)
  // Or if it's own request in my-requests, show all statuses
  if (!isOwn && request.status !== "open") {
    return null;
  }

  return (
    <>
      <div
        className={`backdrop-blur-2xl border rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl ${
          isDarkMode
            ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/30"
            : "bg-gradient-to-br from-black/5 to-black/0 border-black/10 hover:border-black/20"
        }`}
      >
        {/* Status Badge */}
        <div className="flex justify-between items-start mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge()}`}
          >
            {getStatusLabel()}
          </span>
          {isOwn && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${
                isDarkMode
                  ? "text-red-200 hover:bg-red-500/20 disabled:opacity-50"
                  : "text-red-800 hover:bg-red-50 disabled:opacity-50"
              }`}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        {/* Course Info */}
        <div className="mb-4">
          <p
            className={`text-xs font-semibold ${
              isDarkMode ? "text-white/60" : "text-black/60"
            }`}
          >
            COURSE
          </p>
          <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
            {request.courseCode}
          </p>
        </div>

        {/* Current Setup */}
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
            CURRENTLY HAVE
          </p>
          <div className="space-y-1">
            <p
              className={`text-sm ${
                isDarkMode ? "text-white/90" : "text-black/90"
              }`}
            >
              <span className="font-semibold">Faculty:</span> {request.currentFaculty}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-white/90" : "text-black/90"
              }`}
            >
              <span className="font-semibold">Slot:</span> {request.currentSlot}
            </p>
          </div>
        </div>

        {/* Desired Setup */}
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
            WANT TO GET
          </p>
          <div className="space-y-1">
            <p
              className={`text-sm ${
                isDarkMode ? "text-white/90" : "text-black/90"
              }`}
            >
              <span className="font-semibold">Faculty:</span> {request.desiredFaculty}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-white/90" : "text-black/90"
              }`}
            >
              <span className="font-semibold">Slot:</span> {request.desiredSlot}
            </p>
          </div>
        </div>

        {/* Notes */}
        {request.notes && (
          <div className="mb-4">
            <p
              className={`text-xs font-semibold mb-1 ${
                isDarkMode ? "text-white/60" : "text-black/60"
              }`}
            >
              NOTES
            </p>
            <p
              className={`text-sm italic ${
                isDarkMode ? "text-white/70" : "text-black/70"
              }`}
            >
              "{request.notes}"
            </p>
          </div>
        )}

        {/* Student Info */}
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
            POSTED BY
          </p>
          <p className={`text-sm ${isDarkMode ? "text-white" : "text-black"}`}>
            {request.studentName || "Anonymous"}
          </p>
        </div>

        {/* Action Button */}
        {!isOwn && request.status === "open" && (
          <button
            onClick={handleFindMatches}
            disabled={loadingMatches}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl border ${
              isDarkMode
                ? "bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/40 text-white disabled:opacity-50"
                : "bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/30 text-black disabled:opacity-50"
            }`}
          >
            {loadingMatches ? "Checking..." : "Offer Swap"}
          </button>
        )}

        {isOwn && request.status === "matched" && (
          <div
            className={`px-4 py-3 rounded-lg text-center text-sm font-semibold ${
              isDarkMode
                ? "bg-green-500/20 text-green-200"
                : "bg-green-50 text-green-800"
            }`}
          >
            ✓ Matched with another student
          </div>
        )}

        {isOwn && request.status === "completed" && (
          <div
            className={`px-4 py-3 rounded-lg text-center text-sm font-semibold ${
              isDarkMode
                ? "bg-purple-500/20 text-purple-200"
                : "bg-purple-50 text-purple-800"
            }`}
          >
            ✓ Swap Completed
          </div>
        )}
      </div>

      {/* Modal for matches */}
      {showModal && (
        <ConfirmationModal
          matches={matches}
          request={request}
          onClose={() => setShowModal(false)}
          onConfirmed={onConfirmed}
        />
      )}
    </>
  );
}