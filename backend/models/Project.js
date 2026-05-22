const { JSONModel } = require("../db");

module.exports = new JSONModel("projects.json", {
  title: "",
  shortDescription: "",
  fullDescription: "",
  thumbnail: "",
  images: [],
  techStack: [],
  githubLink: "",
  liveDemoLink: "",
  category: "Full Stack",
  status: "In Progress",
  featured: false,
  features: [],
  timeline: {
    startDate: "",
    endDate: ""
  },
  order: 0
});
