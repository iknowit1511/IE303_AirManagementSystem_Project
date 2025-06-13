import React, { useState, useEffect } from "react";
import FlightForm from "./Flightform";
import apiService from "../../service/apiService"; // Assuming apiService is in services folder

const FlightManagement = () => {
  const [flights, setFlights] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await apiService.getAllFlights();
      console.log("Fetched flights:", response); // Debug fetched flights
      
      setFlights(response.flightList);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  const handleAddFlight = async (formData) => {
    setSelectedFlight(null);
    setIsViewOnly(false);
    setShowForm(true);
    try {
      const response = await apiService.addFlight(formData);
      console.log("Flight created successfully:", response); // Debug response
    } catch (error) {
      console.error("Error adding flight:", error);
    }
  };

  const handleEditFlight = (flight) => {
    setSelectedFlight(flight);
    setIsViewOnly(false);
    setShowForm(true);
  };

  const handleViewFlight = (flight) => {
    setSelectedFlight(flight);
    setIsViewOnly(true);
    setShowForm(true);
    console.log("Viewing flight:", flight); // Debug selected flight
  };

  const handleSaveFlight = async (formData) => {
    try {
      console.log("Saving flight data:", formData); // Debug form data
      if (selectedFlight) {
        const response = await apiService.updateFlight(selectedFlight.flightId, formData);
        console.log("Flight updated successfully:", response); // Debug response
      } else {
        const response = await apiService.addFlight(
          formData, 
          formData.departureProvinceId, 
          formData.destinationProvinceId
        );
        console.log("Flight created successfully:", response); // Debug response
      }
      fetchFlights();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving flight:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedFlight(null);
  };

  const handleDeleteFlight = async (id) => {
    console.log("Deleting flight with ID:", id);
    try {
      await apiService.deleteFlight(id);
      fetchFlights();
    } catch (error) {
      console.error("Error deleting flight:", error);
    }
  };

  return (
    <div className="flight-management">
      <div className="flight-management-header">
        <h2>Flight Management</h2>
        <button className="new-btn" onClick={handleAddFlight}>New</button>
      </div>
      <table className="flight-table">
        <thead>
          <tr>
            <th>Flight ID</th>
            <th>Flight Code</th>
            <th>Airline</th>
            <th>Symbol</th>
            <th>Takeoff Date</th>
            <th>Takeoff Time</th>
            <th>Landing Date</th>
            <th>Landing Time</th>
            <th>Total Price</th>
            <th>Seat Class</th>
            <th>Departure Province</th>
            <th>Destination Province</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.flightId}>
              <td>{flight.flightId}</td>
              <td>{flight.flightCode}</td>
              <td>{flight.airline}</td>
              <td>{flight.symbol}</td>
              <td>{flight.takeoffDate}</td>
              <td>{flight.takeoffTime}</td>
              <td>{flight.landingDate}</td>
              <td>{flight.landingTime}</td>
              <td>{flight.totalPrice.toLocaleString()} VND</td>
              <td>{flight.seatClass}</td>
              <td>{flight.departureProvinceId}</td>
              <td>{flight.destinationProvinceId}</td>
              <td>
                <button className="action-btn view-btn" onClick={() => handleViewFlight(flight)}>View</button>
                <button className="action-btn edit-btn" onClick={() => handleEditFlight(flight)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => handleDeleteFlight(flight.flightId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <FlightForm
          flight={selectedFlight}
          onSave={handleSaveFlight}
          onCancel={handleCancel}
          isViewOnly={isViewOnly}
        />
      )}

    </div>
  );
};

export default FlightManagement;
