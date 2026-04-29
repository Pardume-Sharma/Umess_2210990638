import express from "express";
import {
  register,
  login,
  forgotPassword,
  getAllAdmins,
  verifyOtp,
  getAdminProfile,
  deleteAdmin,
  changeForgottedPassword,
  updateAdminApproval,
  updateAdminRole,
  changeUserPassword,
  updateAdminProfile
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/auth.js";
import { uploadFields } from "../middleware/multerMiddleware.js";

const adminRouter = express.Router();

// Admin Authentication Routes
adminRouter.post("/login", login);
adminRouter.post(
  "/register",
  (req, res, next) => {
    uploadFields(req, res, (error) => {
      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
      next();
    });
  },
  register
);
adminRouter.post("/forgotPassword", forgotPassword);
adminRouter.put("/verifyOtp", verifyOtp);

// Admin Management Routes
adminRouter.get("/profile", authMiddleware, getAdminProfile);
adminRouter.get("/all", getAllAdmins);
adminRouter.put("/changeForgottedPassword/:email", changeForgottedPassword);
adminRouter.put("/password", authMiddleware, changeUserPassword);
adminRouter.put("/approve/:id", updateAdminApproval);
adminRouter.delete("/delete/:id", deleteAdmin);
adminRouter.put("/role/:id", updateAdminRole);
adminRouter.put(
  "/updateProfile",
  authMiddleware,
  uploadFields,
  updateAdminProfile
);
export default adminRouter;
