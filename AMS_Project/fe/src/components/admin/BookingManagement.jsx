import React, { useState, useEffect } from "react";
import BookingForm from "./BookingForm";
import apiService from "../../service/apiService"; // Assuming you have an apiService file

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await apiService.getAllBookings();
      setBookings(response.bookingList);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleAddBooking = () => {
    setSelectedBooking(null);
    setIsViewOnly(false);
    setShowForm(true);
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setIsViewOnly(false);
    setShowForm(true);
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsViewOnly(true);
    setShowForm(true);
  };

  const handleSaveBooking = async (formData) => {
    try {
      if (selectedBooking) {
        await apiService.updateBooking(selectedBooking.bookingId, formData);
      } else {
        await apiService.post("/bookings", formData);
      }
      fetchBookings();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedBooking(null);
  };

  const handleDeleteBooking = async (id) => {
    try {
      await apiService.deleteBooking(id);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="booking-management">
      <div className="booking-management-header">
        <h2>Booking Management</h2>
        <button className="new-btn" onClick={handleAddBooking}>New</button>
      </div>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User Name (ID)</th>
            <th>Flight ID</th>
            <th>Ticket Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.bookingId}>
              <td>{booking.bookingId}</td>
              <td>{booking.user}</td>
              <td>{booking.flightId}</td>
              <td>{booking.ticketQuantity}</td>
              <td>{booking.status}</td>
              <td>
                <button className="action-btn view-btn" onClick={() => handleViewBooking(booking)}>View</button>
                <button className="action-btn edit-btn" onClick={() => handleEditBooking(booking)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => handleDeleteBooking(booking.bookingId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <BookingForm
          booking={selectedBooking}
          onSave={handleSaveBooking}
          onCancel={handleCancel}
          isViewOnly={isViewOnly}
        />
      )}
    </div>
  );
};

export default BookingManagement;