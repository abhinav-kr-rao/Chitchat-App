import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect route
// if user is authenticated then give access
const secretKey = process.env.JWT_SECRET;
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

    // console.log('line 20 success');

    // Removing "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }
    // console.log('Token received:', token)
    const decoded = jwt.verify(token, secretKey);

    // console.log('decoded is ', decoded);

    // console.log('line 26 success');

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protect route", error);
    res.json({ success: false, message: error.message });
  }
};
