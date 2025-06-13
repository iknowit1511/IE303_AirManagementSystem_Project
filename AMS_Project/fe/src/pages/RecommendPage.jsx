import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../service/apiService";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Modal from "../components/recommend/Modal";
import FlightSearchModal from "../components/result/FlightSearchModal";
import "./RecommendationsPage.scss";

const RecommendationsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [cheapestFlights, setCheapestFlights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [attractionsCost, setAttractionsCost] = useState(0);
  const [numDays, setNumDays] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [departureProvinceId, setDepartureProvinceId] = useState("");
  const [destinationProvinceIds, setDestinationProvinceIds] = useState([]);
  const [ticketQuantity, setTicketQuantity] = useState(2);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [editFlightIndex, setEditFlightIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    departureProvinceId: "",
    destinationProvinceId: "",
    takeoffDate: "",
    daysAtDestination: 0,
  });
  const [isFlightSearchModalOpen, setIsFlightSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isEditingAll, setIsEditingAll] = useState(false);
  const scrollPositionRef = useRef(0); // Store scroll position
  const newFlightRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setDepartureProvinceId(params.get("departureProvinceId") || "HCM");
    setDestinationProvinceIds(params.get("destinationProvinceIds")?.split(",") || []);
    setStartDate(params.get("takeoffDate") || "");
    setEndDate(params.get("endDate") || "");
    setNumDays(parseInt(params.get("numDays")) || 1);
    setAttractionsCost(parseInt(params.get("price")) || 0);
    const locationsStr = params.get("locations") || "";
    try {
      const parsedLocations = JSON.parse(locationsStr);
      console.log("Parsed selectedLocations from query:", parsedLocations);
      setSelectedLocations(parsedLocations);
    } catch (err) {
      console.error("Error parsing locations from query:", err);
      setError("Failed to parse selected locations. Please try again.");
      setSelectedLocations([]);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await apiService.getAllProvinces();
        console.log("Provinces data from API:", data);
        setProvinces(data.provinceList || []);
      } catch (err) {
        console.error("Error fetching provinces:", err);
        setError("Failed to load province data. Please try again later.");
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiService.getUserProfile();
        console.log("User profile response:", response);
        if (response && response.usersDTO.userId) {
          setUserId(response.usersDTO.userId);
        } else {
          setError("Failed to retrieve user information. Please log in again.");
          navigate("/sign-in");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile. Please log in again.");
        navigate("/sign-in");
      }
    };
    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchCheapestFlights = async () => {
      if (isEditingAll) return;
      if (destinationProvinceIds.length === 0 || !startDate || !endDate) {
        setError("Invalid trip parameters.");
        setLoading(false);
        return;
      }
      if (provinces.length === 0) {
        console.log("Waiting for provinces data to load...");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.findCheapestFlightsForTrip(
          departureProvinceId,
          destinationProvinceIds,
          numDays,
          startDate,
          endDate
        );
        console.log("Cheapest flights response:", response);
        if (response.statusCode === 200) {
          setCheapestFlights(response);
        } else if (response.statusCode === 403) {
          setError("Access forbidden. Please check your permissions or log in again.");
          navigate("/sign-in");
        } else {
          setError(response.message || "Failed to fetch flight data.");
          setCheapestFlights(null);
        }
      } catch (err) {
        console.error("Error fetching cheapest flights:", err);
        if (err.response?.status === 403) {
          setError("Access forbidden. Please check your permissions or log in again.");
          navigate("/sign-in");
        } else {
          setError("Failed to fetch flight data. Please try again.");
          setCheapestFlights(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCheapestFlights();
  }, [departureProvinceId, destinationProvinceIds, numDays, startDate, endDate, provinces, navigate, isEditingAll]);

  const handleBookFlights = async () => {
    if (!cheapestFlights || !cheapestFlights.flightList || cheapestFlights.flightList.length === 0) {
      setModalTitle("Error");
      setModalMessage("No valid flights available to book.");
      setIsModalOpen(true);
      return;
    }
    if (ticketQuantity < 1) {
      setModalTitle("Error");
      setModalMessage("Please enter a valid ticket quantity (at least 1).");
      setIsModalOpen(true);
      return;
    }
    if (!userId) {
      setModalTitle("Authentication Error");
      setModalMessage("User information not available. Please log in again.");
      setIsModalOpen(true);
      navigate("/sign-in");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const bookingList = cheapestFlights.flightList
      .filter((flight) => flight.flightId && !(flight.departureProvinceId === "HCM" && flight.destinationProvinceId === "HCM" && flight.daysAtDestination === 2))
      .map((flight) => ({
        flightId: flight.flightId,
        ticketQuantity: parseInt(ticketQuantity),
      }));
      console.log("Booking list to be sent:", bookingList);
      const response = await apiService.bookMultipleFlights(userId, bookingList);
      console.log("Booking response:", response);
      if (response.statusCode === 200) {
        setModalTitle("Booking Successful");
        setModalMessage(
          "Your tickets have been booked but not paid yet.\nPlease go to Profile -> Booking History to complete the payment.\nThe page will redirect automatically in 5 seconds."
        );
        setIsModalOpen(true);
        setTimeout(() => {
          navigate("/profile", { state: { tab: "timeline" } });
        }, 5000);
      } else {
        setModalTitle("Booking Failed");
        setModalMessage(response.message || "Failed to book flights.");
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error booking flights:", err);
      setModalTitle("Booking Failed");
      setModalMessage("Failed to book flights. Please try again.");
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalMessage("");
  };

  const handleEditFlight = (index, flight) => {
    if (flight.departureProvinceId === "HCM" && 
        flight.destinationProvinceId === "HCM" && 
        flight.daysAtDestination === 2) {
      setModalTitle("Error");
      setModalMessage("Cannot edit a stay entry.");
      setIsModalOpen(true);
      return;
    }
    scrollPositionRef.current = window.scrollY;
    setEditFlightIndex(index);
    setEditForm({
      departureProvinceId: flight.departureProvinceId || "HN",
      destinationProvinceId: flight.destinationProvinceId || "",
      takeoffDate: flight.takeoffDate || "",
      daysAtDestination: flight.daysAtDestination || 0,
    });
  };

  const handleDeleteFlight = (index) => {
    if (!cheapestFlights || !cheapestFlights.flightList) return;
    const flight = cheapestFlights.flightList[index];
    if (flight.departureProvinceId === "HCM" && 
        flight.destinationProvinceId === "HCM" && 
        flight.daysAtDestination === 2) {
      setModalTitle("Error");
      setModalMessage("Cannot delete a stay entry.");
      setIsModalOpen(true);
      return;
    }
    scrollPositionRef.current = window.scrollY;
    setIsEditingAll(true);
    const updatedFlights = [...cheapestFlights.flightList];
    updatedFlights.splice(index, 1);
    setCheapestFlights({ ...cheapestFlights, flightList: updatedFlights });
    const updatedDestinationIds = updatedFlights.map(flight => flight.destinationProvinceId);
    setDestinationProvinceIds(updatedDestinationIds);
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchFlight = async () => {
    if (!editForm.departureProvinceId || !editForm.destinationProvinceId || !editForm.takeoffDate) {
      setModalTitle("Error");
      setModalMessage("Please fill in all required fields for the flight search.");
      setIsModalOpen(true);
      return;
    }

    const getProvinceId = (provinceName) => {
      const province = provinces.find((p) => p.provinceName === provinceName);
      return province ? province.provinceId : provinceName;
    };

    const departureId = getProvinceId(editForm.departureProvinceId);
    const destinationId = getProvinceId(editForm.destinationProvinceId);

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.searchFlights(departureId, destinationId, editForm.takeoffDate);
      const flightsData = response.data || response;

      if (!flightsData || (Array.isArray(flightsData) && flightsData.length === 0)) {
        setModalTitle("Search Failed");
        setModalMessage("No flights found for the selected criteria.");
        setIsModalOpen(true);
        return;
      }

      setSearchResults(flightsData);
      setIsFlightSearchModalOpen(true);
    } catch (err) {
      console.error("Error searching flights:", err);
      setModalTitle("Search Failed");
      setModalMessage("Failed to search for flights. Please try again.");
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const calculateNewDate = (baseDate, days) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + parseInt(days || 0));
    return date.toISOString().split("T")[0];
  };

  const handleSelectFlight = (selectedFlight) => {
    if (!cheapestFlights || !cheapestFlights.flightList) return;
    const updatedFlights = [...cheapestFlights.flightList];
    updatedFlights[editFlightIndex] = selectedFlight;

    const newDepartureId = selectedFlight.destinationProvinceId;
    setDepartureProvinceId(newDepartureId);

    const updatedDestinationIds = updatedFlights
      .map(flight => flight.destinationProvinceId)
      .filter(id => id !== selectedFlight.destinationProvinceId);
    setDestinationProvinceIds(updatedDestinationIds);

    if (editFlightIndex > 0) {
      const prevFlight = updatedFlights[editFlightIndex - 1];
      const newStartDate = calculateNewDate(prevFlight.takeoffDate, prevFlight.daysAtDestination);
      setStartDate(newStartDate);
      updatedFlights[editFlightIndex].takeoffDate = newStartDate;
    } else {
      setStartDate(selectedFlight.takeoffDate);
    }

    setEndDate(updatedFlights[updatedFlights.length - 1].landingTime.split(" ")[0]);

    setCheapestFlights({ ...cheapestFlights, flightList: updatedFlights });
    setEditFlightIndex(null);
    setIsFlightSearchModalOpen(false);
    setIsEditingAll(true);
  };

  const handleEditAllFlights = () => {
    scrollPositionRef.current = window.scrollY;
    setIsEditingAll(true);
    setEditFlightIndex(null);
  };

  const handleAddFlight = () => {
    if (!cheapestFlights || !cheapestFlights.flightList) return;
  
    // Create a new flight object
    const newFlight = {
      departureProvinceId: departureProvinceId || "HCM",
      destinationProvinceId: "",
      takeoffDate: "",
      takeoffTime: "",
      landingTime: "",
      totalPrice: 0,
      daysAtDestination: 0,
      flightCode: `NewFlight-${cheapestFlights.flightList.length + 1}`,
      airline: "Unknown",
    };
  
      // Insert the new flight before the last flight (return flight) if it exists
    const updatedFlights = [...cheapestFlights.flightList];

    // Check if the last flight is a return flight
    const isLastFlightReturn = updatedFlights[updatedFlights.length - 1]?.destinationProvinceId === "HCM";

    // Determine the insert index
    const insertIndex = isLastFlightReturn ? updatedFlights.length - 1 : updatedFlights.length;

    // Insert the new flight at the determined index
    updatedFlights.splice(insertIndex, 0, newFlight);
  
    // Update the flight list and destination IDs
    setCheapestFlights({ ...cheapestFlights, flightList: updatedFlights });
  
    const updatedDestinationIds = updatedFlights
      .map((flight) => flight.destinationProvinceId)
      .filter((id) => id);
    setDestinationProvinceIds(updatedDestinationIds);
  
    // Set editing mode for the newly added flight
    setEditFlightIndex(insertIndex);
    setIsEditingAll(true);
  
    // Scroll to the new flight
    setTimeout(() => {
      if (newFlightRef.current) {
        newFlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
  };
  useEffect(() => {
    window.scrollTo(0, scrollPositionRef.current);
  }, [isEditingAll, editFlightIndex ]);

  if (loading) {
    return (
      <div className="recommendations-page section">
        <Navbar />
        <div className="container">
          <div className="loading">Loading recommendations...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-page section">
        <Navbar />
        <div className="container">
          <div className="error">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="recommendations-page section">
      <Navbar />
      <div className="container">
        <h2 className="recommendations-page__title">Your Trip Recommendations</h2>
        <div className="recommendations-page__content">
          <div className="recommendations-page__summary">
            <h3 className="recommendations-page__subtitle">Trip Summary</h3>
            <p><strong>Start Date:</strong> {startDate}</p>
            {!isEditingAll && (
              <>
                <p><strong>End Date:</strong> {endDate}</p>
                <p><strong>Number of Days:</strong> {numDays}</p>
              </>
            )}
            <p><strong>Attractions Cost:</strong> {attractionsCost} VND</p>
            <p>
              <strong>Flights Cost:</strong>{" "}
              {cheapestFlights && cheapestFlights.flightList
                ? cheapestFlights.flightList.reduce((total, flight) => total + (flight.totalPrice * ticketQuantity), 0)
                : 0} VND
            </p>
            <div className="recommendations-page__ticket-input">
              <label htmlFor="ticket-quantity">Ticket Quantity:</label>
              <input
                id="ticket-quantity"
                type="number"
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                aria-label="Number of tickets"
              />
            </div>
            <h4>Selected Attractions</h4>
            {selectedLocations.length > 0 ? (
              selectedLocations.map((item, index) => (
                <div key={index} className="recommendations-page__province-group">
                  <p>
                    <strong>Province:</strong> {item.provinceName || `Unknown (ID: ${item.provinceId})`}
                  </p>
                  <ul className="recommendations-page__location-list">
                    {item.locations.map((location) => (
                      <li key={location.locationId}>
                        {location.locationName || `Unknown Location (ID: ${location.locationId})`}
                        <br />
                        <span>Description: {location.locationDescription || "N/A"}</span>
                        <span>Price per Day: {location.pricePerDay || "N/A"} VND</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="recommendations-page__empty">No attractions selected.</p>
            )}
          </div>
          <div className="recommendations-page__flights">
            <div className="recommendations-page__flights-header">
              <h3 className="recommendations-page__subtitle">Recommended Flights</h3>
              <button
                className="btn bg-blue-500 text-white p-2 rounded hover:bg-blue-600 recommendations-page__edit-all-btn"
                onClick={handleEditAllFlights}
              >
                Edit All Flights
              </button>
              {isEditingAll && <button
                className="btn bg-green-500 text-white p-2 rounded hover:bg-green-600 recommendations-page__add-flight-btn"
                onClick={handleAddFlight}
              >
                Add Flight
              </button>
              }
            </div>
            {cheapestFlights && cheapestFlights.flightList && cheapestFlights.flightList.length > 0 ? (
              cheapestFlights.flightList.map((flight, index) => (
                <div key={index} className="recommendations-page__flight-item"
                      ref={editFlightIndex === index ? newFlightRef : null}
                      >

                  {flight.departureProvinceId === "HCM" && 
                   flight.destinationProvinceId === "HCM" && 
                   flight.daysAtDestination === 2 ? (
                    <div>
                      <p>Stay HCM in 2 days</p>
                    </div>
                  ) : editFlightIndex === index ? (
                    <div className="w-full">
                      <div className="recommendations-page__edit-form">
                        
                        <div className="recommendations-page__form-group">
                          <label className="recommendations-page__form-label">From:</label>
                          <select
                            name="departureProvinceId"
                            value={editForm.departureProvinceId}
                            onChange={handleEditFormChange}
                            className="recommendations-page__form-input"
                          >
                            <option value="">Select Departure</option>
                            {provinces.map((province) => (
                              <option key={province.provinceId} value={province.provinceId}>
                                {province.provinceName || province.provinceId}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="recommendations-page__form-group">
                          <label className="recommendations-page__form-label">To:</label>
                          <select
                            name="destinationProvinceId"
                            value={editForm.destinationProvinceId}
                            onChange={handleEditFormChange}
                            className="recommendations-page__form-input"
                          >
                            <option value="">Select Destination</option>
                            {provinces.map((province) => (
                              <option key={province.provinceId} value={province.provinceId}>
                                {province.provinceName || province.provinceId}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="recommendations-page__form-group">
                          <label className="recommendations-page__form-label">Takeoff Date:</label>
                          <input
                            type="date"
                            name="takeoffDate"
                            value={editForm.takeoffDate}
                            onChange={handleEditFormChange}
                            className="recommendations-page__form-input"
                          />
                        </div>
                      </div>
                      <div className="recommendations-page__form-buttons">
                          <button
                            className="recommendations-page__form-button"
                            onClick={handleSearchFlight}
                          >
                            Search
                          </button>
                          <button
                            className="recommendations-page__form-cancel-button"
                            onClick={() => setEditFlightIndex(null)}
                          >
                            Cancel
                          </button>
                        </div>
                    </div>
                  ) : (
                    <div className="recommendations-page__flight-content">
                      <div className="recommendations-page__flight-details">
                        <p>
                          <strong>
                            {index === cheapestFlights.flightList.length - 1 && cheapestFlights.flightList.length !== 1 && flight.destinationProvinceId === "HCM"
                              ? "RETURN -- Flight" 
                              : `Flight ${flight.flightCode}`} ({flight.airline}):
                          </strong>
                        </p>
                        <p>From: {flight.departureProvinceId} To: {flight.destinationProvinceId}</p>
                        <p>Date: {flight.takeoffDate}</p>
                        <p>Takeoff: {flight.takeoffTime}</p>
                        <p>Landing: {flight.landingTime}</p>
                        <p>Price: {flight.totalPrice} VND / ticket</p>
                        {flight.daysAtDestination > 0 && (
                          <p>Stay: {flight.daysAtDestination} day(s)</p>
                        )}
                      </div>
                      {isEditingAll && (
                        <div className="recommendations-page__flight-actions">
                          <button
                            className="btn bg-blue-500 text-white p-2 rounded hover:bg-blue-600 recommendations-page__edit-btn"
                            onClick={() => handleEditFlight(index, flight)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn bg-red-500 text-white p-2 rounded hover:bg-red-600 recommendations-page__delete-btn"
                            onClick={() => handleDeleteFlight(index)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="recommendations-page__empty">No flights available for the selected criteria.</p>
            )}
          </div>
          <div className="recommendations-page__actions">
            <button
              className="btn recommendations-page__back-btn"
              onClick={() => navigate("/map")}
            >
              Back
            </button>
            <button
              className="btn recommendations-page__ok-btn"
              onClick={handleBookFlights}
              disabled={!cheapestFlights || !cheapestFlights.flightList || cheapestFlights.flightList.length === 0}
            >
              OK
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
      />
      <FlightSearchModal
        isOpen={isFlightSearchModalOpen}
        onClose={() => {
          setIsFlightSearchModalOpen(false);
          setEditFlightIndex(null);
        }}
        flights={searchResults}
        onSelectFlight={handleSelectFlight}
        departureProvinceId={editForm.departureProvinceId}
        destinationProvinceId={editForm.destinationProvinceId}
        takeoffDate={editForm.takeoffDate}
      />
    </div>
  );
};

export default RecommendationsPage;