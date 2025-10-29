import React, { useState, useEffect, useMemo, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";

export default function HomePage() {
  const { isDarkMode } = useContext(ThemeContext);
  const [faculties, setFaculties] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    fetch(`${API_URL}/api/faculties`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        const facultiesArray = Array.isArray(data) ? data : (data.faculties || []);
        setFaculties(facultiesArray);
      })
      .catch((err) => console.error("Error fetching faculties:", err));
  }, []);

  const computeOverall = (f) => {
    if (!f.reviews || f.reviews.length === 0) return 0;
    const total = f.reviews.reduce(
      (sum, r) => sum + (Number(r.teaching || 0) + Number(r.marks || 0) + Number(r.quiz || 0)) / 3,
      0
    );
    return (total / f.reviews.length).toFixed(1);
  };

  const getAvatarStyle = (name) => {
    const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const avatarIndex = nameHash % 12;
    return avatarIndex;
  };

  const FacultyAvatar = ({ name }) => {
    const avatarIndex = getAvatarStyle(name);
    
    const gradients = [
      'from-purple-500/30 via-blue-500/30 to-cyan-500/30',
      'from-pink-500/30 via-rose-500/30 to-red-500/30',
      'from-blue-500/30 via-indigo-500/30 to-purple-500/30',
      'from-green-500/30 via-emerald-500/30 to-teal-500/30',
      'from-orange-500/30 via-amber-500/30 to-yellow-500/30',
      'from-cyan-500/30 via-sky-500/30 to-blue-500/30',
      'from-red-500/30 via-pink-500/30 to-purple-500/30',
      'from-yellow-500/30 via-orange-500/30 to-red-500/30',
      'from-teal-500/30 via-green-500/30 to-emerald-500/30',
      'from-indigo-500/30 via-purple-500/30 to-pink-500/30',
      'from-lime-500/30 via-green-500/30 to-teal-500/30',
      'from-fuchsia-500/30 via-purple-500/30 to-indigo-500/30',
    ];

    const innerGradients = [
      'from-purple-600/20 via-blue-600/20 to-cyan-600/20',
      'from-pink-600/20 via-rose-600/20 to-red-600/20',
      'from-blue-600/20 via-indigo-600/20 to-purple-600/20',
      'from-green-600/20 via-emerald-600/20 to-teal-600/20',
      'from-orange-600/20 via-amber-600/20 to-yellow-600/20',
      'from-cyan-600/20 via-sky-600/20 to-blue-600/20',
      'from-red-600/20 via-pink-600/20 to-purple-600/20',
      'from-yellow-600/20 via-orange-600/20 to-red-600/20',
      'from-teal-600/20 via-green-600/20 to-emerald-600/20',
      'from-indigo-600/20 via-purple-600/20 to-pink-600/20',
      'from-lime-600/20 via-green-600/20 to-teal-600/20',
      'from-fuchsia-600/20 via-purple-600/20 to-indigo-600/20',
    ];

    const faces = [
      <g key="face1">
        <circle cx="12" cy="10" r="7" fill="white" opacity="0.9"/>
        <circle cx="9.5" cy="9" r="0.8" fill="black"/>
        <circle cx="14.5" cy="9" r="0.8" fill="black"/>
        <path d="M 9 12 Q 12 14 15 12" stroke="black" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
        <ellipse cx="12" cy="6" rx="6" ry="4" fill="black" opacity="0.8"/>
      </g>,
      <g key="face2">
        <circle cx="12" cy="11" r="6.5" fill="white" opacity="0.9"/>
        <rect x="8" y="9.5" width="3" height="2.5" rx="0.5" fill="none" stroke="black" strokeWidth="0.6"/>
        <rect x="13" y="9.5" width="3" height="2.5" rx="0.5" fill="none" stroke="black" strokeWidth="0.6"/>
        <line x1="11" y1="10.7" x2="13" y2="10.7" stroke="black" strokeWidth="0.6"/>
        <path d="M 10 13.5 Q 12 15 14 13.5" stroke="black" strokeWidth="0.7" fill="none"/>
        <circle cx="12" cy="6.5" r="5.5" fill="black" opacity="0.7"/>
      </g>,
      <g key="face3">
        <circle cx="12" cy="11" r="6" fill="white" opacity="0.9"/>
        <circle cx="10" cy="10" r="0.7" fill="black"/>
        <circle cx="14" cy="10" r="0.7" fill="black"/>
        <path d="M 10 13 Q 12 14 14 13" stroke="black" strokeWidth="0.7" fill="none"/>
        <circle cx="9" cy="6" r="2" fill="black" opacity="0.8"/>
        <circle cx="12" cy="5" r="2.2" fill="black" opacity="0.8"/>
        <circle cx="15" cy="6" r="2" fill="black" opacity="0.8"/>
      </g>,
    ];

    return (
      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${gradients[avatarIndex]} border-2 flex items-center justify-center overflow-hidden shadow-lg relative ${
        isDarkMode ? "border-white/30" : "border-black/20"
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${innerGradients[avatarIndex]} backdrop-blur-sm`}></div>
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 24 24">
            {faces[avatarIndex % faces.length]}
          </svg>
        </div>
      </div>
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = faculties.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.subject && f.subject.toLowerCase().includes(q))
    );
    arr = arr.slice().sort((a, b) => computeOverall(b) - computeOverall(a));
    return arr;
  }, [faculties, query]);

  const title = "FacuLytics";
  const letterVariants = {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  };

  const featureBoxes = [
    {
      id: "planner",
      title: "Planner",
      description: "Organize your academic schedule and manage your courses",
      link: "/planner",
      image: "/images/planner.jpg",
    },
    {
      id: "scheduler",
      title: "Scheduler",
      description: "View and manage your class timetable effortlessly",
      link: "/scheduler",
      image: "/images/scheduler.jpg",
    },
    {
      id: "review",
      title: "Add Review",
      description: "Share your feedback and rate your faculty members",
      link: "/add-review",
      image: "/images/review1.jpg",
    },
    {
      id: "slotswap",
      title: "SlotSwap",
      description: "Exchange class slots with your peers easily",
      link: "/slotswap",
      image: "/images/swap1.jpg",
    },
  ];

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${
      isDarkMode
        ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black"
    }`}>
      {/* Title & Tagline */}
      <section className="w-full flex flex-col items-center text-center px-4 pt-4 sm:pt-6 md:pt-8 pb-8">
        <motion.h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {title.split("").map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Feature Boxes Section */}
        <div className="w-full max-w-6xl mx-auto px-4 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featureBoxes.map((box, index) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <motion.div
                  onClick={() => navigate(box.link)}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className={`h-full w-full rounded-2xl overflow-hidden cursor-pointer shadow-xl transition-all duration-300 border ${
                    isDarkMode
                      ? "bg-white/10 hover:bg-white/15 border-white/20 hover:border-white/40"
                      : "bg-black/5 hover:bg-black/10 border-black/10 hover:border-black/30"
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    <img
                      src={box.image}
                      alt={box.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Content Container */}
                  <div className="p-4 sm:p-5">
                    <h3
                      className={`text-lg sm:text-xl font-semibold mb-2 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {box.title}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isDarkMode ? "text-white/70" : "text-black/60"
                      }`}
                    >
                      {box.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl">
          <div className="relative">
            <svg 
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? "text-white/40" : "text-black/40"
              }`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Search faculty by name or subject..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-xl backdrop-blur-xl border transition-all shadow-2xl focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-white/40 focus:border-white/40"
                  : "bg-black/5 border-black/20 text-black placeholder-black/40 focus:ring-black/40 focus:border-black/40"
              }`}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-all ${
                  isDarkMode ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Faculty Cards Grid */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 pb-16">
        <div className="w-full max-w-7xl mx-auto grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((f) => {
              return (
                <motion.div
                  key={f._id ?? f.name}
                  className="w-full"
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className={`w-full backdrop-blur-2xl border rounded-2xl p-6 shadow-2xl transition-all duration-500 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/30 hover:shadow-white/10"
                      : "bg-gradient-to-br from-black/5 to-black/0 border-black/10 hover:border-black/20 hover:shadow-black/5"
                  }`}>
                    {/* Faculty Avatar */}
                    <div className="flex justify-center mb-6">
                      {f.image ? (
                        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex items-center justify-center overflow-hidden shadow-lg ${
                          isDarkMode ? "border-white/30" : "border-black/20"
                        }`}>
                          <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <FacultyAvatar name={f.name} />
                      )}
                    </div>

                    <h3 className={`text-lg sm:text-xl font-semibold text-center mb-2 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}>
                      {f.name}
                    </h3>
                    {f.subject && (
                      <p className={`text-sm text-center mb-4 ${
                        isDarkMode ? "text-white/60" : "text-black/60"
                      }`}>{f.subject}</p>
                    )}

                    <div className="flex items-center justify-center gap-2 mb-6">
                      <svg className={`w-5 h-5 fill-current ${isDarkMode ? "text-white" : "text-yellow-500"}`} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                        {computeOverall(f)}
                      </span>
                      <span className={`text-sm ${isDarkMode ? "text-white/60" : "text-black/60"}`}>/ 5.0</span>
                    </div>

                    <Link
                      to={`/faculty/${f._id}`}
                      className={`block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border ${
                        isDarkMode
                          ? "bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/40 text-white"
                          : "bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/30 text-black"
                      }`}
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className={`col-span-full text-center py-12 ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
              <svg className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-white/30" : "text-black/30"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg">No faculties found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
