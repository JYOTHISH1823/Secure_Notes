const File = require("../models/File");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

exports.uploadFile = [
  upload.single("file"),
  async (req, res) => {
    try {
      const file = await File.create({
        user: req.user.id,
        filename: req.file.filename,
        originalname: req.file.originalname,
      });
      res.status(201).json(file);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

exports.getFiles = async (req, res) => {
  const files = await File.find({ user: req.user.id });
  res.json(files);
};

exports.downloadFile = (req, res) => {
  const filePath = path.join(__dirname, "../uploads/", req.params.filename);
  res.download(filePath);
};