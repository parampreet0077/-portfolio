const express = require("express");
const Education = require("../models/Education");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await Education.find().sort({ order: 1, startYear: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const edu = await Education.create(req.body);
    res.status(201).json(edu);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!edu) return res.status(404).json({ message: "Not found" });
    res.json(edu);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const edu = await Education.findByIdAndDelete(req.params.id);
    if (!edu) return res.status(404).json({ message: "Not found" });
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
      items.map(item => Education.findByIdAndUpdate(item.id, { order: item.order }))
    );
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
