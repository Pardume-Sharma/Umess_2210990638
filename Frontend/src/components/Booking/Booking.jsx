import { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Booking.css";
import { StoreContext } from "../context/StoreContext";

const Booking = () => {
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    time: "",
    venue: "",
    description: "",
    date: "",
    member: 1,
    mealType: "", // **1. Add meal type to state**
  });
  const { token, userProfile, url } = useContext(StoreContext);
  const [showDescription, setShowDescription] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(true);

  useEffect(() => {
    const fetchBookingsByEmail = async () => {
      const userEmail = localStorage.getItem("email");
      try {
        const response = await axios.get(`${url}/api/booking/${userEmail}`);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching user bookings", error);
      }
    };
    fetchBookingsByEmail();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
    if (name === "venue" && value === "Others") {
      setShowDescription(true);
    } else if (name === "venue") {
      setShowDescription(false);
    }
  };

  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    let amPm = "AM";
    hours = parseInt(hours, 10);
    if (hours >= 12) {
      amPm = "PM";
      if (hours > 12) {
        hours -= 12;
      }
    } else if (hours === 0) {
      hours = 12;
    }
    return `${hours}:${minutes} ${amPm}`;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-US", options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in to make a booking");
      return;
    }
    if (userProfile.name !== bookingData.name) {
      alert("Incorrect Name.");
      return;
    }
    const today = new Date().toISOString().split("T")[0];

    if (bookingData.date < today) {
      alert("You cannot select a past date. Please select a valid date.");
      return;
    }

    const userEmail = localStorage.getItem("email");
    const formattedTime = convertTo12HourFormat(bookingData.time);
    const formattedDate = formatDate(bookingData.date);

    try {
      const response = await axios.post(`${url}/api/booking/add`, {
        ...bookingData,
        time: formattedTime,
        email: userEmail,
        member: bookingData.member,
        date: formattedDate,
      });
      setBookings([...bookings, response.data]);
      setBookingData({
        name: "",
        time: "",
        venue: "",
        description: "",
        date: "",
        member: 0,
        mealType: "", // Reset meal type after submission
      });
      setShowDescription(false);
      alert("Booking added successfully");
    } catch (error) {
      console.error("Error adding booking", error);
      alert("Failed to add booking. Please try again.");
    }
  };

  const handleStatusChange = async (id) => {
    let status = "Cancelled";
    try {
      await axios.put(`${url}/api/booking/updateStatus/${id}`, { status });
      setBookings(
        bookings.map((booking) =>
          booking._id === id ? { ...booking, status } : booking
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const toggleBookings = () => {
    setShowBookings(!showBookings);
  };
  
  if(userProfile && token && userProfile.role === "Student")
    return <></>;
  return (
    <div className="booking-container font-wight:400">
      <h2>Book a Venue</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          value={bookingData.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          name="date"
          value={bookingData.date}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          required
        />
        <label htmlFor="time">Time:</label>
        <input
          type="time"
          name="time"
          value={bookingData.time}
          onChange={handleChange}
          required
        />
        <label htmlFor="venue">Venue:</label>
        <select
          name="venue"
          value={bookingData.venue}
          onChange={handleChange}
          required
        >
          <option value="">--Select a venue--</option>
          <option value="The Dhaba">The Dhaba</option>
          <option value="Square One">Square One</option>
          <option value="Guest House">Guest House</option>
          <option value="Others">Others</option>
        </select>

        {showDescription && (
          <>
            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              placeholder="Enter Description for the venue"
              value={bookingData.description}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* **2. Add Meal Type Dropdown** */}
        <label htmlFor="mealType">Meal Type:</label>
        <select
          name="mealType"
          value={bookingData.mealType}
          onChange={handleChange}
          required
        >
          <option value="">--Select a meal type--</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Snacks">Snacks</option>
          <option value="Dinner">Dinner</option>
        </select>
        <label htmlFor="member">Number of Members:</label>
        <input
          type="number"
          name="member"
          value={bookingData.member}
          onChange={handleChange}
          required
          min="1"
          max="100"
        />
        <button type="submit" className="btn-class">
          Submit
        </button>
        {token && (
          <button type="button" onClick={toggleBookings} className="btn-class">
            {showBookings ? "Hide Bookings" : "Show Bookings"}
          </button>
        )}
      </form>
      {showBookings && token && (
        <div className="bookings-list">
          <h3>Your Bookings</h3>
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div className="booking-card" key={booking._id}>
                <h4>{booking.name}</h4>
                <p>
                  <strong>Venue:</strong> {booking.venue}
                </p>

                <p>
                  <strong>No. of members:</strong> {booking.member}
                </p>
                <p>
                  <strong>Date:</strong> {booking.date}
                </p>
                <p>
                  <strong>Time:</strong> {booking.time}
                </p>
                <p>
                  <strong>Meal Type:</strong> {booking.mealType}{" "}
                </p>
                <p>
                  <strong>Status:</strong> {booking.status}
                </p>
                {booking.description && (
                  <p>
                    <strong>Description:</strong> {booking.description}
                  </p>
                )}
                <button
                  className={booking.status === "Cancelled" ? "disabled" : ""}
                  onClick={() => handleStatusChange(booking._id)}
                  disabled={booking.status === "Cancelled"}
                >
                  {booking.status === "Cancelled" ? "Cancelled" : "Cancel"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
