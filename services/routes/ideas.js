import express from "express";
import Idea from "../models/Idea";
import authMiddleware from "../middleware/auth";

const router = express.Router();

// Get all ideas
router.get("/", authMiddleware, async (req, res) => {
  const ideas = await Idea.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
  res.json(ideas);
});

// Create new idea
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, category, priority } = req.body;
  const idea = new Idea({ title, description, category, priority, createdBy: req.user.id });
  await idea.save();
  res.status(201).json(idea);
});

// Add feedback to an idea
router.post("/:id/feedback", authMiddleware, async (req, res) => {
  const { comment } = req.body;
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ message: "Idea not found" });

  idea.feedback.push({ user: req.user.id, comment });
  await idea.save();
  res.status(201).json(idea);
});

export default router;