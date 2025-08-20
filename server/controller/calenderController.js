const CalendarEntry = require('../models/CalenderEntry');
const User = require('../models/User');
const { unwrapDEK, encryptWithDEK, decryptWithDEK } = require('../utils/crypto');

async function listEntries(req, res) {
  const userId = req.user.id;
  const entries = await CalendarEntry.find({ userId }).sort({ date: 1 });
  const user = await User.findById(userId);
  const dek = unwrapDEK(user.wrappedDEK);
  const output = entries.map(e => ({
    id: e._id,
    title: e.title,
    date: e.date,
    plaintext: decryptWithDEK(e.ciphertext, dek),
    createdAt: e.createdAt
  }));
  res.json(output);
}

async function createEntry(req, res) {
  const userId = req.user.id;
  const { title = '', plaintext = '', date } = req.body;
  if (!date) return res.status(400).json({ message: 'date required' });
  const user = await User.findById(userId);
  const dek = unwrapDEK(user.wrappedDEK);
  const ciphertext = encryptWithDEK(plaintext, dek);
  const entry = new CalendarEntry({ userId, title, date, ciphertext });
  await entry.save();
  res.status(201).json({ id: entry._id });
}

async function updateEntry(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, plaintext, date } = req.body;
  const entry = await CalendarEntry.findOne({ _id: id, userId });
  if (!entry) return res.status(404).json({ message: 'Not found' });
  if (title !== undefined) entry.title = title;
  if (plaintext !== undefined) {
    const user = await User.findById(userId);
    const dek = unwrapDEK(user.wrappedDEK);
    entry.ciphertext = encryptWithDEK(plaintext, dek);
  }
  if (date !== undefined) entry.date = date;
  await entry.save();
  res.json({ message: 'ok' });
}

async function deleteEntry(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const entry = await CalendarEntry.findOne({ _id: id, userId });
  if (!entry) return res.status(404).json({ message: 'Not found' });
  await entry.deleteOne();
  res.json({ message: 'deleted' });
}

module.exports = { listEntries, createEntry, updateEntry, deleteEntry };