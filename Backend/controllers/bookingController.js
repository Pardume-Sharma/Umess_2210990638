import Booking from '../models/bookingModel.js';

// Fetch all bookings (for admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find(); // Fetch all bookings
    res.status(200).json(bookings); // Return bookings directly
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bookings', error });
  }
};

// Fetch bookings by user email
export const getBookingsByEmail = async (req, res) => {
    const { email } = req.params;
    try {
      const bookings = await Booking.find({ email }); // Find bookings by email
      res.status(200).json(bookings); // Return bookings directly (as an array)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bookings by email', error });
    }
  };
  

export const addBooking = async (req, res) => {
  const { name, time, mealType, venue, description, email, date,member } = req.body; // Include date
  if(!member || member<1)
    return res.status(400).json({ message: 'Number of members must be at least 1' });
  try {
    const newBooking = new Booking({
      name,
      time,
      venue,
      mealType,
      description,
      email,
      date, 
      member,
      status: 'Pending',
    });

    await newBooking.save();
    res.status(201).json(newBooking); // Return the newly created booking
  } catch (error) {
    res.status(500).json({ message: 'Error adding booking', error });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error });
  }
};

// Update booking status
export const updateStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status; // Update the booking status
    await booking.save();

    res.status(200).json({ message: 'Status updated successfully', booking }); // Return updated booking
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
};
