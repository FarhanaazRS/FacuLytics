import React, { useContext, useState } from "react";
import { FacuContext, ThemeContext } from "../App";
import ReviewForm from "../components/ReviewForm";

export default function AddReviewPage() {
  const { faculties, token } = useContext(FacuContext);
  const { isDarkMode } = useContext(ThemeContext);

  const [step, setStep] = useState("search");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [newFacultyData, setNewFacultyData] = useState({
    name: "",
    course: "",
  });
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const filteredFaculties = Array.isArray(faculties)
    ? faculties.filter((f) =>
        `${f.name} ${f.subject}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectExistingFaculty = (faculty) => {
    setSelectedFaculty({
      id: faculty._id,
      name: faculty.name,
      course: faculty.subject,
      isNew: false,
    });
    setStep("review");
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleAddNewFaculty = (e) => {
    e.preventDefault();

    if (!newFacultyData.name || !newFacultyData.course) {
      setMessage("Please fill in all fields");
      return;
    }

    setSelectedFaculty({
      id: null,
      name: newFacultyData.name,
      course: newFacultyData.course,
      isNew: true,
    });
    setMessage("");
    setStep("review");
  };

  const handleReviewSubmit = async (payload) => {
    setLoading(true);
    setMessage("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          facultyId: selectedFaculty.id,
          teaching: payload.teaching,
          marks: payload.marks,
          quiz: payload.quiz,
          feedback: payload.comment,
          isNewFaculty: selectedFaculty.isNew,
          facultyName: selectedFaculty.name,
          courseName: selectedFaculty.course,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${data.error || "Failed to submit review"}`);
        setLoading(false);
        return;
      }

      setMessage("✓ Review submitted successfully! Your request has been passed to admin for approval.");
      setLoading(false);

      setTimeout(() => {
        setStep("search");
        setSelectedFaculty(null);
        setSearchQuery("");
        setNewFacultyData({ name: "", course: "" });
        setMessage("");
      }, 5000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  const handleBackToSearch = () => {
    setStep("search");
    setSelectedFaculty(null);
    setSearchQuery("");
    setNewFacultyData({ name: "", course: "" });
    setMessage("");
  };

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${
      isDarkMode
        ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black"
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold bg-clip-text text-transparent mb-2 bg-gradient-to-r ${
            isDarkMode
              ? "from-white to-white/60"
              : "from-black to-black/60"
          }`}>
            Add Review
          </h1>
          <p className={isDarkMode ? "text-white/60" : "text-black/60"}>
            Search for a faculty or add a new one
          </p>
        </div>

        {/* Step 1: Search */}
        {step === "search" && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <svg
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? "text-white/40" : "text-black/40"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search faculty by name or course..."
                className={`w-full pl-12 pr-4 py-4 rounded-xl backdrop-blur-xl border transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40"
                    : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40"
                }`}
              />
            </div>

            {/* Search Results */}
            {showSuggestions && searchQuery && (
              <div className={`backdrop-blur-xl border rounded-xl overflow-hidden shadow-2xl ${
                isDarkMode
                  ? "bg-white/5 border-white/20"
                  : "bg-black/5 border-black/20"
              }`}>
                {filteredFaculties.length > 0 ? (
                  <div className="space-y-2 p-3">
                    {filteredFaculties.map((f) => (
                      <button
                        key={f._id}
                        onClick={() => handleSelectExistingFaculty(f)}
                        className={`w-full p-4 text-left rounded-lg border transition-all ${
                          isDarkMode
                            ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
                            : "bg-black/5 hover:bg-black/10 border-black/10 hover:border-black/20"
                        }`}
                      >
                        <div className="font-medium">{f.name}</div>
                        <div className={`text-sm ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                          {f.subject}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    <p className={`text-sm ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                      No faculty found
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Or Divider */}
            <div className="flex items-center gap-4">
              <div className={`flex-1 h-px ${isDarkMode ? "bg-white/20" : "bg-black/20"}`}></div>
              <span className={`text-sm ${isDarkMode ? "text-white/60" : "text-black/60"}`}>OR</span>
              <div className={`flex-1 h-px ${isDarkMode ? "bg-white/20" : "bg-black/20"}`}></div>
            </div>

            {/* Add New Faculty Form */}
            <form onSubmit={handleAddNewFaculty} className={`backdrop-blur-2xl p-6 rounded-xl border space-y-4 ${
              isDarkMode
                ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20"
                : "bg-gradient-to-br from-black/5 to-black/0 border-black/10"
            }`}>
              <h2 className="text-xl font-bold mb-4">Add New Faculty</h2>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-white/80" : "text-black/80"
                }`}>
                  Faculty Name
                </label>
                <input
                  type="text"
                  value={newFacultyData.name}
                  onChange={(e) => setNewFacultyData({ ...newFacultyData, name: e.target.value })}
                  placeholder="e.g., Dr. John Smith"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                    isDarkMode
                      ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40"
                      : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-white/80" : "text-black/80"
                }`}>
                  Course
                </label>
                <input
                  type="text"
                  value={newFacultyData.course}
                  onChange={(e) => setNewFacultyData({ ...newFacultyData, course: e.target.value })}
                  placeholder="e.g., Data Structures"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                    isDarkMode
                      ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40"
                      : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40"
                  }`}
                />
              </div>

              <div className={`p-3 rounded-lg border text-xs ${
                isDarkMode
                  ? "bg-white/5 border-white/10 text-white/60"
                  : "bg-black/5 border-black/10 text-black/60"
              }`}>
                ℹ️ You'll write your review in the next step, then both will be submitted to admin for approval.
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 py-3 px-4 rounded-lg transition-all font-semibold"
              >
                Next →
              </button>
            </form>

            {/* Error Message */}
            {message && (
              <div className={`p-4 rounded-xl text-center font-semibold border ${
                isDarkMode
                  ? "bg-red-500/20 border-red-500/50 text-red-300"
                  : "bg-red-500/10 border-red-500/30 text-red-700"
              }`}>
                {message}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Review */}
        {step === "review" && selectedFaculty && (
          <div className="space-y-6">
            {/* Faculty Info Card */}
            <div className={`backdrop-blur-2xl p-6 rounded-xl border ${
              isDarkMode
                ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20"
                : "bg-gradient-to-br from-black/5 to-black/0 border-black/10"
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedFaculty.name}</h2>
                  <p className={`mb-2 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                    {selectedFaculty.course}
                  </p>
                  {selectedFaculty.isNew && (
                    <p className="text-yellow-300/80 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                      New Faculty (Pending Admin Approval)
                    </p>
                  )}
                </div>
                <button
                  onClick={handleBackToSearch}
                  className={`rounded-lg text-xl w-8 h-8 flex items-center justify-center transition-all ${
                    isDarkMode
                      ? "text-white/60 hover:text-white hover:bg-white/20"
                      : "text-black/60 hover:text-black hover:bg-black/20"
                  }`}
                >
                  ←
                </button>
              </div>
            </div>

            {/* Review Form */}
            <div className={`backdrop-blur-2xl p-6 rounded-xl border ${
              isDarkMode
                ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20"
                : "bg-gradient-to-br from-black/5 to-black/0 border-black/10"
            }`}>
              <h3 className="text-xl font-bold mb-6">Submit Your Review</h3>
              <ReviewForm onSubmit={handleReviewSubmit} submitLabel="Submit Review" loading={loading} />
            </div>

            {/* Info Box */}
            <div className={`backdrop-blur-xl border p-6 rounded-xl ${
              isDarkMode
                ? "bg-white/5 border-white/10"
                : "bg-black/5 border-black/10"
            }`}>
              <div className="font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Rating Scale
              </div>
              <ul className={`space-y-2 text-sm ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                <li>• <strong className={isDarkMode ? "text-white/80" : "text-black/80"}>Teaching Quality:</strong> Clarity, engagement, effectiveness</li>
                <li>• <strong className={isDarkMode ? "text-white/80" : "text-black/80"}>Marks/Grading:</strong> Higher = more lenient grading</li>
                <li>• <strong className={isDarkMode ? "text-white/80" : "text-black/80"}>Quiz Difficulty:</strong> Higher = easier quizzes</li>
              </ul>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-xl text-center font-semibold border ${
                  message.includes("Error")
                    ? isDarkMode
                      ? "bg-red-500/20 border-red-500/50 text-red-300"
                      : "bg-red-500/10 border-red-500/30 text-red-700"
                    : isDarkMode
                    ? "bg-green-500/20 border-green-500/50 text-green-300"
                    : "bg-green-500/10 border-green-500/30 text-green-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
