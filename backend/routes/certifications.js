const express = require("express");
const Certification = require("../models/Certification");
const auth = require("../middleware/authMiddleware");
const { imageUpload } = require("./upload");
const cloudinaryUpload = require("../middleware/cloudinaryUpload");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await Certification.find().sort({ order: 1, createdAt: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, imageUpload.single("image"), cloudinaryUpload, async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.certificateImage = req.file.cloudinaryUrl || `/uploads/${req.file.filename}`;
    const cert = await Certification.create(data);
    res.status(201).json(cert);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", auth, imageUpload.single("image"), cloudinaryUpload, async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.certificateImage = req.file.cloudinaryUrl || `/uploads/${req.file.filename}`;
    const cert = await Certification.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!cert) return res.status(404).json({ message: "Not found" });
    res.json(cert);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const cert = await Certification.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/reorder", auth, async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: "Invalid data format" });
    
    await Promise.all(
      items.map(item => Certification.findByIdAndUpdate(item.id, { order: item.order }))
    );
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
