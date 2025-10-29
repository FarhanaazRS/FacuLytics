import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../App";
import CreateSwapForm from "../components/CreateSwapForm";
import SwapRequestCard from "../components/SwapRequestCard";
import MatchesFound from "../components/MatchesFound";
import * as slotSwapApi from "../services/slotSwapApi";

export default function SlotSwapPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("all-requests");
  const [myRequests, setMyRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [myMatches, setMyMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCourse, setFilterCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  // Fetch all requests
  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const data = await slotSwapApi.getAllSwapRequests(filterCourse, "open");
      setAllRequests(Array.isArray(data) ? data : data.swapRequests || []);
      
      // Extract unique courses
      const uniqueCourses = [...new Set(data.map((r) => r.courseCode))];
      setCourses(uniqueCourses);
      setError("");
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's requests
  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const data = await slotSwapApi.getMySwapRequests();
      setMyRequests(Array.isArray(data) ? data : data.swapRequests || []);
      setError("");
    } catch (err) {
      console.error("Error fetching my requests:", err);
      setError("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's matches
  const fetchMyMatches = async () => {
    setLoading(true);
    try {
      const data = await slotSwapApi.getMyMatches();
      setMyMatches(Array.isArray(data?.matches) ? data.matches : []);
      setError("");
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  // Initial load - no auto-refresh to prevent re-renders
  useEffect(() => {
    fetchAllRequests();
    fetchMyRequests();
    fetchMyMatches();
  }, []);

  // Refetch when filter changes
  useEffect(() => {
    if (activeTab === "all-requests") {
      fetchAllRequests();
    }
  }, [filterCourse]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "my-requests") {
      fetchMyRequests();
    } else if (tab === "matches") {
      fetchMyMatches();
    } else {
      fetchAllRequests();
    }
  };

  const handleSwapCreated = () => {
    fetchMyRequests();
    fetchAllRequests();
    fetchMyMatches();
  };

  const handleSwapDeleted = () => {
    fetchMyRequests();
    fetchAllRequests();
    fetchMyMatches();
  };

  const handleSwapConfirmed = () => {
    fetchMyRequests();
    fetchAllRequests();
    fetchMyMatches();
  };

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold bg-clip-text text-transparent mb-2 bg-gradient-to-r ${
            isDarkMode
              ? "from-white to-white/60"
              : "from-black to-black/60"
          }`}>
            SlotSwap
          </h1>
          <p className={isDarkMode ? "text-white/60" : "text-black/60"}>
            Swap your course slots with other students instantly
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 border-b" style={{
          borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
        }}>
          {["all-requests", "my-requests", "matches", "create"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                activeTab === tab
                  ? isDarkMode
                    ? "text-white border-white"
                    : "text-black border-black"
                  : isDarkMode
                  ? "text-white/60 border-transparent hover:text-white"
                  : "text-black/60 border-transparent hover:text-black"
              }`}
            >
              {tab === "all-requests" && "Browse Requests"}
              {tab === "my-requests" && "My Requests"}
              {tab === "matches" && "Matches"}
              {tab === "create" && "Post a Request"}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg ${
            isDarkMode ? "bg-red-500/20 text-red-200" : "bg-red-50 text-red-800"
          }`}>
            {error}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "all-requests" && (
          <div>
            {/* Filter by Course */}
            <div className="mb-6">
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className={`w-full sm:w-64 px-4 py-3 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-white/5 border-white/20 text-white focus:ring-white/40 focus:border-white/40"
                    : "bg-black/5 border-black/20 text-black focus:ring-black/40 focus:border-black/40"
                }`}
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Requests Grid */}
            {loading ? (
              <div className={`text-center py-12 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                Loading swap requests...
              </div>
            ) : allRequests.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {allRequests.map((request) => (
                  <SwapRequestCard
                    key={request._id}
                    request={request}
                    onDeleted={handleSwapDeleted}
                    onConfirmed={handleSwapConfirmed}
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                No swap requests available right now
              </div>
            )}
          </div>
        )}

        {activeTab === "my-requests" && (
          <div>
            {loading ? (
              <div className={`text-center py-12 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                Loading your requests...
              </div>
            ) : myRequests.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {myRequests.map((request) => (
                  <SwapRequestCard
                    key={request._id}
                    request={request}
                    isOwn={true}
                    onDeleted={handleSwapDeleted}
                    onConfirmed={handleSwapConfirmed}
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                You haven't posted any swap requests yet
              </div>
            )}
          </div>
        )}

        {activeTab === "matches" && (
          <div>
            {loading ? (
              <div className={`text-center py-12 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                Loading your matches...
              </div>
            ) : myMatches.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {myMatches.map((match) => (
                  <MatchesFound
                    key={match._id}
                    match={match}
                    onConfirmed={handleSwapConfirmed}
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                No matches found yet. Post a request to find swaps!
              </div>
            )}
          </div>
        )}

        {activeTab === "create" && (
          <CreateSwapForm onSwapCreated={handleSwapCreated} />
        )}
      </div>
    </div>
  );
}
