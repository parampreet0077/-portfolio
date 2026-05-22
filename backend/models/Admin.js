const { JSONModel } = require("../db");

module.exports = new JSONModel("admins.json", {
  name: "Admin",
  email: "",
  passwordHash: "",
  profileImage: "",
  theme: "light",
  accentColor: "#7c3aed"
});
