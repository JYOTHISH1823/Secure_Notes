const Note = require('../models/Note');
const { unwrapDEK, encryptWithDEK, decryptWithDEK } = require('../utils/crypto');
const User = require('../models/User');
const { noteSchema } = require('../utils/validators');

async function listNotes(req, res) {
  const userId = req.user.id;
  const notes = await Note.find({ userId, isDeleted: false }).sort({ updatedAt: -1 });
  const user = await User.findById(userId);
  const dek = unwrapDEK(user.wrappedDEK);
  const output = notes.map(n => ({
    id: n._id,
    title: n.title,
    plaintext: decryptWithDEK(n.ciphertext, dek),
    tags: n.tags,
    pinned: n.pinned,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt
  }));
  res.json(output);
}

async function getNote(req, res) {
  const { id } = req.params;
  const userId = req.user.id;
  const note = await Note.findOne({ _id: id, userId });
  if (!note) return res.status(404).json({ message: 'Not found' });
  const user = await User.findById(userId);
  const dek = unwrapDEK(user.wrappedDEK);
  const plaintext = decryptWithDEK(note.ciphertext, dek);
  res.json({ id: note._id, title: note.title, plaintext, tags: note.tags, pinned: note.pinned });
}

async function createNote(req, res) {
  const userId = req.user.id;
  const { error, value } = noteSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const { title = '', plaintext = '', tags = [] } = value;
  const user = await User.findById(userId);
  const dek = unwrapDEK(user.wrappedDEK);
  const ciphertext = encryptWithDEK(plaintext, dek);
  const note = new Note({ userId, title, ciphertext, tags });
  await note.save();
  res.status(201).json({ id: note._id });
}

async function updateNote(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, plaintext, tags, pinned } = req.body;
  const note = await Note.findOne({ _id: id, userId });
  if (!note) return res.status(404).json({ message: 'Not found' });
  if (title !== undefined) note.title = title;
  if (plaintext !== undefined) {
    const user = await User.findById(userId);
    const dek = unwrapDEK(user.wrappedDEK);
    note.ciphertext = encryptWithDEK(plaintext, dek);
  }
  if (tags !== undefined) note.tags = tags;
  if (pinned !== undefined) note.pinned = pinned;
  await note.save();
  res.json({ message: 'ok' });
}

async function deleteNote(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const note = await Note.findOne({ _id: id, userId });
  if (!note) return res.status(404).json({ message: 'Not found' });
  note.isDeleted = true;
  await note.save();
  res.json({ message: 'deleted' });
}

module.exports = { listNotes, getNote, createNote, updateNote, deleteNote };