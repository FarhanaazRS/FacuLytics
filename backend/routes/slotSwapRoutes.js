const express = require("express");
const router = express.Router();
const slotSwapController = require("../controllers/slotSwapController");
const auth = require("../middleware/auth");

// Create a new swap request (requires authentication)
router.post("/swap-requests", auth, slotSwapController.createSwapRequest);

// Get all open swap requests (with optional filtering)
router.get("/swap-requests", slotSwapController.getAllSwapRequests);

// Get user's own swap requests
router.get("/swap-requests/my-requests", auth, slotSwapController.getMySwapRequests);

// Get user's matches
router.get("/swap-requests/my-matches", auth, slotSwapController.getMyMatches);

// Find matches for a specific request
router.get("/swap-requests/:requestId/matches", slotSwapController.findMatches);

// Confirm swap and share phone number
router.post("/swap-requests/confirm-swap", auth, slotSwapController.confirmSwap);

// Mark swap as completed
router.put("/swap-requests/:requestId/complete", auth, slotSwapController.completeSwap);

// Get matched student's phone number
router.get("/swap-requests/:requestId/matched-contact", auth, slotSwapController.getMatchedStudentPhone);

// Delete swap request
router.delete("/swap-requests/:requestId", auth, slotSwapController.deleteSwapRequest);

module.exports = router;