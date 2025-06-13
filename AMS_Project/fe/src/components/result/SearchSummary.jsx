import React, { useState } from "react";

const SearchSummary = ({ departure, destination, date, adult, flightCount, minPrice }) => {
  const [showSummary, setShowSummary] = useState(false);

  const handleViewSummary = () => {
    setShowSummary(true);
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
  };

  return (
    <div className="search-summary">
      <h3>Search summary</h3>
      <p>Get a quick overview of how the number of stops affects prices for your search</p>
      <button className="view-summary-btn" onClick={handleViewSummary}>
        View summary
      </button>

      {showSummary && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseSummary}>×</button>
            <h3>Automated search summary</h3>
            {/* <p><strong>Departure:</strong> {departure}</p>
            <p><strong>Destination:</strong> {destination}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Adults:</strong> {adult}</p> */}
            <p>
              Your search from {departure} to {destination} on {date} for {adult} adult{adult > 1 ? "s" : ""} found {flightCount} flights. 
              Prices start from VND {minPrice.toLocaleString('vi-VN')}, offering a range of options to suit your needs. 
              Consider sorting by price or duration to find the best fit for your travel preferences.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSummary;
