const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  rollno: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required:true,
  },

  dob: {
    type: String, // Store the date as a string
    default: () => moment().utc().format("DD/MM/YYYY"), // Set default to current UTC date in the specified format
    required: true,
  },
  score: {
    type: Number,
    //required:true,
    min: 0,
    max: 500
  },
});
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
