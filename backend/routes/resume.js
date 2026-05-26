const express = require("express");
const fs = require("fs");
const path = require("path");
const Resume = require("../models/Resume");
const auth = require("../middleware/authMiddleware");
const { pdfUpload } = require("./upload");
const cloudinaryUpload = require("../middleware/cloudinaryUpload");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const resume = await Resume.findOne();
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (error) {
    next(error);
  }
});

router.get("/download", async (_req, res, next) => {
  try {
    const resume = await Resume.findOne();
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    if (resume.pdfFile && resume.pdfFile.startsWith("http")) {
      const https = require("https");
      res.setHeader("Content-Disposition", "attachment; filename=Parampreet-Singh-Resume.pdf");
      res.setHeader("Content-Type", "application/pdf");
      https.get(resume.pdfFile, (stream) => {
        if (stream.statusCode !== 200) {
          return res.status(500).json({ message: "Error downloading file from cloud storage" });
        }
        stream.pipe(res);
      }).on("error", (err) => {
        next(err);
      });
    } else {
      const filePath = path.join(__dirname, "..", resume.pdfFile);
      if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Resume file not found" });
      res.download(filePath, "Parampreet-Singh-Resume.pdf");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, pdfUpload.single("pdf"), cloudinaryUpload, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No PDF file uploaded" });

    // Delete old resume file if it exists and is local
    const existing = await Resume.findOne();
    if (existing && existing.pdfFile && !existing.pdfFile.startsWith("http")) {
      const oldPath = path.join(__dirname, "..", existing.pdfFile);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const newResume = await Resume.findOneAndUpdate(
      {},
      {
        pdfFile: req.file.cloudinaryUrl || `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
        uploadDate: Date.now()
      },
      { new: true, upsert: true }
    );

    res.json(newResume);
  } catch (error) {
    next(error);
  }
});

router.delete("/", auth, async (_req, res, next) => {
  try {
    const existing = await Resume.findOne();
    if (!existing) return res.status(404).json({ message: "No resume to delete" });
    
    if (existing.pdfFile && !existing.pdfFile.startsWith("http")) {
      const oldPath = path.join(__dirname, "..", existing.pdfFile);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    
    await Resume.deleteOne();
    res.json({ message: "Resume deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
