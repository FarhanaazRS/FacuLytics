import React, { createContext, useState, useMemo, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import FacultyDetailsPage from "./pages/FacultyDetailsPage";
import PlannerPage from "./pages/PlannerPage";
import AddReviewPage from "./pages/AddReviewPage";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";
import SlotSwapPage from "./pages/SlotSwapPage";
import SchedulerPage from "./pages/SchedulerPage";

export const FacuContext = createContext();
export const ThemeContext = createContext();

// ✅ Initialize Google Analytics once
const TRACKING_ID = "G-B72JHQG54L";
ReactGA.initialize(TRACKING_ID);

const ProtectedRoute = ({ children, user }) => {
  return user ? children : <Navigate to="/auth" replace />;
};

const App = () => {
  const [faculties, setFaculties] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  const location = useLocation();

  // ✅ Send pageview on every route change
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  useEffect(() => {
    fetchFaculties();
    setIsLoading(false);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const fetchFaculties = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/faculties`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setFaculties(data);
      } else if (data && typeof data === "object" && data.faculties && Array.isArray(data.faculties)) {
        setFaculties(data.faculties);
      } else {
        console.error("Invalid faculties format:", data);
        setFaculties([]);
      }
    } catch (err) {
      console.error("Error fetching faculties:", err);
      setFaculties([]);
    }
  };

  const computeOverall = (faculty) => {
    if (!faculty || !faculty.reviews || faculty.reviews.length === 0) return 0;
    const total =
      faculty.reviews.reduce(
        (sum, r) =>
          sum + Number(r.teaching || 0) + Number(r.marks || 0) + Number(r.quiz || 0),
        0
      ) /
      (faculty.reviews.length * 3);
    return total.toFixed(2);
  };

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  const contextValue = useMemo(
    () => ({
      faculties,
      setFaculties,
      computeOverall,
      user,
      setUser,
      handleLogout,
      handleLogin,
      token,
    }),
    [faculties, user, token]
  );

  const themeValue = useMemo(
    () => ({ isDarkMode, toggleTheme }),
    [isDarkMode]
  );

  if (isLoading) {
    return (
      <div
        className={`min-h-screen w-full flex items-center justify-center ${
          isDarkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      <FacuContext.Provider value={contextValue}>
        <div
          className={`min-h-screen w-full flex flex-col overflow-x-hidden transition-colors duration-300 ${
            isDarkMode ? "bg-black text-white" : "bg-white text-black"
          }`}
          style={{ fontFamily: "'Times New Roman', serif" }}
        >
          {user && <Navbar />}
          <main className={`flex-grow w-full ${user ? "pt-20" : ""}`}>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute user={user}>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faculty/:id"
                element={
                  <ProtectedRoute user={user}>
                    <FacultyDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/planner"
                element={
                  <ProtectedRoute user={user}>
                    <PlannerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scheduler"
                element={
                  <ProtectedRoute user={user}>
                    <SchedulerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-review"
                element={
                  <ProtectedRoute user={user}>
                    <AddReviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute user={user}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/slotswap"
                element={
                  <ProtectedRoute user={user}>
                    <SlotSwapPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          </main>
          {user && <Footer />}
        </div>
      </FacuContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
