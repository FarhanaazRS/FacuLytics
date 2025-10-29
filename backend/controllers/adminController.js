const FacultyRequest = require("../models/FacultyRequest");
const Faculty = require("../models/Faculty");
const Review = require("../models/Review");

// Get all pending faculty requests
const getPendingRequests = async (req, res) => {
  try {
    const requests = await FacultyRequest.find({ status: "pending" })
      .populate("requestedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending requests",
      error: error.message,
    });
  }
};

// Get request details with linked reviews
const getRequestDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await FacultyRequest.findById(id)
      .populate("requestedBy", "name email")
      .populate("approvedBy", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Get reviews for this pending faculty (if it was created)
    const faculty = await Faculty.findOne({
      name: request.name,
      department: request.department,
    });

    let reviews = [];
    if (faculty) {
      reviews = await Review.find({ faculty: faculty._id })
        .populate("userId", "name");
    }

    res.json({
      success: true,
      data: {
        request,
        linkedReviews: reviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching request details",
      error: error.message,
    });
  }
};

// Approve faculty request
const approveFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const request = await FacultyRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    // Check if faculty already exists
    let faculty = await Faculty.findOne({
      name: request.name,
      subject: request.course,
    });

    if (!faculty) {
      // Create new faculty
      faculty = new Faculty({
        name: request.name,
        subject: request.course,
        status: "approved",
      });
      await faculty.save();
    } else if (faculty.status === "pending") {
      // Update existing pending faculty to approved
      faculty.status = "approved";
      await faculty.save();
    }

    // Update request status
    request.status = "approved";
    request.approvedBy = adminId;
    request.approvedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: "Faculty approved successfully",
      data: {
        request,
        faculty,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving faculty",
      error: error.message,
    });
  }
};

// Reject faculty request
const rejectFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    const request = await FacultyRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    // Find and delete associated faculty if it exists and is pending
    const faculty = await Faculty.findOneAndDelete({
      name: request.name,
      subject: request.course,
      status: "pending",
    });

    // Delete all reviews for this faculty
    if (faculty) {
      await Review.deleteMany({ faculty: faculty._id });
    }

    // Update request status
    request.status = "rejected";
    request.rejectionReason = reason || "No reason provided";
    request.approvedBy = adminId;
    request.approvedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: "Faculty request rejected",
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error rejecting faculty",
      error: error.message,
    });
  }
};

// Get request history (approved/rejected)
const getRequestHistory = async (req, res) => {
  try {
    const requests = await FacultyRequest.find({
      status: { $in: ["approved", "rejected"] },
    })
      .populate("requestedBy", "name email")
      .populate("approvedBy", "name email")
      .sort({ approvedAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching history",
      error: error.message,
    });
  }
};

// Delete faculty request
const deleteFacultyRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await FacultyRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Also delete the pending faculty if it exists
    const faculty = await Faculty.findOneAndDelete({
      name: request.name,
      status: "pending",
    });

    // Delete all reviews for this pending faculty
    if (faculty) {
      await Review.deleteMany({ faculty: faculty._id });
    }

    res.json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting request",
      error: error.message,
    });
  }
};

// NEW: Delete an approved faculty
const deleteApprovedFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await Faculty.findByIdAndDelete(id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    // Delete all reviews for this faculty
    await Review.deleteMany({ faculty: faculty._id });

    res.json({
      success: true,
      message: "Faculty deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting faculty",
      error: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};

module.exports = {
  getPendingRequests,
  getRequestDetails,
  approveFaculty,
  rejectFaculty,
  getRequestHistory,
  deleteFacultyRequest,
  deleteApprovedFaculty,
  deleteReview,
};