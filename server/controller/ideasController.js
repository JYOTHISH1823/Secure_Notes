const Idea = require('../models/Ideas');
const User = require('../models/User');
const { unwrapDEK, encryptWithDEK, decryptWithDEK } = require('../utils/crypto');

async function listIdeas(req, res) {
  const userId = req.user.id;
  const ideas = await Idea.find({ userId }).sort({ updatedAt: -1 });
  const user = await User.findById(userId);
  const dek = unwrapDEK(user.wrappedDEK);
  const output = ideas.map(i => ({
    id: i._id,
    title: i.title,
    plaintext: decryptWithDEK(i.ciphertext, dek),
    tags: i.tags,
    isArchived: i.isArchived,
    createdAt: i.createdAt
  }));
  res.json(output);
}

async function createIdea(req, res) {
  const userId = req.user.id;
  const { title = '', plaintext = '', tags = [] } = req.body;
  const user = await User.findById(userId);
  const dek = unwrapDEK(user.wrappedDEK);
  const ciphertext = encryptWithDEK(plaintext, dek);
  const idea = new Idea({ userId, title, ciphertext, tags });
  await idea.save();
  res.status(201).json({ id: idea._id });
}

async function updateIdea(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, plaintext, tags, isArchived } = req.body;
  const idea = await Idea.findOne({ _id: id, userId });
  if (!idea) return res.status(404).json({ message: 'Not found' });
  if (title !== undefined) idea.title = title;
  if (plaintext !== undefined) {
    const user = await User.findById(userId);
    const dek = unwrapDEK(user.wrappedDEK);
    idea.ciphertext = encryptWithDEK(plaintext, dek);
  }
  if (tags !== undefined) idea.tags = tags;
  if (isArchived !== undefined) idea.isArchived = isArchived;
  await idea.save();
  res.json({ message: 'ok' });
}

async function deleteIdea(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const idea = await Idea.findOne({ _id: id, userId });
  if (!idea) return res.status(404).json({ message: 'Not found' });
  await idea.deleteOne();
  res.json({ message: 'deleted' });
}

module.exports = { listIdeas, createIdea, updateIdea, deleteIdea };