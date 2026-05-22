const express = require("express");
const Contact = require("../models/Contact");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const contact = await Contact.findOne();
    res.json(contact || {});
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const data = { ...req.body, updatedAt: Date.now() };
    if (typeof data.socialLinks === "string") data.socialLinks = JSON.parse(data.socialLinks || "{}");
    const contact = await Contact.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: true });
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
