import express from 'express'

const bookingRouter = express.Router();

import {
  getAllBookings,
  getBookingsByEmail,
  addBooking,
  deleteBooking,
  updateStatus,
} from '../controllers/bookingController.js';

/**
 * @swagger
 * /api/booking/all:
 *   get:
 *     summary: Get All Bookings
 *     description: Retrieve all meal bookings
 *     tags: [Booking Management]
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 */
bookingRouter.get('/all', getAllBookings);

/**
 * @swagger
 * /api/booking/{email}:
 *   get:
 *     summary: Get User Bookings
 *     description: Retrieve bookings by user email
 *     tags: [Booking Management]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User bookings retrieved successfully
 */
bookingRouter.get('/:email', getBookingsByEmail);

/**
 * @swagger
 * /api/booking/add:
 *   post:
 *     summary: Add Booking
 *     description: Create a new meal booking
 *     tags: [Booking Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mealType:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
bookingRouter.post('/add', addBooking);

/**
 * @swagger
 * /api/booking/delete/{id}:
 *   delete:
 *     summary: Delete Booking
 *     description: Cancel a booking by ID
 *     tags: [Booking Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 */
bookingRouter.delete('/delete/:id', deleteBooking);

/**
 * @swagger
 * /api/booking/updateStatus/{id}:
 *   put:
 *     summary: Update Booking Status
 *     description: Update the status of a booking (Approved/Rejected)
 *     tags: [Booking Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Approved, Rejected, Pending]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
bookingRouter.put('/updateStatus/:id', updateStatus);

export default bookingRouter;