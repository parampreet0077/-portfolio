const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const auth = require("../middleware/authMiddleware");
const { imageUpload } = require("./upload");

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-passwordHash");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (error) {
    next(error);
  }
});

router.put("/", auth, imageUpload.single("profileImage"), async (req, res, next) => {
  try {
    const { name, theme, accentColor, newPassword } = req.body;
    const updates = {};
    if (Object.prototype.hasOwnProperty.call(req.body, "name")) updates.name = name;
    if (Object.prototype.hasOwnProperty.call(req.body, "theme")) updates.theme = theme;
    if (Object.prototype.hasOwnProperty.call(req.body, "accentColor")) updates.accentColor = accentColor;
    
    if (newPassword) {
      updates.passwordHash = await bcrypt.hash(newPassword, 10);
    }
    
    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    const admin = await Admin.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select("-passwordHash");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
