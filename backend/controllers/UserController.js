import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// sign up user
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      // if any data is missing, don't sign up

      return res.json({ success: false, message: "Missing details" });
    }

    // if all data present, then create user
    // before creating, check if email already present

    const user = await User.findOne({ email });

    if (user) {
      // if email present, don't create
      return res.json({ success: false, message: "Email already exists" });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating new user in mongodb
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    // now creating token for the user to authenticate

    const token = generateToken(newUser._id);

    return res.json({
      success: true,
      userData: newUser,
      message: "Account created successfully",
    });
  } catch (err) {
    console.log("Error creating user ", err);
    return res.json({ success: false, message: err.message });
  }
};

// login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // check if password is same
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);

    return res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.log("Error creating user ", err);
    return res.json({ success: false, message: err.message });
  }
};

// controller to check if user is authenticated
export const checkAuth = (req, res) => {
  return res.json({ success: true, user: req.user });
};

// function to update user profile details

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;

    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("Error ", error);

    res.json({ success: false, message: error.message });
  }
};
