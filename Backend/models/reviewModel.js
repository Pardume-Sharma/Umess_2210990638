import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true },
    reviewText: { type: String, required: true },
    name: { type: String, required: true }, // Add user's name
    hostel: { type: String, required: true }, // Add user's hostel
    roomNumber: { type: String, required: true }, // Add user's room number
    emailId: { type: String, required: true }, // Add user's email ID
    submittedAt: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
