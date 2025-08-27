const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * -------------------
 * NORMAL NOTES (isSecure: false)
 * -------------------
 */

// Get all normal notes
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id, isSecure: false }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a normal note
router.post("/", auth, async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, user: req.user.id, isSecure: false });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a normal note
router.put("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, isSecure: false },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a normal note
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
      isSecure: false,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * -------------------
 * SECURE NOTES (isSecure: true)
 * -------------------
 */

// Get all secure notes
router.get("/secure", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id, isSecure: true }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a secure note
router.post("/secure", auth, async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, user: req.user.id, isSecure: true });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a secure note
router.put("/secure/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, isSecure: true },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Secure note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a secure note
router.delete("/secure/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
      isSecure: true,
    });
    if (!note) return res.status(404).json({ message: "Secure note not found" });
    res.json({ message: "Secure note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;