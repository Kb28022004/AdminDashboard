const User = require("../modals/auth");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const upload = require("../middleware/multer");
const sendMail = require("../utils/sendMail");

// ..........................................REGISTER ADMIN.................................................

const adminRegister = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null; // Store only the file path

    if (!name || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Something is missing",
        success: false,
      });
    }

    // Check if user already exists with this email
    const user = await User.findOne({ email });
    if (user) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "User already exists",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePicture, // Save the profile picture path
      role
    });

    // Store user data, including profile picture URL, in a cookie
    res.cookie(
      "userData",
      JSON.stringify({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profilePicture: newUser.profilePicture,
      }),
      {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
    );

    return res.status(StatusCodes.OK).json({
      message: "Account created successfully",
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role:newUser.role,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating account",
      success: false,
    });
  }
};

// Middleware to upload profile picture before calling adminRegister
const registerWithProfilePicture = [
  upload.single("profilePicture"),
  adminRegister,
];

// .....................................................LOGIN ADMIN...................................................

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Something is missing",
        success: false,
      });
    }

    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Check password
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Create JWT token
    if (!process.env.SECRET_KEY) {
      throw new Error("JWT secret key is missing");
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    // Store user data in a cookie, including profile picture URL
    res.cookie(
      "userData",
      JSON.stringify({
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      }),
      {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
    );

    return res
      .status(StatusCodes.OK)
      .cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production", // Set secure flag in production
        httpOnly: true,
        sameSite: "Strict",
      })
      .json({
        message: `Welcome back ${user.name}`,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
        },
        token,
        success: true,
      });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error logging in",
      success: false,
    });
  }
};

//................................................. LOGOUT ADMIN........................................................

const adminLogout = async (req, res) => {
  try {
    res
      .status(StatusCodes.OK)
      .cookie("token", "", { maxAge: 0 })
      .cookie("userData", "", { maxAge: 0 }) // Clear userData cookie
      .json({
        message: "Logout successfully",
        success: true,
      });
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// ............................................. UPDATE PROFILE.....................................

const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name && !email && !password && !req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "No fields to update",
        success: false,
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
        success: false,
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (profilePicture) user.profilePicture = profilePicture;

    const updatedUser = await user.save();

    res.status(StatusCodes.OK).json({
      message: "Profile updated successfully",
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating profile",
      success: false,
    });
  }
};

// Middleware for profile picture upload
const updateProfileWithPicture = [
  upload.single("profilePicture"),
  updateAdminProfile,
];

// .................................................. FORGET PASSWORD...................................................

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      const error = new Error("no user found");
      error.statusCode = 404;
      throw error;
    }

    if (
      findUser.otp.otp &&
      new Date(findUser.otp.sendTime).getTime() > new Date().getTime()
    ) {
      const error = new Error(
        `please wait until ${new Date(
          findUser.otp.sendTime
        ).toLocaleTimeString()} `
      );
      error.statusCode = 404;
      throw error;
    }

    const otp = Math.floor(Math.random() * 90000) + 100000;
    console.log(otp);

    const token = crypto.randomBytes(32).toString("hex");

    findUser.otp.otp = otp;
    findUser.otp.sendTime = new Date().getTime() + 1 * 60 * 1000;
    findUser.otp.token = token;

    await findUser.save();

    sendMail(otp, email);

    res.status(200).json({
      message: "Please check your email for otp",
      status: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

//  ................................................... VERIFY OTP ...................................................

const verifyOtp = async (req, res, next) => {
  const { otp } = req.body;

  try {
    const findUser = await User.findOne({ "otp.otp": otp });

    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }

    if (new Date(findUser.otp.sendTime).getTime() < new Date().getTime()) {
      return res.status(400).json({
        success: false,
        message: "Your otp has been expired",
      });
    }

    findUser.otp.otp = null;
    await findUser.save();

    res.status(200).json({
      status: true,
      message: "Otp verified",
    });
  } catch (error) {
    next(error);
  }
};

// ............................................. GET OTP TIME.......................................................

const getOtpTime = async (req, res, next) => {
  const { token } = req.body;

  try {
    const findUser = await User.findOne({ "otp.token": token }).select("otp");

    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }

    res.status(200).json({
      status: true,
      message: "success",
      sendTime: findUser.otp.sendTime,
    });
  } catch (error) {
    next(error);
  }
};

// ........................................... UPDATE PASSWORD ...................................................

const updatePassword = async (req, res, next) => {
  const { password, cfpassword, token } = req.body;

  try {
    const findUser = await User.findOne({ "otp.token": token });

    if (!findUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (
      new Date(findUser.otp.sendTime).getTime() + 5 * 60 * 1000 <
      new Date().getTime()
    ) {
      return res.status(400).json({
        message: "Something went wrong",
        success: false,
      });
    }

    if (password !== cfpassword) {
      return res.status(400).json({
        message: "password does not match",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    findUser.password = hashedPassword;
    findUser.otp.sendTime = null;
    findUser.otp.token = null;
    await findUser.save();

    res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ...................................................... RESET PASSWORD ..............................................

const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const token = req.body.token || req.headers["authorization"]?.split(" ")[1]; // Get token from body or header

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  if (!newPassword) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash and update the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  registerWithProfilePicture,
  updateProfileWithPicture,
  
  resetPassword,
  forgetPassword,
  updatePassword,
  verifyOtp,
  getOtpTime,
};
