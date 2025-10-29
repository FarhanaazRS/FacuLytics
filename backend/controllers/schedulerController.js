const Schedule = require("../models/Schedule");

// Get user's schedule
exports.getSchedule = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log("🔵 GET SCHEDULE - studentId:", studentId);

    let schedule = await Schedule.findOne({ studentId });

    if (!schedule) {
      console.log("📝 CREATING NEW SCHEDULE");
      schedule = new Schedule({
        studentId,
        subjects: new Map(),
      });
      await schedule.save();
    }

    console.log("✅ SCHEDULE FOUND - Subjects:", schedule.subjects.size);
    res.json({
      success: true,
      schedule: {
        _id: schedule._id,
        studentId: schedule.studentId,
        subjects: Object.fromEntries(schedule.subjects),
      },
    });
  } catch (err) {
    console.error("❌ Error getting schedule:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update subject in schedule
exports.updateSubject = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { slotKey, subjectName } = req.body;
    // slotKey format: "MON-A1/L1"

    console.log("🔵 UPDATE SUBJECT - studentId:", studentId);
    console.log(`  SlotKey: ${slotKey}, Subject: ${subjectName}`);

    if (!slotKey) {
      return res.status(400).json({ error: "Slot key is required" });
    }

    let schedule = await Schedule.findOne({ studentId });

    if (!schedule) {
      console.log("📝 CREATING NEW SCHEDULE FOR UPDATE");
      schedule = new Schedule({
        studentId,
        subjects: new Map(),
      });
    }

    // Update or add subject
    if (subjectName && subjectName.trim() !== "") {
      schedule.subjects.set(slotKey, subjectName.trim());
      console.log(`✅ SUBJECT ADDED: ${slotKey} = ${subjectName}`);
    } else {
      // Delete if empty
      schedule.subjects.delete(slotKey);
      console.log(`🗑️ SUBJECT DELETED: ${slotKey}`);
    }

    await schedule.save();

    res.json({
      success: true,
      message: "Subject updated successfully",
      schedule: {
        _id: schedule._id,
        subjects: Object.fromEntries(schedule.subjects),
      },
    });
  } catch (err) {
    console.error("❌ Error updating subject:", err);
    res.status(500).json({ error: err.message });
  }
};

// Save entire schedule (bulk update)
exports.saveSchedule = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { subjects } = req.body;
    // subjects format: { "MON-A1/L1": "Subject Name", ... }

    console.log("🔵 SAVE SCHEDULE - studentId:", studentId);
    console.log(`  Total subjects: ${Object.keys(subjects).length}`);

    if (!subjects || typeof subjects !== "object") {
      return res.status(400).json({ error: "Invalid subjects format" });
    }

    let schedule = await Schedule.findOne({ studentId });

    if (!schedule) {
      console.log("📝 CREATING NEW SCHEDULE FOR SAVE");
      schedule = new Schedule({
        studentId,
        subjects: new Map(),
      });
    }

    // Clear old data
    schedule.subjects.clear();

    // Set new data
    Object.entries(subjects).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        schedule.subjects.set(key, value.trim());
      }
    });

    await schedule.save();

    console.log("✅ SCHEDULE SAVED - Total subjects:", schedule.subjects.size);

    res.json({
      success: true,
      message: "Schedule saved successfully",
      schedule: {
        _id: schedule._id,
        subjects: Object.fromEntries(schedule.subjects),
      },
    });
  } catch (err) {
    console.error("❌ Error saving schedule:", err);
    res.status(500).json({ error: err.message });
  }
};

// Clear schedule
exports.clearSchedule = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log("🔵 CLEAR SCHEDULE - studentId:", studentId);

    let schedule = await Schedule.findOne({ studentId });

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    schedule.subjects.clear();
    await schedule.save();

    console.log("✅ SCHEDULE CLEARED");

    res.json({
      success: true,
      message: "Schedule cleared successfully",
    });
  } catch (err) {
    console.error("❌ Error clearing schedule:", err);
    res.status(500).json({ error: err.message });
  }
};