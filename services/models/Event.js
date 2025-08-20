const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g. "09:00 AM"
  duration: { type: String, default: "" }, // e.g. "1 hour"
  location: { type: String, default: "" },
  attendees: { type: Number, default: 1 },
  type: { type: String, enum: ["meeting", "personal", "finance", "other"], default: "meeting" },
  isSecure: { type: Boolean, default: false },
  isConfidential: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);