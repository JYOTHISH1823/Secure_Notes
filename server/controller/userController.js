const User = require('../models/User');
const bcrypt = require('bcrypt');

async function getProfile(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ email: user.email, createdAt: user.createdAt });
}

async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ message: 'old and new password required' });

  const user = await User.findById(req.user.id);
  const ok = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'invalid old password' });

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.json({ message: 'password changed' });
}

module.exports = { getProfile, changePassword };