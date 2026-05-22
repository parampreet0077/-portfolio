const { JSONModel } = require("../db");

module.exports = new JSONModel("resumes.json", {
  pdfFile: "",
  fileSize: 0
});
