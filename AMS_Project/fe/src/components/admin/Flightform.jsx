import React from "react";

const FlightForm = ({ flight, onSave, onCancel, isViewOnly }) => {
  const [formData, setFormData] = React.useState(flight || {
    flightId: "",
    flightCode: "",
    airline: "",
    symbol: "",
    takeoffDate: "",
    takeoffTime: "",
    landingDate: "",
    landingTime: "",
    originalPrice: "",
    tax: "",
    totalPrice: "",
    seatClass: "",
    departureProvinceId: "",
    destinationProvinceId: "",
    duration: "",

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
    <div className="flight-form-overlay">
      <div className="flight-form-container">
        <h3>{isViewOnly ? "View Flight" : flight ? "Edit Flight" : "Add New Flight"}</h3>
        

        <form onSubmit={handleSubmit}>
          <div
              className="form-fields-container"
              style={{
                maxHeight: "300px", // Adjust height as needed
                overflowY: "auto", // Enable vertical scrolling
              }}
            >
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
              <label>Flight Code</label>
              <input
                type="text"
                name="flightCode"
                value={formData.flightCode}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            <div className="form-group">
              <label>Airline</label>
              <input
                type="text"
                name="airline"
                value={formData.airline}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            <div className="form-group">
              <label>Symbol</label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            <div className="form-group">
              <label>Takeoff Date</label>
              <input
                type="date"
                name="takeoffDate"
                value={formData.takeoffDate}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            <div className="form-group">
              <label>Takeoff Time</label>
              <input
                type="time_local"
                name="takeoffTime"
                value={formData.takeoffTime}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            <div className="form-group">
              <label>Landing Date</label>
              <input
                type="date"
                name="landingDate"
                value={formData.landingDate}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            <div className="form-group">
              <label>Landing Time</label>
              <input
                type="time_local"
                name="landingTime"
                value={formData.landingTime}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            <div className="form-group">
              <label>Original Price</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            <div className="form-group">
              <label>Tax</label>
              <input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            <div className="form-group">
              <label>Total Price</label>
              <input
                type="number"
                name="totalPrice"
                value={formData.totalPrice}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            <div className="form-group">
              <label>Seat Class</label>
              <select
                name="seatClass"
                value={formData.seatClass}
                onChange={handleChange}
                disabled={isViewOnly}
              >
                <option value="">Select Seat Class</option>
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First Class">First Class</option>
              </select>
            </div>
            <div className="form-group">
              <label>Departure Province</label>
              <input
                type="text"
                name="departureProvinceId"
                value={formData.departureProvinceId}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            <div className="form-group">
              <label>Destination Province</label>
              <input
                type="text"
                name="destinationProvinceId"
                value={formData.destinationProvinceId}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                disabled={isViewOnly}
                required
              />
            </div>
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

export default FlightForm;