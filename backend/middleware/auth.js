import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect route
// if user is authenticated then give access
export const protectRoute = async (req, res, next) => {
  //  next is the next controller function
  try {
    // Check for token in Authorization header or custom token header
    let token = req.headers.authorization;

    if (!token) {
      token = req.headers.token; // Fallback to old approach
    } // "Bearer token"
    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }
    // Removing "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protect route", error);
    res.json({ success: false, message: error.message });
  }
};
