import React from "react";
import "./FlightSearchModal.scss";

const FlightSearchModal = ({
  isOpen,
  onClose,
  flights,
  onSelectFlight,
  departureProvinceId,
  destinationProvinceId,
  takeoffDate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="flight-search-modal-overlay">
      <div className="flight-search-modal-content">
        <div className="flight-search-modal-header">
          <h3 className="flight-search-modal-title">Select a Flight</h3>
          <button className="flight-search-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="flight-search-modal-body">
          <div className="flight-search-modal-info">
            <p><strong>From:</strong> {departureProvinceId}</p>
            <p><strong>To:</strong> {destinationProvinceId}</p>
            <p><strong>Takeoff Date:</strong> {takeoffDate}</p>
          </div>
          {flights && flights.length > 0 ? (
            <div className="flight-search-modal-list">
              {flights.map((flight, index) => (
                <div key={index} className="flight-search-modal-item">
                  <div className="flight-search-modal-details">
                    <p><strong>Flight {flight.flightCode} ({flight.airline}):</strong></p>
                    <p>Takeoff: {flight.takeoffTime}</p>
                    <p>Landing: {flight.landingTime}</p>
                    <p>Price: {flight.totalPrice} VND / ticket</p>
                  </div>
                  <button
                    className="flight-search-modal-select-btn"
                    onClick={() => onSelectFlight(flight)}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="flight-search-modal-empty">No flights found for the selected criteria.</p>
          )}
        </div>
        <div className="flight-search-modal-footer">
          <button className="flight-search-modal-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchModal;

