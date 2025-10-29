const SwapRequest = require("../models/SwapRequest");
const User = require("../models/User");

// Create a new swap request
exports.createSwapRequest = async (req, res) => {
  try {
    const { courseCode, currentFaculty, currentSlot, desiredFaculty, desiredSlot, notes } = req.body;
    const studentId = req.user.id;

    console.log("🔵 CREATE SWAP REQUEST - studentId:", studentId);

    // Validation
    if (!courseCode || !currentFaculty || !currentSlot || !desiredFaculty || !desiredSlot) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Get user details for storing
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create swap request
    const swapRequest = new SwapRequest({
      studentId,
      courseCode,
      currentFaculty,
      currentSlot,
      desiredFaculty,
      desiredSlot,
      notes: notes || "",
      studentName: user.name,
      studentEmail: user.email,
    });

    await swapRequest.save();
    console.log("✅ SWAP REQUEST CREATED:", swapRequest._id);

    res.status(201).json({
      success: true,
      message: "Swap request created successfully",
      data: swapRequest,
    });
  } catch (err) {
    console.error("❌ Error creating swap request:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all open swap requests
exports.getAllSwapRequests = async (req, res) => {
  try {
    const { courseCode, status } = req.query;
    let filter = {};

    if (courseCode) filter.courseCode = courseCode;
    if (status) filter.status = status;

    const requests = await SwapRequest.find(filter)
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    console.log("📋 GET ALL SWAP REQUESTS - Found:", requests.length, "Status filter:", status);

    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching swap requests:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get user's own swap requests
exports.getMySwapRequests = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log("🔵 GET MY SWAP REQUESTS - studentId:", studentId);

    const requests = await SwapRequest.find({ studentId })
      .populate("matchedWith")
      .sort({ createdAt: -1 });

    console.log("📋 MY REQUESTS - Found:", requests.length);
    requests.forEach(r => {
      console.log(`  - ID: ${r._id}, Status: ${r.status}, MatchedWith: ${r.matchedWith}, Phone: ${r.studentPhone || "EMPTY"}`);
    });

    res.json(requests);
  } catch (err) {
    console.error("❌ Error fetching user swap requests:", err);
    res.status(500).json({ error: err.message });
  }
};

// Find matching swap requests (reciprocal matching)
exports.findMatches = async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log("🔵 FIND MATCHES - requestId:", requestId);

    // Get the swap request
    const request = await SwapRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Swap request not found" });
    }

    console.log("📍 REQUEST DETAILS:");
    console.log(`  Course: ${request.courseCode}, Desired: ${request.desiredFaculty}/${request.desiredSlot}`);
    console.log(`  Has: ${request.currentFaculty}/${request.currentSlot}`);

    // Find reciprocal matches
    const matches = await SwapRequest.find({
      _id: { $ne: requestId },
      courseCode: request.courseCode,
      status: "open",
      currentFaculty: request.desiredFaculty,
      currentSlot: request.desiredSlot,
      desiredFaculty: request.currentFaculty,
      desiredSlot: request.currentSlot,
    }).populate("studentId", "name email");

    console.log("✅ MATCHES FOUND:", matches.length);
    matches.forEach(m => {
      console.log(`  - ID: ${m._id}, Name: ${m.studentName}`);
    });

    res.json({
      success: true,
      totalMatches: matches.length,
      matches,
    });
  } catch (err) {
    console.error("❌ Error finding matches:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all matches for user
exports.getMyMatches = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log("🔵 GET MY MATCHES - studentId:", studentId);

    // Get all open requests by this user
    const userRequests = await SwapRequest.find({
      studentId,
      status: "open",
    });

    console.log("📍 USER OPEN REQUESTS:", userRequests.length);

    if (userRequests.length === 0) {
      console.log("⚠️ NO OPEN REQUESTS FOR THIS USER");
      return res.json({ success: true, totalMatches: 0, matches: [] });
    }

    // Find matches for each request
    const allMatches = [];
    for (const req of userRequests) {
      console.log(`\n🔍 CHECKING MATCHES FOR REQUEST: ${req._id}`);
      console.log(`  Looking for: ${req.desiredFaculty}/${req.desiredSlot} with Have: ${req.currentFaculty}/${req.currentSlot}`);

      const matches = await SwapRequest.find({
        _id: { $ne: req._id },
        courseCode: req.courseCode,
        status: "open",
        currentFaculty: req.desiredFaculty,
        currentSlot: req.desiredSlot,
        desiredFaculty: req.currentFaculty,
        desiredSlot: req.currentSlot,
      }).populate("studentId", "name email");

      console.log(`  Found: ${matches.length} matches`);
      allMatches.push(...matches.map(m => ({ ...m.toObject(), requestId: req._id })));
    }

    console.log("✅ TOTAL MATCHES:", allMatches.length);
    allMatches.forEach(m => {
      console.log(`  - Match ID: ${m._id}, Request ID: ${m.requestId}, Name: ${m.studentName}`);
    });

    res.json({
      success: true,
      totalMatches: allMatches.length,
      matches: allMatches,
    });
  } catch (err) {
    console.error("❌ Error getting user matches:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update swap request status and record contact details
exports.confirmSwap = async (req, res) => {
  try {
    const { requestId, matchedRequestId, phoneNumber, name, notes } = req.body;
    const studentId = req.user.id;

    console.log("🔴 CONFIRM SWAP STARTED");
    console.log(`  StudentID: ${studentId}`);
    console.log(`  RequestID: ${requestId} (student A)`);
    console.log(`  MatchedRequestID: ${matchedRequestId} (student B)`);
    console.log(`  Name: ${name}, Phone: ${phoneNumber}`);

    // Validation
    if (!phoneNumber) {
      console.log("❌ VALIDATION FAILED: No phone number");
      return res.status(400).json({ error: "Phone number is required" });
    }

    if (!name) {
      console.log("❌ VALIDATION FAILED: No name");
      return res.status(400).json({ error: "Name is required" });
    }

    // Verify ownership of request
    const request = await SwapRequest.findById(requestId);
    if (!request || request.studentId.toString() !== studentId.toString()) {
      console.log("❌ UNAUTHORIZED: Request doesn't belong to student");
      return res.status(403).json({ error: "Unauthorized" });
    }

    console.log("✅ REQUEST OWNERSHIP VERIFIED");

    // Get matched request
    const matchedRequest = await SwapRequest.findById(matchedRequestId);
    if (!matchedRequest) {
      console.log("❌ MATCHED REQUEST NOT FOUND:", matchedRequestId);
      return res.status(404).json({ error: "Matched request not found" });
    }

    console.log("✅ MATCHED REQUEST FOUND");
    console.log(`  Matched Student: ${matchedRequest.studentName} (${matchedRequest.studentEmail})`);

    // Update Student A's request
    console.log("\n📝 UPDATING STUDENT A'S REQUEST:");
    const updateA = {
      status: "matched",
      matchedWith: matchedRequestId,
      studentPhone: phoneNumber,
      studentContactName: name,
      bargainingNotes: notes || "",
    };
    console.log("  Data:", updateA);

    const updatedA = await SwapRequest.findByIdAndUpdate(requestId, updateA, { new: true });
    console.log("✅ STUDENT A UPDATED SUCCESSFULLY");
    console.log(`  - Phone: ${updatedA.studentPhone}`);
    console.log(`  - Name: ${updatedA.studentContactName}`);
    console.log(`  - MatchedWith: ${updatedA.matchedWith}`);

    // Update Student B's request - THIS IS CRITICAL
    console.log("\n📝 UPDATING STUDENT B'S REQUEST:");
    const updateB = {
      status: "matched",
      matchedWith: requestId,
      matchedStudentPhone: phoneNumber,
      matchedStudentName: name,
      matchedStudentEmail: request.studentEmail,
    };
    console.log("  Data:", updateB);

    const updatedB = await SwapRequest.findByIdAndUpdate(matchedRequestId, updateB, { new: true });
    console.log("✅ STUDENT B UPDATED SUCCESSFULLY");
    console.log(`  - MatchedPhone: ${updatedB.matchedStudentPhone}`);
    console.log(`  - MatchedName: ${updatedB.matchedStudentName}`);
    console.log(`  - MatchedEmail: ${updatedB.matchedStudentEmail}`);
    console.log(`  - MatchedWith: ${updatedB.matchedWith}`);

    // Verify the update
    console.log("\n🔍 VERIFICATION - FETCHING STUDENT B'S REQUEST AGAIN:");
    const verifyB = await SwapRequest.findById(matchedRequestId);
    console.log(`  - MatchedPhone in DB: ${verifyB.matchedStudentPhone}`);
    console.log(`  - MatchedName in DB: ${verifyB.matchedStudentName}`);
    console.log(`  - Status in DB: ${verifyB.status}`);

    console.log("\n🟢 CONFIRM SWAP COMPLETED SUCCESSFULLY\n");

    res.status(200).json({
      success: true,
      message: "Swap confirmed! Both requests are now matched.",
    });
  } catch (err) {
    console.error("❌ Error confirming swap:", err);
    res.status(500).json({ error: err.message });
  }
};

// Mark swap as completed
exports.completeSwap = async (req, res) => {
  try {
    const { requestId } = req.params;
    const studentId = req.user.id;

    const request = await SwapRequest.findById(requestId);
    if (!request || request.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update to completed
    await SwapRequest.findByIdAndUpdate(requestId, { status: "completed" });

    // Also update matched request if exists
    if (request.matchedWith) {
      await SwapRequest.findByIdAndUpdate(request.matchedWith, { status: "completed" });
    }

    res.status(200).json({
      success: true,
      message: "Swap marked as completed",
    });
  } catch (err) {
    console.error("❌ Error completing swap:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete swap request
exports.deleteSwapRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const studentId = req.user.id;

    const request = await SwapRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Swap request not found" });
    }

    if (request.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await SwapRequest.findByIdAndDelete(requestId);

    res.status(200).json({
      success: true,
      message: "Swap request deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting swap request:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get phone number and details of matched student (only after confirming swap)
exports.getMatchedStudentPhone = async (req, res) => {
  try {
    const { requestId } = req.params;
    const studentId = req.user.id;

    console.log("🔵 GET MATCHED STUDENT PHONE");
    console.log(`  RequestID: ${requestId}, StudentID: ${studentId}`);

    const request = await SwapRequest.findById(requestId);
    if (!request) {
      console.log("❌ REQUEST NOT FOUND");
      return res.status(404).json({ error: "Swap request not found" });
    }

    console.log(`  Status: ${request.status}`);
    console.log(`  StudentID Match: ${request.studentId.toString() === studentId.toString()}`);

    if (request.studentId.toString() !== studentId.toString()) {
      console.log("❌ UNAUTHORIZED");
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (request.status !== "matched") {
      console.log("❌ STATUS NOT MATCHED");
      return res.status(400).json({ error: "Swap must be confirmed first" });
    }

    const matchedRequest = await SwapRequest.findById(request.matchedWith);
    if (!matchedRequest) {
      console.log("❌ MATCHED REQUEST NOT FOUND");
      return res.status(404).json({ error: "Matched request not found" });
    }

    console.log("✅ MATCHED REQUEST FOUND");
    console.log(`  matchedStudentPhone: ${matchedRequest.matchedStudentPhone}`);
    console.log(`  matchedStudentName: ${matchedRequest.matchedStudentName}`);
    console.log(`  matchedStudentEmail: ${matchedRequest.matchedStudentEmail}`);
    console.log(`  studentPhone: ${matchedRequest.studentPhone}`);
    console.log(`  studentContactName: ${matchedRequest.studentContactName}`);

    // CRITICAL: Fallback logic
    // - If matchedStudentPhone exists, use it (Student A's data stored on Student B's request)
    // - Otherwise use studentPhone (Student A already confirmed, so use their stored phone)
    const phone = matchedRequest.matchedStudentPhone || matchedRequest.studentPhone || "N/A";
    const name = matchedRequest.matchedStudentName || matchedRequest.studentContactName || matchedRequest.studentName || "N/A";
    const email = matchedRequest.matchedStudentEmail || matchedRequest.studentEmail || "N/A";

    console.log("🔄 FALLBACK LOGIC:");
    console.log(`  Final Phone: ${phone}`);
    console.log(`  Final Name: ${name}`);
    console.log(`  Final Email: ${email}`);

    const response = {
      success: true,
      studentName: name,
      studentEmail: email,
      studentPhone: phone,
      studentContactName: name,
      bargainingNotes: matchedRequest.bargainingNotes || "",
    };

    console.log("📤 SENDING RESPONSE:", response);
    res.status(200).json(response);
  } catch (err) {
    console.error("❌ Error getting matched student phone:", err);
    res.status(500).json({ error: err.message });
  }
};