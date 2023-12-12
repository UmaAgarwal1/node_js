const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  username: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  isAdmin: {
    type: "boolean",
    default: true,
  },
});

const Teacher = mongoose.model("teacher", TeacherSchema);

module.exports = Teacher;