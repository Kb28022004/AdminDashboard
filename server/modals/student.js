// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
    maxlength: 50,
  },
  phone: {
    type: Number,
    required: [true, "Plase provide a number"],
    minlength: [true, 10],
  },
  enroll: {
    type: Number,
    required: [true, "Plase provide an enrollment number"],
    minlength: [true, 12],
  },
  admission: {
    type: String,
    required: [true, "Please provide date of admission"],
  },
  
});

module.exports = mongoose.model("Student", studentSchema);
