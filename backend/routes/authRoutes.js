const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes
router.get("/profile", auth, authController.getProfile);
router.post("/selected-faculties", auth, authController.updateSelectedFaculties);

module.exports = router;