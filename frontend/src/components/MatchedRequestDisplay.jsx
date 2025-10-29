import React, { useContext } from "react";
import { ThemeContext } from "../App";

export default function MatchedRequestDisplay({ request }) {
  const { isDarkMode } = useContext(ThemeContext);

  // Get the matched request details
  const matched = request.matchedWith;
  if (!matched) return null;

  console.log("📱 DISPLAYING MATCHED REQUEST DETAILS");
  console.log("  My Request:", request._id);
  console.log("  Matched With:", matched._id);
  console.log("  Their Phone:", matched.studentPhone);
  console.log("  Their Name:", matched.studentName);

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
          ✓ Matched
        </span>
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

      {/* Your Slot Details */}
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
          YOU HAVE
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
            {matched.currentFaculty}
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-white/90" : "text-black/90"
            }`}
          >
            <span className="font-semibold">Slot:</span> {matched.currentSlot}
          </p>
        </div>
      </div>

      {/* What You Want */}
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
          YOU WANT
        </p>
        <div className="space-y-1">
          <p
            className={`text-sm ${
              isDarkMode ? "text-white/90" : "text-black/90"
            }`}
          >
            <span className="font-semibold">Faculty:</span>{" "}
            {request.desiredFaculty}
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

      {/* THEIR CONTACT INFO - THIS IS KEY! */}
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
            <span
              className={
                isDarkMode ? "text-green-300 font-bold" : "text-green-700 font-bold"
              }
            >
              {matched.studentName || matched.studentContactName || "N/A"}
            </span>
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-white/90" : "text-black/90"
            }`}
          >
            <span className="font-semibold">Phone:</span>{" "}
            <span
              className={
                matched.studentPhone && matched.studentPhone !== "N/A"
                  ? isDarkMode
                    ? "text-green-300 font-bold"
                    : "text-green-700 font-bold"
                  : isDarkMode
                  ? "text-red-300"
                  : "text-red-700"
              }
            >
              {matched.studentPhone && matched.studentPhone !== "N/A"
                ? matched.studentPhone
                : "Waiting for their confirmation..."}
            </span>
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-white/90" : "text-black/90"
            }`}
          >
            <span className="font-semibold">Email:</span>{" "}
            <span className={isDarkMode ? "text-blue-300" : "text-blue-700"}>
              {matched.studentEmail || "N/A"}
            </span>
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div
        className={`p-3 rounded-lg text-sm ${
          isDarkMode
            ? "bg-blue-500/20 text-blue-200"
            : "bg-blue-50 text-blue-800"
        }`}
      >
        ℹ️ Both students have confirmed this match. You can now contact each other
        to finalize the swap.
      </div>
    </div>
  );
}