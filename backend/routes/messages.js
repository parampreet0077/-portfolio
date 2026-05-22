const express = require("express");
const Message = require("../models/Message");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

router.get("/", auth, async (_req, res, next) => {
  try {
    res.json(await Message.find().sort({ createdAt: -1 }));
  } catch (error) {
    next(error);
  }
});

router.put("/:id/read", auth, async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { status: "read" }, { new: true });
    if (!message) return res.status(404).json({ message: "Not found" });
    res.json(message);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
