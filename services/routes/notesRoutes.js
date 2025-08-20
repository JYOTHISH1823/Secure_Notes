const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { requireVault } = require("../middleware/vaultMiddleware");
const {
  getNotes, createNote, updateNote, deleteNote,
  getSecureNotes, createSecureNote, updateSecureNote, deleteSecureNote
} = require("../controllers/noteController");

// Regular notes
router.use(protect);
router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

// Secure notes (vault lock required)
router.get("/secure", requireVault, getSecureNotes);
router.post("/secure", requireVault, createSecureNote);
router.put("/secure/:id", requireVault, updateSecureNote);
router.delete("/secure/:id", requireVault, deleteSecureNote);

module.exports = router;