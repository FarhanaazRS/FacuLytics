const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");
const { verifyAdmin } = require("../middleware/adminAuth");

// Create a new review (requires authentication)
router.post("/reviews", auth, reviewController.createReview);

// Get all reviews
router.get("/reviews", reviewController.getAllReviews);

// Get reviews for a specific faculty
router.get("/reviews/faculty/:facultyId", reviewController.getReviewsByFaculty);

// Update a review
router.put("/reviews/:id", auth, reviewController.updateReview);

// Delete a review (regular user)
router.delete("/reviews/:id", auth, reviewController.deleteReview);

// Delete a review (admin only)
router.delete("/admin/review/:id", auth, verifyAdmin, reviewController.deleteReview);

module.exports = router;