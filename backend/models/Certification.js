const { JSONModel } = require("../db");

module.exports = new JSONModel("certifications.json", {
  certificateName: "",
  issuer: "",
  date: "",
  credentialLink: "",
  certificateImage: "",
  order: 0
});
