import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary, { uploadOnCloudinary } from "../config/cloudinary.js";
import {User} from "../models/userModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";
import validator from "validator";

const registerUser = async (req, res) => {
  console.log("Registering user with data:", req.body);
  const {
    name,
    email,
    gender,
    password,
    rollNumber,
    hostel,
    roomNumber,
    department,
    mobile,
  } = req.body;

  try {
    console.log("Checking for existing user...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists.");
      return res.status(400).json({ message: "User already exists." });
    }

    const existingRollNumber = await User.findOne({ rollNumber });
    if (existingRollNumber) {
      return res
        .status(400)
        .json({ message: "Student with this Roll Number already exists." });
    }

    if (!validator.isEmail(email)) {
      console.log("Invalid email format.");
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email." });
    }
    if (password.length < 8) {
      console.log("Password is too short.");
      return res
        .status(400)
        .json({
          success: false,
          message: "Password should be at least 8 characters.",
        });
    }

    const avatarImage = req.files?.avatarImage?.[0];
    const qrCodeImage = req.files?.qrCodeImage?.[0];

    console.log("Uploaded files:", req.files);

    let avatarImageUrl = null;
    let qrCodeImageUrl = null;

    if (avatarImage) {
      console.log("Uploading avatar image to Cloudinary...");
      const avatarUploadResponse = await uploadOnCloudinary(avatarImage.path);
      console.log("Uploaded avatar image:", avatarUploadResponse)
      if (avatarUploadResponse) {
        avatarImageUrl = avatarUploadResponse.secure_url;
        console.log("Avatar image uploaded successfully:", avatarImageUrl);
      } else {
        console.log("Failed to upload avatar image.");
      }
    } else {
      console.log("No avatar image provided.");
    }

    if (qrCodeImage) {
      console.log("Uploading QR code image to Cloudinary...");
      const qrCodeUploadResponse = await uploadOnCloudinary(qrCodeImage.path);
      if (qrCodeUploadResponse) {
        qrCodeImageUrl = qrCodeUploadResponse.secure_url;
        console.log("QR code image uploaded successfully:", qrCodeImageUrl);
      } else {
        console.log("Failed to upload QR code image.");
      }
    } else {
      console.log("No QR code image provided.");
    }

    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed successfully.");

    const newUser = new User({
      name,
      email,
      gender,
      password: hashedPassword,
      department,
      rollNumber,
      hostel,
      roomNumber,
      mobile,
      avatarImage: avatarImageUrl,
      qrCodeImage: qrCodeImageUrl,
      createdAt: Date.now(),
    });

    console.log("Saving new user to database...");
    await newUser.save();
    console.log("User saved successfully:", newUser);

    const token = createToken(newUser._id);
    console.log("Token created successfully:", token);

    res
      .status(201)
      .json({ success: true, token, message: "Registration successful!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
const forgotPassword = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: " , OTP for Password Reset",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email" });
    } else {
      return res.status(200).json({ message: "OTP sent to email" });
    }
  });
};
const verifyOtp = (req, res) => {
  const { email, otp, verificationOTP } = req.body;

  if (otp === verificationOTP)
    return res.status(200).json({ message: "OTP verified!" });

  return res.status(400).json({ message: "Invalid or expired OTP." });
};

const changeForgottenPassword = async (req, res) => {
  const { email } = req.params;
  const { newPassword } = req.body;
  console.log("Changing password for email:", email);
  console.log("New password received:", newPassword);

  try {
    if (!newPassword || newPassword.length < 8) {
      console.log("Password validation failed.");
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log("Hashed password:", hashedPassword);

    user.password = hashedPassword;
    await user.save();
    console.log("Password updated successfully for user:", email);

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.json({ success: false, message: "Incorrect password" });

    const token = createToken(user._id);
    res.json({ success: true, message: "Logged in successfully", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error", error: error.message });
  }
};

const fetchUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes authMiddleware attaches user info to req object
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchUserProfileByRollNumber = async (req, res) => {
  const { rollNumber } = req.params;

  if (!rollNumber)
    return res.status(400).json({ message: "Roll number is required." });

  try {
    const user = await User.findOne({ rollNumber });
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile by roll number:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUserData = {};

    // if (req.body.roomNumber) {
    //   updatedUserData.roomNumber = req.body.roomNumber;
    // }

    // if (req.body.hostel) {
    //   updatedUserData.hostel = req.body.hostel;
    // }

    console.log(req.files?.avatarImage?.[0]);


    if (req.files && req.files.avatarImage) {
      const avatarImage = req.files.avatarImage[0];
      try {
        const avatarUpload = await cloudinary.v2.uploader.upload(
          avatarImage.path,
          {
            folder: "avatars",
          }
        );

        updatedUserData.avatarImage = avatarUpload.secure_url;
      } catch (error) {
        console.log("Error uploading to Cloudinary: ", error);
        return res
          .status(500)
          .json({ message: "Error uploading avatar image." });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedUserData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error." });
  }
};


const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Compare current password with the stored password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect." });
    }

    // Validate the new password
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password must be at least 8 characters long.",
        });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const deleteUserAndMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.avatarImage)
      await cloudinary.v2.uploader.destroy(user.avatarImage);
    if (user.qrCodeImage)
      await cloudinary.v2.uploader.destroy(user.qrCodeImage);

    if (user.qrCodeImage) {
      const qrCodePublicId = user.qrCodeImage.split("/").pop().split(".")[0]; // Extract public ID
      await cloudinary.v2.uploader.destroy(qrCodePublicId);
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const updateCheckedInStatus = async (req, res) => {
  const { email, status } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.checkedIn = status;
    await user.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "User status updated successfully",
        user,
      });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const sendWelcomeEmail = async (req, res) => {
  const { email, name } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Our Service",
    text: `Hi ${name}, welcome to our service! We are glad to have you.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .send({ success: true, message: "Welcome email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to send welcome email." });
  }
};

// const handleForgotPassword = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send({ success: false, message: 'Email not found.' });
//     }

//     const resetToken = 'token';
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Password Reset',
//       text: `To reset your password, please use this token: ${resetToken}`,
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).send({ success: true, message: 'Password reset email sent.' });
//   } catch (error) {
//     console.error("Error during forgot password:", error);
//     res.status(500).send({ success: false, message: 'Failed to send password reset email.' });
//   }
// };

const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    console.log("total users from backend:", totalUsers);
    res.status(200).json({ totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user count", error });
  }
};

export {
  changeForgottenPassword,
  verifyOtp,
  forgotPassword,
  sendWelcomeEmail,
  loginUser,
  registerUser,
  getTotalUsers,
  deleteUserAndMedia,
  fetchUserProfile,
  fetchUserProfileByRollNumber,
  changeUserPassword,
  updateUserProfile,
  updateCheckedInStatus,
};
