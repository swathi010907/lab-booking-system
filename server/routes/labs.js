const express = require("express");
const Lab = require("../models/Lab");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Get all labs (any logged-in user)
router.get("/", protect, async (req, res) => {
  try {
    const labs = await Lab.find().sort({ createdAt: -1 });
    res.json(labs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add lab (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, location, capacity } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Lab name is required" });
    }
    const lab = await Lab.create({ name, description, location, capacity });
    res.status(201).json(lab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update lab, including availability (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const lab = await Lab.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lab) return res.status(404).json({ message: "Lab not found" });
    res.json(lab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete lab (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const lab = await Lab.findByIdAndDelete(req.params.id);
    if (!lab) return res.status(404).json({ message: "Lab not found" });
    res.json({ message: "Lab deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;