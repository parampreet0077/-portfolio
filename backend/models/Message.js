const { JSONModel } = require("../db");

module.exports = new JSONModel("messages.json", {
  name: "",
  email: "",
  subject: "",
  message: "",
  status: "unread"
});
