const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controller/authController');
const { authLimiter } = require('../middlewares/rateLimiterMiddleware');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;