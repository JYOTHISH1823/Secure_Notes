const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getProfile, changePassword } = require('../controller/userController');

router.use(auth);

router.get('/', getProfile);
router.put('/password', changePassword);

module.exports = router;