const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { uploadFile, getFiles, downloadFile } = require("../controllers/fileController");

// Example routes
router.use(protect); // must be defined
router.post("/upload", uploadFile);
router.get("/", getFiles);
router.get("/download/:filename", downloadFile);

module.exports = router;