// seedAdmin.js
const mongoose = require("mongoose");
const User = require("./models/User"); // adjust path if needed
require("dotenv").config();

const ADMIN_EMAIL = "farhanaaz.rs2022@vitstudent.ac.in"; // change this

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.findOne({ email: ADMIN_EMAIL });

    if (!user) {
      console.log(`❌ No user found with email: ${ADMIN_EMAIL}`);
      process.exit(0);
    }

    user.role = "admin";
    await user.save();

    console.log(`✅ Admin role assigned to: ${ADMIN_EMAIL}`);
    process.exit(0);
  } catch (error) {
    console.error("Error running seed:", error);
    process.exit(1);
  }
}

seedAdmin();
