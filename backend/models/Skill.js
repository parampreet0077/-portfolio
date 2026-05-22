const { JSONModel } = require("../db");

module.exports = new JSONModel("skills.json", {
  skillName: "",
  percentage: 0,
  category: "Frontend",
  icon: "",
  colorTheme: "#7c3aed",
  experienceLevel: "Beginner",
  educationData: {
    courseName: "",
    platform: "",
    completionPercentage: 0,
    duration: "",
    certificateLink: "",
    status: ""
  },
  programmingData: {
    projectsUsedIn: 0,
    githubLink: "",
    experienceYears: 0
  },
  order: 0
});
