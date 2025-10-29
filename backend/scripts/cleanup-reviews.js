const mongoose = require("mongoose");
const Review = require("../models/Review");
const Faculty = require("../models/Faculty");

const cleanupReviews = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://farhanaaz:Farha%40321@faculytics-cluster.zt5vznt.mongodb.net/facultyreviews?appName=faculytics-cluster", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Find all reviews without comments (empty or undefined)
    const reviewsToDelete = await Review.find({
      $or: [
        { comment: { $exists: false } },
        { comment: null },
        { comment: "" },
      ],
    });

    console.log(`Found ${reviewsToDelete.length} reviews without comments`);

    if (reviewsToDelete.length === 0) {
      console.log("No reviews to delete");
      await mongoose.connection.close();
      return;
    }

    // Get review IDs
    const reviewIds = reviewsToDelete.map((r) => r._id);

    // Remove from Faculty documents
    await Faculty.updateMany(
      { reviews: { $in: reviewIds } },
      { $pull: { reviews: { $in: reviewIds } } }
    );

    console.log(`Removed reviews from faculty records`);

    // Delete the reviews
    const deleteResult = await Review.deleteMany({
      _id: { $in: reviewIds },
    });

    console.log(`Deleted ${deleteResult.deletedCount} reviews without comments`);

    // Show remaining reviews count
    const remainingCount = await Review.countDocuments();
    console.log(`Remaining reviews in database: ${remainingCount}`);

    await mongoose.connection.close();
    console.log("Cleanup completed and disconnected from MongoDB");
  } catch (err) {
    console.error("Error during cleanup:", err);
    process.exit(1);
  }
};

cleanupReviews();