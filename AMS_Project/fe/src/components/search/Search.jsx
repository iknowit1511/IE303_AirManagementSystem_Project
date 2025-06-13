import React, { useState, useEffect, useRef } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiAccountPinCircleLine } from "react-icons/ri";
import { RxCalendar } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import apiService from "../../service/apiService";

const Search = ({ initialDeparture, initialDestination, initialDate, initialAdult, onSearch }) => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  const [departure, setDeparture] = useState(initialDeparture || "");
  const [destination, setDestination] = useState(initialDestination || "");
  const [date, setDate] = useState(initialDate || "");
  const [guest, setGuest] = useState(initialAdult || "");
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [showModal, setShowModal] = useState(false); // Trạng thái cho modal
  const departureRef = useRef(null);
  const destinationRef = useRef(null);

  const navigate = useNavigate();

  // Province data mapped from the table
  const provinces = [
    { id: "CT", name: "Cần Thơ" },
    { id: "DL", name: "Đà Lạt" },
    { id: "DN", name: "Đà Nẵng" },
    { id: "HCM", name: "TP HCM" },
    { id: "HN", name: "Hà Nội" },
    { id: "HP", name: "Hải Phòng" },
    { id: "HUE", name: "Huế" },
    { id: "NT", name: "Nha Trang" },
    { id: "PQ", name: "Phú Quốc" },
    { id: "QN", name: "Quy Nhơn" },
    { id: "QNAM", name: "Quảng Nam" },
    { id: "TH", name: "Thanh Hóa" },
    { id: "VINH", name: "Vinh" },
  ];

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (departureRef.current && !departureRef.current.contains(event.target)) {
        setShowDepartureSuggestions(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowDestinationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!departure || !destination || !date) {
      return alert("Please enter departure, destination, and date.");
    }

    // Find the province IDs based on the selected names
    const getProvinceId = (provinceName) => {
      const province = provinces.find((p) => p.name === provinceName);
      return province ? province.id : provinceName; // Fallback to the input if not found
    };

    const departureId = getProvinceId(departure);
    const destinationId = getProvinceId(destination);

    const query = new URLSearchParams({
      departureProvinceId: departureId,
      destinationProvinceId: destinationId,
      takeoffDate: date,
      adult: Number(guest) || 1,
      sortBy: "price",
      sortOrder: "asc",
    });

    try {
      const response = await apiService.searchFlights(departureId, destinationId, date);
      const flightsData = response.data || response;

      if (!flightsData || (Array.isArray(flightsData) && flightsData.length === 0)) {
        setShowModal(true); // Hiển thị modal nếu không tìm thấy chuyến bay
        return;
      }

      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/result?${query.toString()}`, { state: { flights: flightsData } });
      }
    } catch (err) {
      console.error("Error fetching flights:", err);
      alert(`Error fetching flights: ${err.message || "An unknown error occurred."}`);
    }
  };

  // Đóng modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="search container section">
      <div className="sectionContainer grid">
        <div>
          <h2 className="sectionTitle">Compare and book cheap flights with ease!</h2>
        </div>

        <div className="searchInputs flex">
          <div className="singleInput flex" ref={departureRef}>
            <div className="iconDiv">
              <HiOutlineLocationMarker className="icon" />
            </div>
            <div className="texts">
              <h4>Departure</h4>
              <input
                type="text"
                placeholder="Where are you from?"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                onFocus={() => setShowDepartureSuggestions(true)}
              />
              {showDepartureSuggestions && (
                <div
                  className="suggestions"
                  style={{
                    position: "absolute",
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginTop: "20px",
                    padding: "0.5rem",
                    width: "200px",
                    zIndex: 1000,
                  }}
                >
                  {provinces
                    .filter((province) => province.name.toLowerCase().includes(departure.toLowerCase()))
                    .map((province) => (
                      <div
                        key={province.id}
                        style={{
                          padding: "0.7rem",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                        onClick={() => {
                          setDeparture(province.name);
                          setShowDepartureSuggestions(false);
                        }}
                      >
                        {province.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="singleInput flex" ref={destinationRef}>
            <div className="iconDiv">
              <HiOutlineLocationMarker className="icon" />
            </div>
            <div className="texts">
              <h4>Destination</h4>
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setShowDestinationSuggestions(true)}
              />
              {showDestinationSuggestions && (
                <div
                  className="suggestions"
                  style={{
                    position: "absolute",
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginTop: "20px",
                    padding: "0.5rem",
                    width: "200px",
                    zIndex: 1000,
                  }}
                >
                  {provinces
                    .filter((province) => province.name.toLowerCase().includes(destination.toLowerCase()))
                    .map((province) => (
                      <div
                        key={province.id}
                        style={{
                          padding: "0.7rem",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                        onClick={() => {
                          setDestination(province.name);
                          setShowDestinationSuggestions(false);
                        }}
                      >
                        {province.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="singleInput flex">
            <div className="iconDiv">
              <RxCalendar className="icon" />
            </div>
            <div className="texts">
              <h4>Date</h4>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="singleInput flex">
            <div className="iconDiv">
              <RiAccountPinCircleLine className="icon" />
            </div>
            <div className="texts">
              <h4>Guest</h4>
              <input
                type="text"
                placeholder="Add guest"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
              />
            </div>
          </div>

          <button className="btn btnBlock flex" onClick={handleSearch}>
            Search Flight
          </button>
        </div>

        {/* Modal thông báo khi không tìm thấy chuyến bay */}
        {showModal && (
          <div
            className="modal"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2000,
            }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                maxWidth: "400px",
                width: "90%",
              }}
            >
              <h3>No Flights Found</h3>
              <p>No flights found for the selected criteria. Please try different dates or destinations.</p>
              <button
                className="btn"
                onClick={closeModal}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;