const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    tags: [String],
    isSecure: { type: Boolean, default: false }, // <— key flag
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);