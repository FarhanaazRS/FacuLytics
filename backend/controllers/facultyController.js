const Faculty = require("../models/Faculty");
const FacultyRequest = require("../models/FacultyRequest");

const computeOverall = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce(
    (sum, r) => sum + (Number(r.teaching || 0) + Number(r.marks || 0) + Number(r.quiz || 0)) / 3,
    0
  );
  return (total / reviews.length).toFixed(2);
};

const getDetailedMetrics = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return { teaching: 0, marks: 0, quiz: 0, overall: 0 };
  }

  const teaching = (reviews.reduce((sum, r) => sum + (r.teaching || 0), 0) / reviews.length).toFixed(2);
  const marks = (reviews.reduce((sum, r) => sum + (r.marks || 0), 0) / reviews.length).toFixed(2);
  const quiz = (reviews.reduce((sum, r) => sum + (r.quiz || 0), 0) / reviews.length).toFixed(2);
  const overall = computeOverall(reviews);

  return { teaching: parseFloat(teaching), marks: parseFloat(marks), quiz: parseFloat(quiz), overall: parseFloat(overall) };
};

exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find().populate("reviews");
    const result = faculties.map((fac) => ({
      ...fac.toObject(),
      metrics: getDetailedMetrics(fac.reviews),
    }));
    res.json(result);
  } catch (err) {
    console.error("Error fetching faculties:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findById(id).populate({
      path: "reviews",
      select: "_id teaching marks quiz comment createdAt updatedAt"
    });

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const result = {
      ...faculty.toObject(),
      metrics: getDetailedMetrics(faculty.reviews),
    };

    res.json(result);
  } catch (err) {
    console.error("Error fetching faculty:", err);
    res.status(500).json({ error: err.message });
  }
};

// NEW: Request new faculty (Name + Course only, with immediate review submission)
exports.requestNewFaculty = async (req, res) => {
  try {
    const { name, course } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validation
    if (!name || !course) {
      return res.status(400).json({ error: "Faculty name and course are required" });
    }

    // Check if faculty already exists (approved or pending)
    const existingFaculty = await Faculty.findOne({ name, subject: course });
    if (existingFaculty) {
      return res.status(400).json({ error: "Faculty already exists in the system" });
    }

    // Check if request already exists (pending)
    const existingRequest = await FacultyRequest.findOne({
      name,
      course,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({ error: "Faculty request already pending approval" });
    }

    // Create new faculty request
    const facultyRequest = new FacultyRequest({
      name,
      course,
      requestedBy: userId,
      status: "pending",
    });

    await facultyRequest.save();

    res.status(201).json({
      success: true,
      message: "Faculty request created. Now add your review!",
      data: {
        requestId: facultyRequest._id,
        name: facultyRequest.name,
        course: facultyRequest.course,
      },
    });
  } catch (err) {
    console.error("Error requesting faculty:", err);
    res.status(500).json({ error: err.message });
  }
};

// Toggle faculty selection
exports.toggleFacultySelection = async (req, res) => {
  try {
    const { facultyId, selected } = req.body;

    if (!facultyId || typeof selected !== "boolean") {
      return res.status(400).json({ error: "facultyId and selected flag are required" });
    }

    const faculty = await Faculty.findByIdAndUpdate(
      facultyId,
      { selected },
      { new: true }
    ).populate("reviews");

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    res.json({
      message: "Faculty selection updated",
      faculty: {
        ...faculty.toObject(),
        metrics: getDetailedMetrics(faculty.reviews),
      },
    });
  } catch (err) {
    console.error("Error updating selection:", err);
    res.status(500).json({ error: err.message });
  }
};

// Compare multiple faculties
exports.compareFaculties = async (req, res) => {
  try {
    const { facultyIds } = req.body;

    if (!Array.isArray(facultyIds) || facultyIds.length === 0) {
      return res.status(400).json({ error: "facultyIds must be a non-empty array" });
    }

    const faculties = await Faculty.find({ _id: { $in: facultyIds } }).populate("reviews");

    if (faculties.length === 0) {
      return res.status(404).json({ error: "No faculties found" });
    }

    const comparison = faculties.map((fac) => ({
      _id: fac._id,
      name: fac.name,
      subject: fac.subject,
      reviewCount: fac.reviews.length,
      metrics: getDetailedMetrics(fac.reviews),
      topReviews: fac.reviews.slice(0, 3),
    }));

    res.json(comparison);
  } catch (err) {
    console.error("Error comparing faculties:", err);
    res.status(500).json({ error: err.message });
  }
};

// Analytics for selected faculties
exports.analytics = async (req, res) => {
  try {
    const { facultyIds } = req.body;

    if (!Array.isArray(facultyIds) || facultyIds.length === 0) {
      return res.status(400).json({ error: "facultyIds must be a non-empty array" });
    }

    const faculties = await Faculty.find({ _id: { $in: facultyIds } }).populate("reviews");

    if (faculties.length === 0) {
      return res.status(404).json({ error: "No faculties found" });
    }

    // Calculate aggregate metrics
    const allReviews = faculties.flatMap((f) => f.reviews);
    const totalReviews = allReviews.length;

    if (totalReviews === 0) {
      return res.json({
        totalFacultiesSelected: faculties.length,
        totalReviewsAnalyzed: 0,
        aggregateMetrics: { teaching: 0, marks: 0, quiz: 0, overall: 0 },
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        facultyStats: faculties.map((fac) => ({
          _id: fac._id,
          name: fac.name,
          subject: fac.subject,
          reviewCount: 0,
          metrics: { teaching: 0, marks: 0, quiz: 0, overall: 0 },
        })),
      });
    }

    const avgTeaching = (allReviews.reduce((sum, r) => sum + (r.teaching || 0), 0) / totalReviews).toFixed(2);
    const avgMarks = (allReviews.reduce((sum, r) => sum + (r.marks || 0), 0) / totalReviews).toFixed(2);
    const avgQuiz = (allReviews.reduce((sum, r) => sum + (r.quiz || 0), 0) / totalReviews).toFixed(2);
    const avgOverall = ((parseFloat(avgTeaching) + parseFloat(avgMarks) + parseFloat(avgQuiz)) / 3).toFixed(2);

    // Rating distribution
    const ratingDistribution = {
      5: allReviews.filter((r) => (r.teaching + r.marks + r.quiz) / 3 >= 4.5).length,
      4: allReviews.filter((r) => (r.teaching + r.marks + r.quiz) / 3 >= 3.5 && (r.teaching + r.marks + r.quiz) / 3 < 4.5).length,
      3: allReviews.filter((r) => (r.teaching + r.marks + r.quiz) / 3 >= 2.5 && (r.teaching + r.marks + r.quiz) / 3 < 3.5).length,
      2: allReviews.filter((r) => (r.teaching + r.marks + r.quiz) / 3 >= 1.5 && (r.teaching + r.marks + r.quiz) / 3 < 2.5).length,
      1: allReviews.filter((r) => (r.teaching + r.marks + r.quiz) / 3 < 1.5).length,
    };

    const facultyStats = faculties.map((fac) => ({
      _id: fac._id,
      name: fac.name,
      subject: fac.subject,
      reviewCount: fac.reviews.length,
      metrics: getDetailedMetrics(fac.reviews),
    }));

    res.json({
      totalFacultiesSelected: faculties.length,
      totalReviewsAnalyzed: totalReviews,
      aggregateMetrics: {
        teaching: parseFloat(avgTeaching),
        marks: parseFloat(avgMarks),
        quiz: parseFloat(avgQuiz),
        overall: parseFloat(avgOverall),
      },
      ratingDistribution,
      facultyStats,
    });
  } catch (err) {
    console.error("Error analytics:", err);
    res.status(500).json({ error: err.message });
  }
};