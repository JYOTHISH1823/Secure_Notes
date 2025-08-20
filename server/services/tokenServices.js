const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXP = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_EXP = process.env.REFRESH_TOKEN_EXPIRY || '7d';

function signAccess(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}
function signRefresh(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
}
function verifyAccess(token) {
  return jwt.verify(token, ACCESS_SECRET);
}
function verifyRefresh(token) {
  return jwt.verify(token, REFRESH_SECRET);
}
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh, hashToken };