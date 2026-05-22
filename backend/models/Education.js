const { JSONModel } = require("../db");

module.exports = new JSONModel("educations.json", {
  degree: "",
  institution: "",
  percentage: "",
  startYear: "",
  endYear: "Present",
  description: "",
  order: 0
});
