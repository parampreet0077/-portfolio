const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
    cb(null, `${Date.now()}-${safe}`);
  }
});

const makeUpload = (allowed, message) =>
  multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowed.includes(ext)) return cb(null, true);
      cb(new Error(message));
    }
  });

module.exports = {
  imageUpload: makeUpload([".jpg", ".jpeg", ".png", ".webp"], "Only JPG, PNG, and WEBP images are allowed"),
  pdfUpload: makeUpload([".pdf"], "Only PDF files are allowed")
};
