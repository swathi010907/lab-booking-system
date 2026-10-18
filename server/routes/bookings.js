const express = require("express");
const Booking = require("../models/Booking");
const Lab = require("../models/Lab");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Create booking (with conflict check)
router.post("/", protect, async (req, res) => {
  try {
    const { lab, date, startTime, endTime, purpose } = req.body;

    if (!lab || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Lab, date, start time and end time are required" });
    }
    if (!dateRegex.test(date)) {
      return res.status(400).json({ message: "Date format must be YYYY-MM-DD" });
    }
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ message: "Time format must be HH:MM (24-hour)" });
    }
    if (startTime >= endTime) {
      return res.status(400).json({ message: "End time must be after start time" });
    }
    const today = new Date().toISOString().slice(0, 10);
    if (date < today) {
      return res.status(400).json({ message: "Cannot book a past date" });
    }

    const labDoc = await Lab.findById(lab);
    if (!labDoc) return res.status(404).json({ message: "Lab not found" });
    if (!labDoc.isAvailable) {
      return res.status(400).json({ message: "This lab is currently not available" });
    }

    // Overlap check: existing.start < new.end AND existing.end > new.start
    const conflict = await Booking.findOne({
      lab,
      date,
      status: { $in: ["pending", "approved"] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });
    if (conflict) {
      return res.status(409).json({
        message: `Slot already booked (${conflict.startTime} - ${conflict.endTime})`,
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      lab,
      date,
      startTime,
      endTime,
      purpose,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// My booking history
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("lab", "name location")
      .sort({ date: -1, startTime: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// All bookings (admin)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("lab", "name location")
      .sort({ date: -1, startTime: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve / reject (admin)
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel my booking
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can cancel only your own booking" });
    }
    booking.status = "cancelled";
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;