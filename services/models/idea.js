import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const IdeaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  priority: { type: String, default: "low" },
  isStarred: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  feedback: [FeedbackSchema]
});

export default mongoose.models.Idea || mongoose.model("Idea", IdeaSchema);