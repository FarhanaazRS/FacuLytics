// backend/scripts/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const Faculty = require("../models/Faculty");
const Review = require("../models/Review");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Connection error:", err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Faculty.deleteMany({});
    await Review.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create sample faculties
    const faculties = await Faculty.insertMany([
      {
        name: "Dr. Rajesh Kumar",
        subject: "Data Structures",
        image: null,
        reviews: [],
      },
      {
        name: "Prof. Priya Sharma",
        subject: "Web Development",
        image: null,
        reviews: [],
      },
      {
        name: "Dr. Anil Patel",
        subject: "Machine Learning",
        image: null,
        reviews: [],
      },
      {
        name: "Ms. Anjali Singh",
        subject: "Database Management",
        image: null,
        reviews: [],
      },
      {
        name: "Prof. Vikram Desai",
        subject: "Algorithms",
        image: null,
        reviews: [],
      },
    ]);
    console.log("✅ Created 5 faculties");

    // Create sample reviews
    const reviews = await Review.insertMany([
      {
        faculty: faculties[0]._id,
        teaching: 5,
        marks: 4,
        quiz: 4,
        comment: "Excellent teaching methodology, very clear explanations",
      },
      {
        faculty: faculties[0]._id,
        teaching: 4,
        marks: 5,
        quiz: 3,
        comment: "Great instructor, marks are fair",
      },
      {
        faculty: faculties[1]._id,
        teaching: 5,
        marks: 4,
        quiz: 5,
        comment: "Amazing web dev concepts, very practical",
      },
      {
        faculty: faculties[1]._id,
        teaching: 4,
        marks: 3,
        quiz: 4,
        comment: "Good teaching but assignments are tough",
      },
      {
        faculty: faculties[2]._id,
        teaching: 5,
        marks: 5,
        quiz: 5,
        comment: "Best ML professor, incredible insights",
      },
      {
        faculty: faculties[2]._id,
        teaching: 5,
        marks: 4,
        quiz: 5,
        comment: "Engaging lectures on neural networks",
      },
      {
        faculty: faculties[3]._id,
        teaching: 4,
        marks: 4,
        quiz: 4,
        comment: "Clear explanations on database concepts",
      },
      {
        faculty: faculties[4]._id,
        teaching: 5,
        marks: 5,
        quiz: 4,
        comment: "Brilliant at explaining complex algorithms",
      },
    ]);
    console.log("✅ Created 8 reviews");

    // Update faculties with review references
    await Faculty.findByIdAndUpdate(faculties[0]._id, {
      reviews: [reviews[0]._id, reviews[1]._id],
    });

    await Faculty.findByIdAndUpdate(faculties[1]._id, {
      reviews: [reviews[2]._id, reviews[3]._id],
    });

    await Faculty.findByIdAndUpdate(faculties[2]._id, {
      reviews: [reviews[4]._id, reviews[5]._id],
    });

    await Faculty.findByIdAndUpdate(faculties[3]._id, {
      reviews: [reviews[6]._id],
    });

    await Faculty.findByIdAndUpdate(faculties[4]._id, {
      reviews: [reviews[7]._id],
    });

    console.log("✅ Linked reviews to faculties");
    console.log("\n🎉 Seed data created successfully!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

connectDB().then(seedData);