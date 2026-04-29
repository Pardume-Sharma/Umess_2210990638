import Review from "../models/reviewModel.js";

export const submitReview = async (req, res) => {
    const { rollNumber, reviewText, name, hostel, roomNumber, emailId } = req.body;
    console.log("skfh",req.body)
    if (!rollNumber || !reviewText || !name || !hostel || !roomNumber || !emailId) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const review = new Review({
            rollNumber,
            reviewText,
            name,
            hostel,
            roomNumber,
            emailId
        });

        // Save the review to the database
        const savedReview = await review.save();
        res.status(201).json({ success: true, message: "Review submitted successfully", review: savedReview });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to submit review", error });
    }
};


export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve reviews", error });
    }
};

export const deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedReview = await Review.findByIdAndDelete(id);
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        } else {
            // Send a success response without calling getAllReviews
            return res.status(200).json({ message: "Review deleted successfully" });
        }
    } catch (error) {
        console.error("Error deleting review", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
