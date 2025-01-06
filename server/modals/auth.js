const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide name"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "please provide email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email"
      ],
      unique: true,
      maxlength: 50,
    },
    password: {
      type: String,
      required: [true, "please provide password"],
      minlength: 6,
    },
    profilePicture: {
      type: String, // Field for storing profile picture file path or URL
    },
    otp: {
      otp: {
        type: String,
      },
      sendTime: { type: Number },
      token: { type: String },
    },
    role:{
      type:String,
      enum:['user','admin'],
      default:"user"
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", authSchema);
