const { verifyAccess } = require('../services/tokenServices');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing token' });
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyAccess(token);
    req.user = { id: payload.sub, email: payload.email };
    req.userModel = await User.findById(payload.sub);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;