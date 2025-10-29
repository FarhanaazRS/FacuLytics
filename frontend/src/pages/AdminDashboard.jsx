import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FacuContext, ThemeContext } from "../App";

export default function AdminDashboard() {
  const { user, token } = useContext(FacuContext);
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [allFaculties, setAllFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [filter, setFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [facultySearch, setFacultySearch] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const [pendingRes, historyRes, facultiesRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/pending-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),

        fetch(`${API_URL}/api/admin/history`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),

        fetch(`${API_URL}/api/faculties`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),
      ]);

      // Extract data from responses (backend returns { success, count, data })
      setPendingRequests(Array.isArray(pendingRes.data) ? pendingRes.data : []);
      setHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
      setAllFaculties(Array.isArray(facultiesRes.data) ? facultiesRes.data : []);

    } catch (err) {
      console.error("Error fetching admin data:", err);
      // Set empty arrays on error to prevent .map errors
      setPendingRequests([]);
      setHistory([]);
      setAllFaculties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${API_URL}/api/admin/approve-faculty/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to approve");

    setSuccessMessage("✓ Faculty approved successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    fetchRequests();
  } catch (error) {
    console.error("Error approving faculty:", error);
  }
};

 const handleReject = async (id) => {
  if (!rejectionReason.trim()) {
    setSuccessMessage("Please provide a rejection reason");
    return;
  }

  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${API_URL}/api/admin/reject-faculty/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason: rejectionReason }),
    });

    if (!res.ok) throw new Error("Failed to reject");

    setSuccessMessage("✓ Faculty rejected successfully!");
    setShowRejectForm(null);
    setRejectionReason("");
    setTimeout(() => setSuccessMessage(""), 3000);
    fetchRequests();
  } catch (error) {
    console.error("Error rejecting faculty:", error);
  }
};

 const handleDelete = async (id) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${API_URL}/api/admin/delete-request/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to delete request");

    setSuccessMessage("✓ Request deleted successfully!");
    setShowDeleteConfirm(null);
    setDeleteType("");
    setTimeout(() => setSuccessMessage(""), 3000);
    fetchRequests();
  } catch (error) {
    console.error("Error deleting request:", error);
  }
};
 const handleDeleteFaculty = async (id) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${API_URL}/api/admin/delete-faculty/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to delete faculty");

    setSuccessMessage("✓ Faculty deleted successfully!");
    setShowDeleteConfirm(null);
    setDeleteType("");
    setTimeout(() => setSuccessMessage(""), 3000);
    fetchRequests();
  } catch (error) {
    console.error("Error deleting faculty:", error);
  }
};

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFacultySearch(value);
  };

  const filteredHistory = filter === "all" ? history : history.filter((h) => h.status === filter);

  const filteredFaculties = allFaculties.filter((f) =>
    `${f.name} ${f.subject}`.toLowerCase().includes(facultySearch.toLowerCase())
  );

  return (
    <div className={`w-full min-h-screen pt-28 transition-colors duration-300 ${
      isDarkMode
        ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">Admin Dashboard</h1>
          <p className={isDarkMode ? "text-white/60 text-lg" : "text-black/60 text-lg"}>
            Manage faculty requests and approvals
          </p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-xl flex items-center gap-3 border bg-green-500/20 border-green-500/40 text-green-300"
          >
            <span className="text-xl">✓</span>
            <span>{successMessage}</span>
          </motion.div>
        )}

        {/* Tabs */}
        <div className={`flex gap-3 mb-8 pb-4 border-b transition-colors duration-300 ${
          isDarkMode ? "border-white/10" : "border-black/10"
        }`}>
          <button
            onClick={() => {
              setActiveTab("pending");
              setFilter("all");
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "pending"
                ? isDarkMode
                  ? "bg-white/20 border border-white/30 text-white shadow-lg"
                  : "bg-black/20 border border-black/30 text-black shadow-lg"
                : isDarkMode
                ? "bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/15"
                : "bg-black/10 border border-black/20 text-black/70 hover:text-black hover:bg-black/15"
            }`}
          >
            Pending ({pendingRequests.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("history");
              setFilter("all");
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "history"
                ? isDarkMode
                  ? "bg-white/20 border border-white/30 text-white shadow-lg"
                  : "bg-black/20 border border-black/30 text-black shadow-lg"
                : isDarkMode
                ? "bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/15"
                : "bg-black/10 border border-black/20 text-black/70 hover:text-black hover:bg-black/15"
            }`}
          >
            History
          </button>
          <button
            onClick={() => {
              setActiveTab("faculties");
              setFilter("all");
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "faculties"
                ? isDarkMode
                  ? "bg-white/20 border border-white/30 text-white shadow-lg"
                  : "bg-black/20 border border-black/30 text-black shadow-lg"
                : isDarkMode
                ? "bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/15"
                : "bg-black/10 border border-black/20 text-black/70 hover:text-black hover:bg-black/15"
            }`}
          >
            All Faculties ({allFaculties.length})
          </button>
        </div>

        {/* Pending Tab */}
        {activeTab === "pending" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {loading ? (
              <div className={`text-center py-12 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                <div className="animate-spin inline-block">⏳</div>
                <p className="mt-3">Loading requests...</p>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className={`text-center py-16 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                <svg className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-white/30" : "text-black/30"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request, idx) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className={`border rounded-xl p-5 transition-all ${
                      isDarkMode
                        ? "border-white/20 bg-gradient-to-br from-white/10 to-white/5 hover:bg-white/15"
                        : "border-black/10 bg-gradient-to-br from-black/5 to-black/0 hover:bg-black/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{request.name}</h3>
                        <p className={`text-sm mt-1 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                          Course: {request.course}
                        </p>
                        <p className={`text-xs mt-2 ${isDarkMode ? "text-white/50" : "text-black/50"}`}>
                          Requested by: <span className={isDarkMode ? "text-white/70 font-medium" : "text-black/70 font-medium"}>{request.requestedBy?.name}</span>
                        </p>
                      </div>
                      <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-3 py-1 rounded-full text-xs font-semibold">
                        PENDING
                      </span>
                    </div>

                    {showRejectForm === request._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={`p-4 rounded-lg mb-4 border ${
                          isDarkMode
                            ? "bg-white/5 border-red-500/20"
                            : "bg-black/5 border-red-500/20"
                        }`}
                      >
                        <label className="block text-sm font-semibold mb-2">Rejection Reason</label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Why are you rejecting this request?"
                          className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 border ${
                            isDarkMode
                              ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40"
                              : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40"
                          }`}
                          rows="3"
                        />
                      </motion.div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleApprove(request._id)}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-300 py-2 px-4 rounded-lg transition-all font-semibold text-sm"
                      >
                        ✓ Approve
                      </button>

                      {showRejectForm === request._id ? (
                        <>
                          <button
                            onClick={() => handleReject(request._id)}
                            className="flex-1 bg-red-600/30 hover:bg-red-600/40 border border-red-500/60 text-red-300 py-2 px-4 rounded-lg transition-all font-semibold text-sm"
                          >
                            Confirm Reject
                          </button>
                          <button
                            onClick={() => {
                              setShowRejectForm(null);
                              setRejectionReason("");
                            }}
                            className={`flex-1 border py-2 px-4 rounded-lg transition-all font-semibold text-sm ${
                              isDarkMode
                                ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                                : "bg-black/10 hover:bg-black/20 border-black/20 text-black"
                            }`}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setShowRejectForm(request._id)}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 py-2 px-4 rounded-lg transition-all font-semibold text-sm"
                          >
                            ✕ Reject
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(request._id);
                              setDeleteType("request");
                            }}
                            className={`flex-1 border py-2 px-4 rounded-lg transition-all font-semibold text-sm ${
                              isDarkMode
                                ? "bg-white/10 hover:bg-white/20 border-white/20 text-white/70 hover:text-white"
                                : "bg-black/10 hover:bg-black/20 border-black/20 text-black/70 hover:text-black"
                            }`}
                          >
                            🗑 Delete
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="mb-6 flex gap-2">
              {["all", "approved", "rejected"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    filter === f
                      ? isDarkMode
                        ? "bg-white/20 border border-white/30 text-white"
                        : "bg-black/20 border border-black/30 text-black"
                      : isDarkMode
                      ? "bg-white/10 border border-white/20 text-white/70 hover:bg-white/15"
                      : "bg-black/10 border border-black/20 text-black/70 hover:bg-black/15"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {loading ? (
              <div className={`text-center py-12 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                <div className="animate-spin inline-block">⏳</div>
                <p className="mt-3">Loading history...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className={`text-center py-16 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                <svg className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-white/30" : "text-black/30"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">No history found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((request, idx) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className={`border rounded-xl p-5 transition-all ${
                      isDarkMode
                        ? "border-white/20 bg-white/5 hover:bg-white/10"
                        : "border-black/10 bg-black/5 hover:bg-black/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{request.name}</h3>
                        <p className={`text-sm mt-1 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                          Course: {request.course}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          request.status === "approved"
                            ? "bg-green-500/20 text-green-300 border-green-500/40"
                            : "bg-red-500/20 text-red-300 border-red-500/40"
                        }`}
                      >
                        {request.status.toUpperCase()}
                      </span>
                    </div>

                    <div className={`grid grid-cols-2 gap-4 text-sm mb-3 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                      <div>
                        <p className={isDarkMode ? "text-white/50" : "text-black/50"}>Requested by</p>
                        <p className={isDarkMode ? "text-white font-medium" : "text-black font-medium"}>{request.requestedBy?.name}</p>
                      </div>
                      <div>
                        <p className={isDarkMode ? "text-white/50" : "text-black/50"}>{request.status === "approved" ? "Approved" : "Rejected"} by</p>
                        <p className={isDarkMode ? "text-white font-medium" : "text-black font-medium"}>{request.approvedBy?.name || "—"}</p>
                      </div>
                    </div>

                    {request.status === "rejected" && request.rejectionReason && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-300/80 mb-3">
                        <p className="font-semibold text-red-300 mb-1">Rejection Reason:</p>
                        <p>{request.rejectionReason}</p>
                      </div>
                    )}

                    <p className={`text-xs ${isDarkMode ? "text-white/40" : "text-black/40"}`}>
                      {request.status === "approved" ? "Approved" : "Rejected"} on:{" "}
                      {new Date(request.approvedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Faculties Tab */}
        {activeTab === "faculties" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="mb-6 relative">
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
                onChange={handleSearchChange}
                placeholder="Search faculty by name or course..."
                className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  isDarkMode
                    ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40"
                    : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40"
                }`}
              />
              {facultySearch && (
                <button
                  onClick={() => setFacultySearch("")}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>

            {loading ? (
              <div className={`text-center py-12 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                <div className="animate-spin inline-block">⏳</div>
                <p className="mt-3">Loading faculties...</p>
              </div>
            ) : filteredFaculties.length === 0 ? (
              <div className={`text-center py-16 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                <svg className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-white/30" : "text-black/30"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-lg">{facultySearch ? "No faculties found" : "No faculties in the system"}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaculties.map((faculty, idx) => (
                  <motion.div
                    key={faculty._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className={`border rounded-xl p-5 transition-all ${
                      isDarkMode
                        ? "border-white/20 bg-gradient-to-br from-white/10 to-white/5 hover:bg-white/15"
                        : "border-black/10 bg-gradient-to-br from-black/5 to-black/0 hover:bg-black/10"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{faculty.name}</h3>
                        <p className={`text-sm mt-1 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                          Course: {faculty.subject}
                        </p>
                        <p className={`text-xs mt-2 ${isDarkMode ? "text-white/50" : "text-black/50"}`}>
                          Reviews: <span className={isDarkMode ? "text-white/70 font-medium" : "text-black/70 font-medium"}>{faculty.reviews?.length || 0}</span>
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          faculty.status === "approved"
                            ? "bg-green-500/20 text-green-300 border-green-500/40"
                            : "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                        }`}
                      >
                        {faculty.status?.toUpperCase() || "APPROVED"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(faculty._id);
                          setDeleteType("faculty");
                        }}
                        className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 py-2 px-4 rounded-lg transition-all font-semibold text-sm"
                      >
                        🗑 Delete Faculty
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
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

            <h2 className="text-xl font-bold text-center mb-2">Are you sure?</h2>
            <p className={`text-center mb-6 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
              {deleteType === "request"
                ? "This pending request will be permanently deleted."
                : "This faculty and all its reviews will be permanently deleted."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(null);
                  setDeleteType("");
                }}
                className={`flex-1 border py-2 px-4 rounded-lg transition-all font-semibold ${
                  isDarkMode
                    ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                    : "bg-black/10 hover:bg-black/20 border-black/20 text-black"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteType === "request") {
                    handleDelete(showDeleteConfirm);
                  } else {
                    handleDeleteFaculty(showDeleteConfirm);
                  }
                }}
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
