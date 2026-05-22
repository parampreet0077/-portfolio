const express = require("express");
const Project = require("../models/Project");
const auth = require("../middleware/authMiddleware");
const { imageUpload } = require("./upload");

const router = express.Router();

const parseProjectData = (req) => {
  const data = { ...req.body };
  if (typeof data.techStack === 'string') data.techStack = JSON.parse(data.techStack);
  if (typeof data.features === 'string') data.features = JSON.parse(data.features);
  if (typeof data.timeline === 'string') data.timeline = JSON.parse(data.timeline);
  if (typeof data.images === 'string') data.images = JSON.parse(data.images);
  
  if (req.files) {
    if (req.files.thumbnail) data.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    if (req.files.images) {
      const existingImages = Array.isArray(data.images) ? data.images : [];
      const newImages = req.files.images.map(f => `/uploads/${f.filename}`);
      data.images = [...existingImages, ...newImages];
    }
  }
  return data;
};

router.get("/", async (_req, res, next) => {
  try {
    res.json(await Project.find().sort({ order: 1, createdAt: -1 }));
  } catch (error) {
    next(error);
  }
});

const uploadFields = imageUpload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 10 }]);

router.post("/", auth, uploadFields, async (req, res, next) => {
  try {
    const project = await Project.create(parseProjectData(req));
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", auth, uploadFields, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, parseProjectData(req), { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/reorder", auth, async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: "Invalid data format" });
    
    await Promise.all(
      items.map(item => Project.findByIdAndUpdate(item.id, { order: item.order }))
    );
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
