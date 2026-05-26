const path = require("path");
const multer = require("multer");

const storage = multer.memoryStorage();

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
