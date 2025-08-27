const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    isSecure: { type: Boolean, default: false }, // false = normal note, true = secure note
    isStarred: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
