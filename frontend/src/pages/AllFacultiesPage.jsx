import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FacuContext, ThemeContext } from "../App";
import { motion } from "framer-motion";

export default function AllFacultiesPage() {
  const { faculties, computeOverall } = useContext(FacuContext);
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`py-20 px-6 sm:px-10 lg:px-16 transition-colors duration-300 ${
      isDarkMode
        ? "bg-black text-white"
        : "bg-white text-black"
    }`}>
      <h2 className="text-3xl font-bold text-center mb-12">Our Faculties</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {faculties.map((faculty, idx) => (
          <motion.div
            key={idx}
            className={`backdrop-blur-lg border rounded-2xl p-6 text-center shadow-lg transition-all duration-300 ${
              isDarkMode
                ? "bg-white/10 border-white/20 hover:border-white/40 hover:shadow-white/10"
                : "bg-black/5 border-black/10 hover:border-black/20 hover:shadow-black/5"
            }`}
            whileHover={{ y: -5, scale: 1.05 }}
          >
            <div className="flex flex-col items-center">
              <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center overflow-hidden mb-4 ${
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
                  <span className={`text-3xl font-bold ${
                    isDarkMode ? "text-white/70" : "text-black/70"
                  }`}>
                    {faculty.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-semibold">{faculty.name}</h3>
              <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {faculty.subject}
              </p>
              <p className={`font-semibold mb-4 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                ⭐ {computeOverall(faculty)} / 5.0
              </p>

              <Link
                to={`/faculty/${faculty.id}`}
                className={`inline-block px-4 py-2 rounded-lg text-sm border transition-all ${
                  isDarkMode
                    ? "bg-white/20 hover:bg-white/30 border-white/30 text-white"
                    : "bg-black/10 hover:bg-black/20 border-black/20 text-black"
                }`}
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}