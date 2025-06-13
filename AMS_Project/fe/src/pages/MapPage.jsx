import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import apiService from "../service/apiService";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import "./MapPage.scss";

// MapEffect component to handle map resizing
const MapEffect = () => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.invalidateSize();
      setTimeout(() => map.invalidateSize(), 100);
    }
  }, [map]);
  return null;
};

// MapPage component
const MapPage = () => {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedLocationsByProvince, setSelectedLocationsByProvince] = useState({});
  const [numDays, setNumDays] = useState(1);
  const [startDate, setStartDate] = useState("2025-06-03");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Update endDate based on startDate and numDays
  useEffect(() => {
    if (startDate && numDays) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        setError("Invalid start date.");
        return;
      }
      const end = new Date(start);
      end.setDate(start.getDate() + numDays);
      const formattedEndDate = end.toISOString().split("T")[0];
      setEndDate(formattedEndDate);
    }
  }, [startDate, numDays]);

  // Fetch provinces from API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAllProvinces();
        setProvinces(data.provinceList || []);
      } catch (err) {
        console.error("Error fetching provinces:", err);
        setError("Failed to load province data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  // Handle marker click to select a province
  const handleMarkerClick = (province) => {
    setSelectedProvince(province);
  };

  // Handle location selection and store in state
  const handleLocationSelect = (locationId, provinceId) => {
    setSelectedLocationsByProvince((prev) => {
      const provinceSelections = prev[provinceId] || [];
      if (provinceSelections.includes(locationId)) {
        const updated = provinceSelections.filter((id) => id !== locationId);
        const newState = { ...prev, [provinceId]: updated };
        if (updated.length === 0) delete newState[provinceId];
        return newState;
      } else if (getTotalSelectedLocations() < 5) {
        return {
          ...prev,
          [provinceId]: [...provinceSelections, locationId],
        };
      }
      return prev;
    });
  };

  // Calculate total selected locations
  const getTotalSelectedLocations = () => {
    return Object.values(selectedLocationsByProvince).reduce(
      (total, locations) => total + locations.length,
      0
    );
  };

  // Calculate total cost of selected attractions
  const calculateAttractionCost = () => {
    let total = 0;
    Object.entries(selectedLocationsByProvince).forEach(([provinceId, locationIds]) => {
      const province = provinces.find((p) => p.provinceId === provinceId);
      if (province) {
        locationIds.forEach((locationId) => {
          const location = province.tourLocations.find((loc) => loc.locationId === locationId);
          if (location) {
            total += location.pricePerDay || 100000;
          }
        });
      }
    });
    return total;
  };

  // Clear all selections
  const handleClearSelections = () => {
    setSelectedLocationsByProvince({});
    setNumDays(1);
    setStartDate("2025-06-03");
    setSelectedProvince(null);
  };

  // Handle OK button to navigate to recommendations with selected data
  const handleOk = () => {
    const selectedProvinces = provinces
      .filter((province) => selectedLocationsByProvince[province.provinceId]?.length > 0)
      .map((province) => province.provinceId);

    if (selectedProvinces.length === 0) {
      alert("Please select a province.");
      return;
    }
    if (getTotalSelectedLocations() < 3) {
      alert("Please select at least 3 locations.");
      return;
    }
    if (numDays < selectedProvinces.length || numDays > selectedProvinces.length * 2) {
      alert(`Total days must be between ${selectedProvinces.length} and ${selectedProvinces.length * 2}.`);
      return;
    }

    // Prepare detailed location data for query string
    const locationDetails = Object.entries(selectedLocationsByProvince).map(
      ([provinceId, locationIds]) => {
        const province = provinces.find((p) => p.provinceId === provinceId);
        if (!province) return null;
        const locations = locationIds.map((locationId) => {
          const location = province.tourLocations.find((loc) => loc.locationId === locationId);
          if (!location) return null;
          return {
            locationId,
            locationName: location.locationName,
            locationDescription: location.locationDescription || "N/A",
            pricePerDay: location.pricePerDay || 100000,
          };
        }).filter(Boolean);
        return { provinceId, provinceName: province.provinceName, locations };
      }
    ).filter(Boolean);

    const query = new URLSearchParams({
      departureProvinceId: "HCM",
      destinationProvinceIds: selectedProvinces.join(","),
      takeoffDate: startDate,
      endDate: endDate,
      adultCount: "1",
      price: calculateAttractionCost().toString(),
      numDays: numDays.toString(),
      locations: JSON.stringify(locationDetails),
    });
    navigate(`/recommendations?${query.toString()}`, { replace: true });
  };

  if (loading) {
    return (
      <div className="map-page section">
        <Navbar />
        <div className="container">
          <div className="loading">Loading map...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-page section">
        <Navbar />
        <div className="container">
          <div className="error">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="map-page section">
      <Navbar />
      <div className="container">
        <h2 className="map-page__title">Explore Vietnam Destinations</h2>
        <div className="map-page__content">
          <div className="map-page__map">
            <MapContainer
              center={[16.0471, 108.2062]}
              zoom={6}
              className="leaflet-container"
              style={{ height: "600px", width: "100%" }}
            >
              <MapEffect />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {provinces.map((province) => {
                const lat = parseFloat(province.latitude);
                const lng = parseFloat(province.longitude);
                if (isNaN(lat) || isNaN(lng)) {
                  console.warn(`Invalid coordinates for ${province.provinceName}:`, { lat, lng });
                  return null;
                }
                return (
                  <Marker
                    key={province.provinceId}
                    position={[lat, lng]}
                    eventHandlers={{
                      click: () => handleMarkerClick(province),
                    }}
                  >
                    <Popup>
                      <div className="leaflet-popup-content">
                        <h3>{province.provinceName}</h3>
                        <p><strong>Province:</strong> {province.provinceName}</p>
                        <p><strong>Airport:</strong> {province.airport || "N/A"}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
          <div className="map-page__info-panel">
            {selectedProvince ? (
              <>
                <h3 className="map-page__subtitle">{selectedProvince.provinceName} Attractions</h3>
                {selectedProvince.tourLocations.length > 0 ? (
                  selectedProvince.tourLocations.map((location) => (
                    <div key={location.locationId} className="map-page__location-card">
                      <label className="map-page__location-label">
                        <input
                          type="checkbox"
                          id={`location-${location.locationId}`}
                          checked={selectedLocationsByProvince[selectedProvince.provinceId]?.includes(
                            location.locationId
                          ) || false}
                          onChange={() => handleLocationSelect(location.locationId, selectedProvince.provinceId)}
                          className="map-page__checkbox"
                          disabled={
                            getTotalSelectedLocations() >= 5 &&
                            !selectedLocationsByProvince[selectedProvince.provinceId]?.includes(location.locationId)
                          }
                          aria-label={`Select ${location.locationName}`}
                        />
                        <div className="map-page__location-info">
                          <h4>{location.locationName}</h4>
                          <p><strong>Description:</strong> {location.locationDescription}</p>
                          <p><strong>Tour Time:</strong> {location.tourTime} minutes</p>
                          <p><strong>Travel Time:</strong> {location.travelTime} minutes</p>
                          <p><strong>Price per Day:</strong> {location.pricePerDay || 100000} VND</p>
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="map-page__empty">No attractions available for this province.</p>
                )}
              </>
            ) : (
              <p className="map-page__empty">Select a province to view attractions.</p>
            )}
          </div>
          <div className="map-page__selected-panel">
            <h3 className="map-page__subtitle">Your Trip Plan</h3>
            <div className="map-page__summary">
              <p><strong>Total Attractions ({getTotalSelectedLocations()}/5):</strong></p>
              <div className="map-page__days-input">
                <label htmlFor="start-date">Start Date:</label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min="2025-06-01"
                  aria-label="Start date"
                />
              </div>
              <div className="map-page__days-input">
                <label htmlFor="num-days">Number of Days (1-5):</label>
                <input
                  id="num-days"
                  type="number"
                  value={numDays}
                  onChange={(e) => setNumDays(Math.min(Math.max(1, parseInt(e.target.value) || 1), 5))}
                  min="1"
                  max="5"
                  aria-label="Number of days"
                />
              </div>
              {getTotalSelectedLocations() > 0 ? (
                <>
                  {Object.entries(selectedLocationsByProvince).map(([provinceId, locationIds]) => {
                    const province = provinces.find((p) => p.provinceId === provinceId);
                    return (
                      <div key={provinceId} className="map-page__province-group">
                        <p><strong>Province:</strong> {province ? province.provinceName : "Unknown"}</p>
                        <ul className="map-page__location-list">
                          {locationIds.map((locationId) => {
                            const location = province?.tourLocations.find((loc) => loc.locationId === locationId);
                            return (
                              <li key={locationId}>{location ? location.locationName : "Unknown Location"}</li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                  <div className="map-page__cost-summary">
                    <p><strong>Attractions Cost:</strong> {calculateAttractionCost()} VND</p>
                  </div>
                  <div className="map-page__actions">
                    <button
                      className="btn map-page__clear-btn"
                      onClick={handleClearSelections}
                      disabled={getTotalSelectedLocations() === 0}
                    >
                      Clear Selections
                    </button>
                    <button
                      className="btn map-page__ok-btn"
                      onClick={handleOk}
                      disabled={getTotalSelectedLocations() < 3}
                    >
                      OK
                    </button>
                  </div>
                </>
              ) : (
                <p className="map-page__empty">No attractions selected.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// RecommendationsPage component
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

  // Parse query string and extract detailed location data
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

  // Fetch provinces from API
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

  // Fetch cheapest flights, wait for provinces to load
  useEffect(() => {
    const fetchCheapestFlights = async () => {
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
  }, [departureProvinceId, destinationProvinceIds, numDays, startDate, endDate, provinces, navigate]);

  // Handle booking multiple flights
  const handleBookFlights = async () => {
    if (!cheapestFlights || !cheapestFlights.flightList || cheapestFlights.flightList.length === 0) {
      alert("No valid flights available to book.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Please log in to book flights.");
        navigate("/sign-in");
        return;
      }
      const bookingList = cheapestFlights.flightList.map((flight) => ({
        flightId: flight.flightId,
        adultCount: 1,
      }));
      const response = await apiService.bookMultipleFlights(userId, bookingList);
      console.log("Booking response:", response);
      if (response.statusCode === 200) {
        alert("Flights booked successfully!");
        navigate("/bookings");
      } else {
        setError(response.message || "Failed to book flights.");
      }
    } catch (err) {
      console.error("Error booking flights:", err);
      setError("Failed to book flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <p><strong>End Date:</strong> {endDate}</p>
            <p><strong>Number of Days:</strong> {numDays}</p>
            <p><strong>Attractions Cost:</strong> {attractionsCost} VND</p>
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
                        <br />
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
            <h3 className="recommendations-page__subtitle">Recommended Flights</h3>
            {cheapestFlights && cheapestFlights.flightList && cheapestFlights.flightList.length > 0 ? (
              cheapestFlights.flightList.map((flight, index) => (
                <div key={index} className="recommendations-page__flight-item">
                  <p>
                    <strong>Flight {flight.flightCode} ({flight.airline}):</strong>
                  </p>
                  <p>From: {flight.departureProvinceId} To: {flight.destinationProvinceId}</p>
                  <p>Date: {flight.takeoffDate}</p>
                  <p>Takeoff: {flight.takeoffTime}</p>
                  <p>Landing: {flight.landingTime}</p>
                  <p>Price: {flight.totalPrice} VND</p>
                  {flight.daysAtDestination > 0 && (
                    <p>Stay: {flight.daysAtDestination} day(s)</p>
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
              onClick={() => navigate(-1)}
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
    </div>
  );
};

export default MapPage ;