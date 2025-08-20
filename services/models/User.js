const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: { type: String, select: false },
  vaultPasswordHash: { type: String, select: false }, // <— add this
});

module.exports = mongoose.model("User", userSchema);