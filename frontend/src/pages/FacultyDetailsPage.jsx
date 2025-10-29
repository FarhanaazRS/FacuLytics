import React, { useEffect, useState, useMemo, useContext } from "react";
import { useParams } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";
import { motion } from "framer-motion";
import { FacuContext, ThemeContext } from "../App";

export default function FacultyDetailsPage() {
  const { id } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const { user, token } = useContext(FacuContext);
  const [faculty, setFaculty] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

useEffect(() => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  fetch(`${API_URL}/api/faculty/${id}`)
    .then((res) => res.json())
    .then((data) => setFaculty(data))
    .catch((err) => console.error("Error fetching faculty:", err));
}, [id]);

  const computeOverall = (f) => {
    if (!f.reviews || f.reviews.length === 0) return 0;
    const sum = f.reviews.reduce(
      (acc, r) =>
        acc + (Number(r.teaching) + Number(r.marks) + Number(r.quiz)) / 3,
      0
    );
    return sum / f.reviews.length;
  };

  const averages = useMemo(() => {
    if (!faculty || !faculty.reviews || faculty.reviews.length === 0)
      return { teaching: 0, marks: 0, quiz: 0 };
    const sums = faculty.reviews.reduce(
      (acc, r) => {
        acc.teaching += Number(r.teaching || 0);
        acc.marks += Number(r.marks || 0);
        acc.quiz += Number(r.quiz || 0);
        return acc;
      },
      { teaching: 0, marks: 0, quiz: 0 }
    );
    const len = faculty.reviews.length;
    return {
      teaching: (sums.teaching / len).toFixed(2),
      marks: (sums.marks / len).toFixed(2),
      quiz: (sums.quiz / len).toFixed(2),
    };
  }, [faculty]);

  const handleAddReview = async (payload) => {
    setLoading(true);
    setMessage("");

    try {
      console.log("Token being sent:", token ? "✓ Token found" : "✗ No token");

      const res = await fetch(`http://localhost:5000/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          facultyId: id,
          teaching: payload.teaching,
          marks: payload.marks,
          quiz: payload.quiz,
          feedback: payload.comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${data.error}`);
        setLoading(false);
        return;
      }

      const updatedRes = await fetch(`http://localhost:5000/api/faculty/${id}`);
      if (!updatedRes.ok) {
        throw new Error("Failed to refresh faculty data");
      }
      const updatedFaculty = await updatedRes.json();
      setFaculty(updatedFaculty);

      setMessage("✓ Review added successfully!");
      setShowForm(false);
      setLoading(false);

      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  const handleDeleteReview = (reviewId) => {
    setShowDeleteConfirm(reviewId);
  };

  const confirmDeleteReview = async (reviewId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setMessage("Error: Failed to delete review");
        return;
      }

      // Refresh faculty data
      const updatedRes = await fetch(`http://localhost:5000/api/faculty/${id}`);
      if (!updatedRes.ok) {
        throw new Error("Failed to refresh faculty data");
      }
      const updatedFaculty = await updatedRes.json();
      setFaculty(updatedFaculty);

      setMessage("✓ Review deleted successfully!");
      setShowDeleteConfirm(null);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (!faculty) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-xl transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}>
        Loading faculty details...
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-24 px-6 sm:px-10 lg:px-16 transition-colors duration-300 ${
      isDarkMode
        ? "bg-black text-white"
        : "bg-white text-black"
    }`}>
      <motion.div
        className={`max-w-5xl mx-auto backdrop-blur-lg border rounded-2xl p-8 shadow-xl text-center mb-12 transition-colors duration-300 ${
          isDarkMode
            ? "bg-white/10 border-white/20"
            : "bg-black/5 border-black/10"
        }`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <div className={`w-28 h-28 rounded-full border-2 flex items-center justify-center overflow-hidden mb-5 ${
            isDarkMode
              ? "bg-white/20 border-white/30"
              : "bg-black/10 border-black/20"
          }`}>
            {faculty.image ? (
              <img
                src={faculty.image}
                alt={faculty.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className={`text-5xl font-bold ${
                isDarkMode ? "text-white/70" : "text-black/70"
              }`}>
                {faculty.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {faculty.name}
          </h1>
          <p className={`mb-3 text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            {faculty.subject}
          </p>
          <div className={`flex items-center justify-center gap-2 ${isDarkMode ? "text-white/90" : "text-black/90"}`}>
            <svg
              className={`w-6 h-6 fill-current ${isDarkMode ? "text-white" : "text-yellow-500"}`}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-2xl font-semibold">
              {computeOverall(faculty).toFixed(1)} / 5.0
            </span>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-8">
          {/* Average Ratings */}
          <div className={`backdrop-blur-lg border rounded-2xl p-6 shadow-lg transition-all duration-300 ${
            isDarkMode
              ? "bg-white/10 border-white/20 hover:border-white/30"
              : "bg-black/5 border-black/10 hover:border-black/20"
          }`}>
            <h2 className="text-2xl font-bold mb-6">Average Ratings</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className={`text-center p-4 rounded-lg ${
                isDarkMode ? "bg-white/5" : "bg-black/5"
              }`}>
                <div className={`text-sm mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Teaching Quality
                </div>
                <div className="text-3xl font-bold">{averages.teaching}</div>
                <div className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
                  / 5.0
                </div>
              </div>
              <div className={`text-center p-4 rounded-lg ${
                isDarkMode ? "bg-white/5" : "bg-black/5"
              }`}>
                <div className={`text-sm mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Marking Leniency
                </div>
                <div className="text-3xl font-bold">{averages.marks}</div>
                <div className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
                  / 5.0
                </div>
              </div>
              <div className={`text-center p-4 rounded-lg ${
                isDarkMode ? "bg-white/5" : "bg-black/5"
              }`}>
                <div className={`text-sm mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Quiz Difficulty
                </div>
                <div className="text-3xl font-bold">{averages.quiz}</div>
                <div className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
                  / 5.0
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className={`backdrop-blur-lg border rounded-2xl p-6 shadow-lg transition-all duration-300 ${
            isDarkMode
              ? "bg-white/10 border-white/20 hover:border-white/30"
              : "bg-black/5 border-black/10 hover:border-black/20"
          }`}>
            <h2 className="text-2xl font-bold mb-4">Recent Reviews ({faculty.reviews?.length || 0})</h2>
            <div className="flex flex-col gap-4">
              {faculty.reviews && faculty.reviews.length > 0 ? (
                [...faculty.reviews].reverse().map((r, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-xl p-4 transition-all duration-300 ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                        : "bg-black/5 border-black/10 hover:bg-black/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                            Teaching:
                          </span>
                          <span className="font-bold">{r.teaching}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                            Marks:
                          </span>
                          <span className="font-bold">{r.marks}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                            Quiz:
                          </span>
                          <span className="font-bold">{r.quiz}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recently"}
                        </div>
                        {/* Delete Button - Only show for admins */}
                        {user && user.role === "admin" && (
                          <button
                            onClick={() => handleDeleteReview(r._id)}
                            className="ml-2 px-2 py-1 text-xs rounded bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 transition-all font-semibold"
                            title="Delete review"
                          >
                            🗑
                          </button>
                        )}
                      </div>
                    </div>
                    {r.comment && r.comment.trim() && (
                      <p className={`text-sm p-3 rounded border ${
                        isDarkMode
                          ? "text-gray-300 bg-white/5 border-white/10"
                          : "text-gray-700 bg-black/5 border-black/10"
                      }`}>
                        "{r.comment}"
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  No reviews yet — be the first to add one.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8">
          {/* Add Review Card */}
          <div className={`backdrop-blur-lg border rounded-2xl p-6 shadow-lg transition-all duration-300 ${
            isDarkMode
              ? "bg-white/10 border-white/20 hover:border-white/30"
              : "bg-black/5 border-black/10 hover:border-black/20"
          }`}>
            <h2 className="text-xl font-bold mb-3">Add a Review</h2>
            <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Share feedback about teaching, marking & quizzes.
            </p>
            <button
              onClick={() => setShowForm((s) => !s)}
              className={`w-full transition-all duration-300 font-semibold rounded-xl py-2 border ${
                isDarkMode
                  ? "bg-white/20 hover:bg-white/30 border-white/30 text-white"
                  : "bg-black/10 hover:bg-black/20 border-black/20 text-black"
              }`}
            >
              {showForm ? "Hide Form" : "Add Review"}
            </button>

            {showForm && (
              <div className="mt-4">
                <ReviewForm submitLabel="Submit Review" onSubmit={handleAddReview} loading={loading} />
              </div>
            )}

            {message && (
              <div
                style={{
                  background: message.includes("Error")
                    ? isDarkMode
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(239, 68, 68, 0.1)"
                    : isDarkMode
                    ? "rgba(34, 197, 94, 0.2)"
                    : "rgba(34, 197, 94, 0.1)",
                  border: message.includes("Error")
                    ? isDarkMode
                      ? "1px solid rgba(239, 68, 68, 0.5)"
                      : "1px solid rgba(239, 68, 68, 0.3)"
                    : isDarkMode
                    ? "1px solid rgba(34, 197, 94, 0.5)"
                    : "1px solid rgba(34, 197, 94, 0.3)",
                  color: message.includes("Error") ? "#fca5a5" : "#86efac",
                  padding: "8px 12px",
                  borderRadius: 8,
                  marginTop: 12,
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                {message}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className={`backdrop-blur-lg border rounded-2xl p-6 shadow-lg transition-all duration-300 ${
            isDarkMode
              ? "bg-white/10 border-white/20 hover:border-white/30"
              : "bg-black/5 border-black/10 hover:border-black/20"
          }`}>
            <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className={`flex justify-between ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <span>Total Reviews</span>
                <span className="font-semibold">{faculty.reviews?.length || 0}</span>
              </div>
              <div className={`flex justify-between ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <span>Overall Rating</span>
                <span className="font-semibold">
                  {computeOverall(faculty).toFixed(1)} / 5.0
                </span>
              </div>
              <div className={`flex justify-between ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <span>Avg Teaching</span>
                <span className="font-semibold">{averages.teaching}</span>
              </div>
              <div className={`flex justify-between ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <span>Avg Marks</span>
                <span className="font-semibold">{averages.marks}</span>
              </div>
              <div className={`flex justify-between ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                <span>Avg Quiz</span>
                <span className="font-semibold">{averages.quiz}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${
          isDarkMode ? "bg-black/80" : "bg-white/80"
        }`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`backdrop-blur-2xl p-6 rounded-xl border w-full max-w-md ${
              isDarkMode
                ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20"
                : "bg-gradient-to-br from-black/5 to-black/0 border-black/10"
            }`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-center mb-2">Delete Review?</h2>
            <p className={`text-center mb-6 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
              This review will be permanently deleted.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className={`flex-1 border py-2 px-4 rounded-lg transition-all font-semibold ${
                  isDarkMode
                    ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                    : "bg-black/10 hover:bg-black/20 border-black/20 text-black"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteReview(showDeleteConfirm)}
                className="flex-1 bg-red-600/30 hover:bg-red-600/40 border border-red-500/60 text-red-300 py-2 px-4 rounded-lg transition-all font-semibold"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}