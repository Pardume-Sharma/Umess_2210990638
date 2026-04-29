import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  day: { type: String, required: true },
  mealType: { type: String, required: true },
  menu: { type: String, required: true },
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
