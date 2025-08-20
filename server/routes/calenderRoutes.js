const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const calendar = require('../controller/calenderController');

router.use(auth);

router.get('/', calendar.listEntries);
router.post('/', calendar.createEntry);
router.put('/:id', calendar.updateEntry);
router.delete('/:id', calendar.deleteEntry);

module.exports = router;