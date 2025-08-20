const Note = require("../models/Note");

// public/regular notes (isSecure: false)
exports.getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id, isSecure: false }).sort({ updatedAt: -1 });
  res.json(notes);
};

exports.createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, user: req.user.id, isSecure: false });
  res.status(201).json(note);
};

exports.updateNote = async (req, res) => {
  const updated = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id, isSecure: false },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "Note not found" });
  res.json(updated);
};

exports.deleteNote = async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id, isSecure: false });
  res.json({ message: "Deleted" });
};

// SECURE notes (isSecure: true)
exports.getSecureNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id, isSecure: true }).sort({ updatedAt: -1 });
  res.json(notes);
};

exports.createSecureNote = async (req, res) => {
  const note = await Note.create({ ...req.body, user: req.user.id, isSecure: true });
  res.status(201).json(note);
};

exports.updateSecureNote = async (req, res) => {
  const updated = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id, isSecure: true },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "Secure note not found" });
  res.json(updated);
};

exports.deleteSecureNote = async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id, isSecure: true });
  res.json({ message: "Deleted" });
};