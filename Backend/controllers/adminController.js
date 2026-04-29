import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary, { uploadOnCloudinary } from "../config/cloudinary.js";
import nodemailer from "nodemailer";
import dotenv from 'dotenv'
import crypto from 'crypto';
const otps = {};

dotenv.config();
export const register = async (req, res) => {
  console.log("Registering admin: ", req.body);
  const { employeeID, name, email, password, confirmPassword, role } = req.body;
  console.log("bdsjhghjsg", req.body);
  try {
    if (!employeeID || !name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existingID = await Admin.findOne({ employeeID });
    if (existingID) {
      return res
        .status(400)
        .json({ message: "Admin with this employee ID already exists." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match." });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists." });
    }

    const avatarImage = req.files?.avatarImage?.[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarImageUrl = null;
    if (avatarImage) {
      console.log("Uploading avatar image to Cloudinary...");
      const avatarUploadResponse = await uploadOnCloudinary(avatarImage.path);
      if (avatarUploadResponse) {
        avatarImageUrl = avatarUploadResponse.secure_url;
        console.log("Avatar image uploaded successfully:", avatarImageUrl);
      } else {
        console.log("Failed to upload avatar image.");
      }
    } else {
      console.log("No avatar image provided.");
    }

    const newAdmin = new Admin({
      employeeID,
      name,
      email,
      password: hashedPassword,
      role: "admin",
      avatarImage: avatarImageUrl,
    });

    await newAdmin.save();

    const token = createToken(newAdmin._id);

    res.status(201).json({
      message: "Admin registered successfully.",
      admin: {
        id: newAdmin._id,
        employeeID: newAdmin.employeeID,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
      token, // Include token if you want the admin to be logged in immediately
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};
export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUserData = {};

    if (req.files && req.files.avatarImage) {
      const avatarImage = req.files.avatarImage[0];
      try {
        const avatarUpload = await cloudinary.v2.uploader.upload(avatarImage.path, {
          folder: "avatars", 
        });
        
        updatedUserData.avatarImage = avatarUpload.secure_url;
      } catch (error) {
        console.log("Error uploading to Cloudinary: ", error);
        return res.status(500).json({ message: 'Error uploading avatar image.' });
      }
    }

    const updatedUser = await Admin.findByIdAndUpdate(userId, updatedUserData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Profile updated successfully', updatedUser });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const login = async (req, res) => {
  console.log("Logging in admin: ", req.body);
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = createToken(admin._id);
  res.status(200).json({ token, message: "Login successful" });
};
export const changeForgottedPassword = async (req, res) => {
  const { email } = req.params;
  const { newPassword} = req.body; 
  console.log("new password",newPassword)

  try {
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
    }

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
export const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await Admin.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect." });
    }

    // Validate the new password
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
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

export const forgotPassword = async (req, res) => {
  const { email,otp } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: " , OTP for Password Reset",
    text: `Your OTP is: ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email" });
    } else {
      return res.status(200).json({ message: "OTP sent to email" });
    }
  });
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching admins" });
  }
};

export const updateAdminApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.status = !admin.status;
    await admin.save();

    res.status(200).json({ message: "Admin status updated", admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating admin status" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting admin" });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    console.log(req.user);
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching admin profile" });
  }
};

export const updateAdminRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.role = role;
    await admin.save();

    res.status(200).json({ message: "Admin role updated", admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating admin role" });
  }
};

export const verifyOtp = (req, res) => {
  const { email, otp, verificationOTP } = req.body;

    if(otp === verificationOTP)
      return res.status(200).json({ message: 'OTP verified!' });

  return res.status(400).json({ message: 'Invalid or expired OTP.' });
}
