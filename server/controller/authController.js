const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateDEK, wrapDEK } = require('../utils/crypto');
const { signAccess, signRefresh, hashToken, verifyRefresh } = require('../services/tokenServices');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../utils/validators');

const SALT_ROUNDS = 12;

async function register(req, res) {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { email, password } = value;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const dek = generateDEK();
  const wrappedDEK = wrapDEK(dek);

  const user = new User({ email, passwordHash, wrappedDEK });
  await user.save();

  res.status(201).json({ message: 'User created' });
}

async function login(req, res) {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { email, password } = value;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const payload = { sub: user._id.toString(), email: user.email };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);

  user.refreshTokens.push({ tokenHash: hashToken(refreshToken) });
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
  res.json({ accessToken });
}

async function refresh(req, res) {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) return res.status(401).json({ message: 'Missing refresh token' });
  try {
    const payload = verifyRefresh(token);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    const tokenHash = hashToken(token);
    const found = user.refreshTokens.find(rt => rt.tokenHash === tokenHash && !rt.revoked);
    if (!found) return res.status(401).json({ message: 'Refresh token revoked' });

    const newAccess = signAccess({ sub: user._id.toString(), email: user.email });
    res.json({ accessToken: newAccess });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}

async function logout(req, res) {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(payload.sub);
      if (user) {
        const tokenHash = hashToken(token);
        const rt = user.refreshTokens.find(r => r.tokenHash === tokenHash);
        if (rt) {
          rt.revoked = true;
          await user.save();
        }
      }
    } catch (e) {
      // ignore invalid token
    }
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
}

module.exports = { register, login, refresh, logout };