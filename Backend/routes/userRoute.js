import express from "express";
import {
  fetchUserProfile,
  fetchUserProfileByRollNumber,
  deleteUserAndMedia,
  sendWelcomeEmail,
  loginUser,
  registerUser,
  updateUserProfile,
  changeUserPassword,
  forgotPassword,
  verifyOtp,
  changeForgottenPassword,
  updateCheckedInStatus,
  getTotalUsers,
} from "../controllers/userController.js";
import { uploadFields, uploadFieldsForProfileUpdate } from "../middleware/multerMiddleware.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register New User
 *     description: Create a new user account with profile details
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - rollNumber
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               rollNumber:
 *                 type: string
 *               hostel:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
userRouter.post(
  "/register",
  (req, res, next) => {
    uploadFields(req, res, (error) => {
      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
      next();
    });
  },
  registerUser
);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate user and get access token
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
userRouter.post("/login", loginUser);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get User Profile
 *     description: Retrieve authenticated user's profile information
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.get("/profile", authMiddleware, fetchUserProfile);

/**
 * @swagger
 * /api/user/forgotPassword:
 *   post:
 *     summary: Request Password Reset
 *     description: Send OTP to user's email for password reset
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
userRouter.post("/forgotPassword", forgotPassword);

userRouter.put("/verifyOtp", verifyOtp);
userRouter.put('/changeForgottenPassword/:email', changeForgottenPassword);
userRouter.post("/email/welcome", sendWelcomeEmail);
userRouter.put(
  "/updateProfile",
  authMiddleware,
  (req, res, next) => {
    uploadFieldsForProfileUpdate(req, res, (error) => {
      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
      next();
    });
  },
  updateUserProfile
);
userRouter.put("/password", authMiddleware, changeUserPassword);
userRouter.patch("/updateCheckedInStatus", updateCheckedInStatus);
userRouter.delete("/delProfile/:id", deleteUserAndMedia);
userRouter.get("/totalUsers", getTotalUsers);

export default userRouter;
