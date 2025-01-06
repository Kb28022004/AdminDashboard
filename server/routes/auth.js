const express = require("express");
const router = express.Router();
const {
  adminLogin,
  registerWithProfilePicture,
  adminLogout,
  updateProfileWithPicture,
  resetpassword,
  forgetPassword,
  verifyOtp,
  getOtpTime,
  updatePassword,
  resetPassword,
} = require("../controllers/auth");
const authenticateJWT =require('../middleware/authenticated')

router.route("/login").post(adminLogin);
router.route("/register").post(registerWithProfilePicture);
router.route("/logout").post(adminLogout);
router.route("/profile/update").put(authenticateJWT,updateProfileWithPicture);
router.route("/resetpassword").put(resetPassword);
router.route("/forget/password").post(forgetPassword);
router.route("/verify/otp").post(verifyOtp);
router.route("/otp/time").post(getOtpTime);
router.route("/update/password").post(updatePassword);

module.exports = router;
