const { JSONModel } = require("../db");

module.exports = new JSONModel("contacts.json", {
  email: "",
  phone: "",
  address: "",
  whatsapp: "",
  googleMapsLink: "",
  socialLinks: {
    github: "",
    linkedin: "",
    instagram: "",
    twitter: ""
  }
});
