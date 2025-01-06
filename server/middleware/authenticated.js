const mongoose = require("mongoose");
const User = require("../modals/auth");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];  // Get token from "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: "Token missing in Authorization header" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded token:", decoded);  // Optional for debugging

    if (!decoded) {
      return res.status(401).json({
        message: "Token is invalid",
        success: false,  // Fixed typo here
      });
    }

    req.userId = decoded.userId;  // Store userId in req object for use in subsequent handlers
    next();  // Proceed to next middleware/route handler
  } catch (err) {
    console.error("Token verification failed:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(401).json({ message: "Failed to authenticate token" });
  }
};

module.exports = authenticate;
