import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  employeeID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  status: { type: Boolean, default: false },
  avatarImage: { type: String },
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
