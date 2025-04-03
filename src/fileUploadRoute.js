const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' }); // Stores files in "uploads" folder

// API: File Upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(201).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

module.exports = router;
