import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  availed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true 
});

const Meal = mongoose.model('Meal', mealSchema);

export default Meal;
