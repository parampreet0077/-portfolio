const { JSONModel } = require("../db");

module.exports = new JSONModel("experiences.json", {
  companyName: "",
  role: "",
  duration: "",
  responsibilities: "",
  technologiesUsed: [],
  order: 0
});
