const express = require('express');
const router = express.Router();
const { summarize, aiLimiter } = require('../controller/aiController');
const auth = require('../middlewares/authMiddleware');

router.use(auth);
router.post('/summarize', aiLimiter, summarize);

module.exports = router;