const express = require("express");
const Skill = require("../models/Skill");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await Skill.find().sort({ order: 1, createdAt: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json({ message: "Skill deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/reorder", auth, async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: "Invalid data format" });
    
    await Promise.all(
      items.map(item => Skill.findByIdAndUpdate(item.id, { order: item.order }))
    );
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
