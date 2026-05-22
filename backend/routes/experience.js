const express = require("express");
const Experience = require("../models/Experience");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await Experience.find().sort({ order: 1, createdAt: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const exp = await Experience.create(req.body);
    res.status(201).json(exp);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exp) return res.status(404).json({ message: "Not found" });
    res.json(exp);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ message: "Not found" });
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
      items.map(item => Experience.findByIdAndUpdate(item.id, { order: item.order }))
    );
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
