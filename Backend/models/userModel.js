import mongoose from "mongoose";
import axios from "axios";
import cron from "node-cron";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    avatarImage: { type: String },
    qrCodeImage: { type: String },
    department: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true }, // Added rollNumber
    hostel: { type: String },
    role: { type: String, default: "Student" },
    roomNumber: { type: String, required: true },
    mobile: { type: String, required: true },
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    snacks: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    checkedIn: { type: Boolean, default: false },
    breakfastTime: { type: String },
    lunchTime: { type: String },
    snacksTime: { type: String },
    dinnerTime: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

const User = mongoose.models.user || mongoose.model("user", userSchema);

const checkGithubEmailActive = async (email) => {
  try {
    const response = await axios.get(
      `https://api.github.com/search/users?q=${email}+in:email`
    );
    return response.data.total_count > 0;
  } catch (error) {
    console.error("Error checking GitHub email status:", error);
    return false;
  }
};

cron.schedule("0 0 1 * *", async () => {
  const users = await User.find({});
  users.forEach(async (user) => {
    const isActive = await checkGithubEmailActive(user.email);
    user.active = isActive;
    await user.save();
  });
  console.log("Monthly GitHub active status check complete.");
});

export { User, checkGithubEmailActive };
