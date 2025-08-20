const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const ideas = require('../controller/ideasController');

router.use(auth);

router.get('/', ideas.listIdeas);
router.post('/', ideas.createIdea);
router.put('/:id', ideas.updateIdea);
router.delete('/:id', ideas.deleteIdea);

module.exports = router;