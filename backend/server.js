require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// ✅ IMPORT MODELS FIRST (order matters!)
require("./models/Review");
require("./models/Faculty");
require("./models/User");
require("./models/FacultyRequest");
require("./models/SwapRequest");
require("./models/Schedule");

const facultyRoutes = require("./routes/facultyRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const slotSwapRoutes = require("./routes/slotSwapRoutes");
const schedulerRoutes = require("./routes/schedulerRoutes"); // ✅ ADD THIS - Import Scheduler routes

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ✅ MOUNT ROUTES
app.use("/api", facultyRoutes);
app.use("/api", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", slotSwapRoutes);
app.use("/api", schedulerRoutes); // ✅ ADD THIS - Mount Scheduler routes

// Health check
app.get("/", (req, res) => {
  res.json({ message: "FacuLytics API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));