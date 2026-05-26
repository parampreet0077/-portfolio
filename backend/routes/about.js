const express = require("express");
const About = require("../models/About");
const auth = require("../middleware/authMiddleware");
const { imageUpload } = require("./upload");
const cloudinaryUpload = require("../middleware/cloudinaryUpload");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const about = await About.findOne();
    res.json(about || {});
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, imageUpload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), cloudinaryUpload, async (req, res, next) => {
  try {
    const data = { ...req.body };
    
    // Parse JSON strings back to objects
    if (typeof data.socialLinks === "string") data.socialLinks = JSON.parse(data.socialLinks || "{}");
    if (typeof data.achievements === "string") data.achievements = JSON.parse(data.achievements || "[]");
    
    if (req.files) {
      if (req.files.profileImage) {
        data.profileImage = req.files.profileImage[0].cloudinaryUrl || `/uploads/${req.files.profileImage[0].filename}`;
      }
      if (req.files.coverImage) {
        data.coverImage = req.files.coverImage[0].cloudinaryUrl || `/uploads/${req.files.coverImage[0].filename}`;
      }
    }

    data.updatedAt = Date.now();
    
    const about = await About.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: true });
    res.json(about);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
