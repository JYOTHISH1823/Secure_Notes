const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { uploadFile, getFiles, downloadFile } = require("../controllers/fileController");

router.use(auth);
router.get("/", getFiles);
router.post("/upload", uploadFile);
router.get("/download/:filename", downloadFile);

module.exports = router;