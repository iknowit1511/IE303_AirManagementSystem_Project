import React from "react";

const BookingForm = ({ booking, onSave, onCancel, isViewOnly }) => {
  const [formData, setFormData] = React.useState(booking || {
    bookingId: "",
    userNameId: "",
    flightId: "",
    ticketQuantity: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="booking-form-overlay">
      <div className="booking-form-container">
        <h3>{isViewOnly ? "View Booking" : booking ? "Edit Booking" : "Add New Booking"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Booking ID</label>
            <input
              type="text"
              name="bookingId"
              value={formData.bookingId}
              onChange={handleChange}
              disabled={isViewOnly}
              required
            />
          </div>
          <div className="form-group">
            <label>User Name (ID)</label>
            <input
              type="text"
              name="userNameId"
              value={formData.userId}
              onChange={handleChange}
              disabled={isViewOnly}
              required
            />
          </div>
          <div className="form-group">
            <label>Flight ID</label>
            <input
              type="text"
              name="flightId"
              value={formData.flightId}
              onChange={handleChange}
              disabled={isViewOnly}
              required
            />
          </div>
          <div className="form-group">
            <label>Ticket Quantity</label>
            <input
              type="number"
              name="ticketQuantity"
              value={formData.ticketQuantity}
              onChange={handleChange}
              disabled={isViewOnly}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.bookingStatus}
              onChange={handleChange}
              disabled={isViewOnly}
              required
            >
              <option value="">Select Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          {!isViewOnly && (
            <button type="submit" className="save-btn">
              Save
            </button>
          )}
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;