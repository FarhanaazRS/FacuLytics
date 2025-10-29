const express = require("express");
const {
  getPendingRequests,
  getRequestDetails,
  approveFaculty,
  rejectFaculty,
  getRequestHistory,
  deleteFacultyRequest,
  deleteApprovedFaculty,
  deleteReview,
} = require("../controllers/adminController");
const auth = require("../middleware/auth");
const { verifyAdmin } = require("../middleware/adminAuth");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth);
router.use(verifyAdmin);

// Get all pending requests
router.get("/pending-requests", getPendingRequests);

// Get request details with linked reviews
router.get("/request/:id", getRequestDetails);

// Approve faculty request
router.post("/approve-faculty/:id", approveFaculty);

// Reject faculty request
router.post("/reject-faculty/:id", rejectFaculty);

// Delete faculty request (pending)
router.delete("/delete-request/:id", deleteFacultyRequest);

// Delete approved faculty
router.delete("/faculty/:id", deleteApprovedFaculty);

// Get approval history
router.get("/history", getRequestHistory);

// Delete review
router.delete("/review/:reviewId", deleteReview);

module.exports = router;