const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const aboutRoutes = require("./routes/about");
const skillsRoutes = require("./routes/skills");
const projectsRoutes = require("./routes/projects");
const resumeRoutes = require("./routes/resume");
const educationRoutes = require("./routes/education");
const experienceRoutes = require("./routes/experience");
const certificationsRoutes = require("./routes/certifications");
const contactRoutes = require("./routes/contact");
const messagesRoutes = require("./routes/messages");
const settingsRoutes = require("./routes/settings");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: function(origin, callback) {
      callback(null, true);
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/certifications", certificationsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

// Start the server directly using local file-based database
app.listen(PORT, () => {
  console.log(`API running on port ${PORT} (using file-based JSON database)`);
});
