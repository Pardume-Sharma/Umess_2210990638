import express from "express";
import { submitReview, getAllReviews,deleteReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

/**
 * @swagger
 * /api/review/submit:
 *   post:
 *     summary: Submit Review
 *     description: Submit a new review for mess service
 *     tags: [Review Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review submitted successfully
 */
reviewRouter.post("/submit", submitReview);

/**
 * @swagger
 * /api/review/all:
 *   get:
 *     summary: Get All Reviews
 *     description: Retrieve all submitted reviews
 *     tags: [Review Management]
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
reviewRouter.get("/all", getAllReviews);

/**
 * @swagger
 * /api/review/delete/{id}:
 *   delete:
 *     summary: Delete Review
 *     description: Remove a review by ID
 *     tags: [Review Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */
reviewRouter.delete("/delete/:id",deleteReview);

export default reviewRouter;