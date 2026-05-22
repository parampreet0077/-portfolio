const { JSONModel } = require("../db");

module.exports = new JSONModel("about.json", {
  fullName: "",
  title: "",
  shortBio: "",
  longDescription: "",
  experienceYears: 0,
  location: "",
  email: "",
  phone: "",
  profileImage: "",
  coverImage: "",
  resumeIntro: "",
  socialLinks: {
    github: "",
    linkedin: "",
    instagram: "",
    portfolio: ""
  },
  achievements: []
});
