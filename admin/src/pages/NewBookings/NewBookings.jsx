// src/components/NewBookings.js

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./NewBookings.css"; // Importing the updated CSS file
import { assets } from "../../assets/assets.js";
import { StoreContext } from "../../components/context/StoreContext.jsx";

const NewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [sortOrder, setSortOrder] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10; // Maximum 10 bookings per page
  const { url } = useContext(StoreContext);
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${url}/api/booking/all`);
      console.log("API Response:", response.data);
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilter = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleMonthChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedMonths(selected);
    setCurrentPage(1); // Reset to first page on month filter
  };

  // Uncomment and update handleDelete if you plan to enable booking deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/booking/delete/${id}`);
      setBookings(bookings.filter((booking) => booking._id !== id));
      alert("Booking deleted");
    } catch (error) {
      console.error("Error deleting booking", error);
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${url}/api/booking/updateStatus/${id}`, { status });
      fetchBookings(); // Refresh the bookings after status change
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Helper function to get month from createdAt
  const getMonth = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    return date.toLocaleString("default", { month: "long" });
  };

  // Generate a list of all 12 months
  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Calculate booking counts per month based on createdAt
  const bookingCounts = allMonths.map((month) => {
    const count = bookings.filter(
      (booking) => getMonth(booking.createdAt) === month
    ).length;
    return { month, count };
  });

  // Filtered and sorted bookings
  const filteredBookings = bookings
    .filter((booking) => {
      // Search Filter
      const matchesSearch = booking.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Status Filter
      const matchesStatus =
        filterStatus === "All" || booking.status === filterStatus;

      // Month Filter based on createdAt
      if (selectedMonths.length > 0) {
        const bookingMonth = getMonth(booking.createdAt);
        const matchesMonth = selectedMonths.includes(bookingMonth);
        return matchesSearch && matchesStatus && matchesMonth;
      }

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sorting based on createdAt date
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (sortOrder === "Latest") {
        return dateB - dateA; // Descending
      } else {
        return dateA - dateB; // Ascending
      }
    });

  // Pagination Logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  return (
    <div className="new-bookings-container">
      <h2>Manage Bookings</h2>

      <div className="filters">
        <div className="filter-item">
          <label htmlFor="search" className="filter-label">
            Search by Name:
          </label>
          <input
            id="search"
            type="text"
            placeholder="Enter name..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>
        <div className="selection-type-inputs">
          <div className="filter-item">
            <label htmlFor="status-filter" className="filter-label">
              Status:
            </label>
            <select
              id="status-filter"
              onChange={handleFilter}
              value={filterStatus}
              className="filter-select"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="sort-order" className="filter-label">
              Sort By:
            </label>
            <select
              id="sort-order"
              onChange={handleSortChange}
              value={sortOrder}
              className="sort-select"
            >
              <option value="Latest">Latest First</option>
              <option value="Oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="filter-item">
          <label htmlFor="month-filter" className="filter-label">
            Month:
          </label>
          <select
            id="month-filter"
            multiple
            value={selectedMonths}
            onChange={handleMonthChange}
            className="month-select"
          >
            {bookingCounts.map(({ month, count }) => (
              <option key={month} value={month}>
                {month} ({count})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bookings-list">
        {currentBookings.length > 0 ? (
          currentBookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <img
                className="cross-icon"
                src={assets.cross_icon}
                onClick={() => {
                  handleDelete(booking._id);
                }}
              />
              <div className="booking-info">
                <div className="booking-field">
                  <strong>Name:</strong> {booking.name}
                </div>
                <div className="booking-field">
                  <strong>Email:</strong> {booking.email}
                </div>
                <div className="booking-field">
                  <strong>Meal:</strong> {booking.mealType}
                </div>
                <div className="booking-field">
                  <strong>No of Members:</strong> {booking.member}
                </div>
                <div className="booking-field">
                  <strong>Venue:</strong> {booking.venue}
                </div>
                <div className="booking-field">
                  <strong>Time:</strong> {booking.date} {booking.time}
                </div>
                <div className="booking-field">
                  <p
                    className={
                      booking.status === "Approved"
                        ? "approved"
                        : booking.status === "Rejected"
                        ? "rejected"
                        : booking.status === "Pending"
                        ? "pending"
                        : "cancelled"
                    }
                  >
                    {booking.status}
                  </p>
                </div>
                {booking.description && (
                  <div className="booking-field">
                    <strong>Description:</strong> {booking.description}
                  </div>
                )}
                <div className="booking-field">
                  <strong>Created At:</strong> {booking.createdAt}
                </div>
              </div>

              {booking.status != "Cancelled" && (
                <div className="booking-actions">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      handleStatusChange(booking._id, e.target.value)
                    }
                    className="status-dropdown"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-bookings">No bookings found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`pagination-button ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewBookings;
