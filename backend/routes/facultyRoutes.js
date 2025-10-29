const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const auth = require("../middleware/auth");

// ✅ Get all faculties (with populated reviews)
router.get("/faculties", facultyController.getAllFaculties);

// ✅ Get a single faculty by ID (with populated reviews)
router.get("/faculty/:id", facultyController.getFacultyById);

// ✅ Request new faculty (requires authentication)
router.post("/faculties/request", auth, facultyController.requestNewFaculty);

// ✅ Other existing endpoints
router.post("/faculty/select", facultyController.toggleFacultySelection);
router.post("/compare", facultyController.compareFaculties);
router.post("/analytics", facultyController.analytics);

module.exports = router;