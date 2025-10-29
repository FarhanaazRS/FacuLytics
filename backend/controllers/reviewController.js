const Review = require("../models/Review");
const Faculty = require("../models/Faculty");
const FacultyRequest = require("../models/FacultyRequest");

exports.createReview = async (req, res) => {
  try {
    const { facultyId, teaching, marks, quiz, feedback, isNewFaculty, facultyName, courseName } = req.body;
    const userId = req.user.id;

    // Validation
    if (!teaching || !marks || !quiz) {
      return res.status(400).json({ error: "Teaching, marks, and quiz ratings are required" });
    }

    let actualFacultyId = facultyId;

    // If new faculty, create it with pending status
    if (isNewFaculty && facultyName && courseName) {
      // Check if faculty already exists
      const existingFaculty = await Faculty.findOne({
        name: facultyName,
        subject: courseName,
      });

      if (existingFaculty) {
        actualFacultyId = existingFaculty._id;
      } else {
        // Create new faculty with pending status
        const newFaculty = new Faculty({
          name: facultyName,
          subject: courseName,
          status: "pending",
        });
        await newFaculty.save();
        actualFacultyId = newFaculty._id;

        // Also create faculty request
        const facultyRequest = new FacultyRequest({
          name: facultyName,
          course: courseName,
          requestedBy: userId,
          status: "pending",
        });
        await facultyRequest.save();
      }
    }

    if (!actualFacultyId) {
      return res.status(400).json({ error: "Faculty ID is required" });
    }

    // Create review with correct field name 'faculty'
    const review = new Review({
      faculty: actualFacultyId,
      userId,
      teaching: Number(teaching),
      marks: Number(marks),
      quiz: Number(quiz),
      comment: feedback || "",
    });

    await review.save();

    // Update faculty's reviews array
    await Faculty.findByIdAndUpdate(
      actualFacultyId,
      { $push: { reviews: review._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("facultyId")
      .populate("userId", "username email");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviewsByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const reviews = await Review.find({ facultyId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { teaching, marks, quiz, comment } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { teaching, marks, quiz, comment },
      { new: true }
    ).populate("facultyId");

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({
      success: true,
      message: "Review updated",
      data: review,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ 
        success: false,
        error: "Review not found" 
      });
    }
    await Faculty.findByIdAndUpdate(
      review.faculty,
      { $pull: { reviews: id } },
      { new: true }
    );

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};