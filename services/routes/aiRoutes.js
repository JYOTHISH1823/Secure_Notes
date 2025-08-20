const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { queryAI } = require("../controllers/aiController");

router.use(auth);
router.post("/query", queryAI);

module.exports = router;