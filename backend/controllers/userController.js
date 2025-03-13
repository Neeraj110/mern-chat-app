import axios from "axios";
import User from "../model/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { oauth2Client } from "../utils/googleClient.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const cookieOptions = {
  expiresIn: "30d",
  httpOnly: true,
  sameSite: "strict",
  secure: false,
};

const generateToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user.generateAccessToken();
};

export const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const avatar = req.file ? req.file.path : null;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const uploadedImg = avatar ? await uploadOnCloudinary(avatar) : null;

    if (avatar && !uploadedImg) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      avatar: uploadedImg?.secure_url || "",
      authType: "local",
    });

    if (!newUser) {
      return res.status(400).json({ message: "User registration failed" });
    }

    const user = await User.findById(newUser._id).select(
      "-password -__v -authType"
    );

    const token = await generateToken(user._id);

    return res.status(201).cookie("token", token, cookieOptions).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user = await User.findById(user._id).select("-password -__v -authType");
    const token = await generateToken(user._id);

    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({ message: "User logged in successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ message: "User logged out successfully" });
});

export const googleLogin = asyncHandler(async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code is required" });
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    console.log("userInfoResponse", userInfoResponse.data);

    const { email, name, picture } = userInfoResponse.data;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        authType: "google",
      });
    }

    user = await User.findById(user._id).select("-password -__v -authType");

    const token = await generateToken(user._id);

    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({ message: "User logged in successfully", user });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -__v  -authType"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User profile retrieved successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export const getallUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("-password -__v -authType");
    return res
      .status(200)
      .json({ message: "Users retrieved successfully", users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
