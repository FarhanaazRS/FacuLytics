const express = require("express");
const router = express.Router();
const schedulerController = require("../controllers/schedulerController");
const auth = require("../middleware/auth");

// Get user's schedule
router.get("/schedule", auth, schedulerController.getSchedule);

// Update single subject in schedule
router.post("/schedule/update-subject", auth, schedulerController.updateSubject);

// Save entire schedule (bulk update)
router.post("/schedule/save", auth, schedulerController.saveSchedule);

// Clear schedule
router.delete("/schedule/clear", auth, schedulerController.clearSchedule);

module.exports = router;