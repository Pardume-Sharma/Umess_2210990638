// models/BookingModel.js

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {  
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {  
    type: String,
    required: true,
  },
  mealType: {  
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'],
  },
  member: {
    type: Number,
    required: true,
    min: [1, 'At least one member is required'],
    max: [100, 'Number of members cannot exceed 100'], // Adjust as needed
  },
  status: {  
    type: String,
    default: 'Pending', 
    enum: ['Pending', 'Approved', 'Rejected'], // Ensuring consistent status values
  },
  createdAt: {
    type: String, 
    default: () => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date().toLocaleDateString('en-US', options);
    },
    immutable: true, 
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
