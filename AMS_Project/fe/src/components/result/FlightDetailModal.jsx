import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../service/apiService";

// Province mapping
const provinceMap = {
  CT: "Cần Thơ",
  DL: "Đà Lạt",
  DN: "Đà Nẵng",
  HCM: "TP HCM",
  HN: "Hà Nội",
  HP: "Hải Phòng",
  HUE: "Huế",
  NT: "Nha Trang",
  PQ: "Phú Quốc",
  QN: "Quy Nhơn",
  QNAM: "Quảng Nam",
  TH: "Thanh Hóa",
  VINH: "Vinh",
};

const FlightDetailModal = ({ flight, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const getProvinceName = (provinceId) => provinceMap[provinceId] || provinceId;

  const handleSelect = async () => {
    const isAuthenticated = apiService.isAuthenticated();
    const isUser = apiService.isUser();
    const isAdmin = apiService.isAdmin();

    if (!isAuthenticated || !(isUser || isAdmin)) {
      alert("Please log in as a USER or ADMIN to book a flight.");
      navigate("/login");
      return;
    }
    const response = await apiService.getUserProfile();
    const userId = response.usersDTO.userId;
    const ticketQuantity = Number(flight.adult) || 1;

    if (!userId) {
      alert("User ID not found. Please log in again.");
      navigate("/login");
      return;
    }

    const bookingRequest = {
      ticketQuantity: ticketQuantity,
      totalPrice: Number(flight.price * ticketQuantity),
    };

    try {
      const response = await apiService.bookFlight(flight.flightId, userId, bookingRequest);
      if (response.statusCode === 200) {
        navigate(
          `/booking?adult=${encodeURIComponent(flight.adult || "1")}&flightId=${encodeURIComponent(
            flight.flightId
          )}&price=${encodeURIComponent(Number(flight.price * ticketQuantity))}&bookingId=${encodeURIComponent(
            response.bookingsDTO.bookingId
          )}&from=${encodeURIComponent(getProvinceName(flight.departureCity))}&to=${encodeURIComponent(getProvinceName(flight.destinationCity))}`
        );
        onClose();
      } else {
        alert(response.message || "Failed to book flight.");
      }
    } catch (error) {
      console.error("Error booking flight:", error);
      alert("Error booking flight: " + (error.message || "An unknown error occurred."));
    }
  };

  return (
    <div className="flight-detail-modal" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <h2>Your flight to {getProvinceName(flight.destinationCity)}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content-scroll">
          <div className="flight-section">
            <h4>Flight to {getProvinceName(flight.destinationCity)}</h4>
            <p>Direct · {flight.outbound.duration}</p>
            <p>Guests: {flight.adult || "1"}</p>
            <div className="flight-times">
              <p>{flight.outbound.departureTime} – {getProvinceName(flight.outbound.departureAirport)}</p>
              <p>{flight.outbound.arrivalTime} – {getProvinceName(flight.outbound.arrivalAirport)}</p>
            </div>
          </div>

          {flight.return.departureTime !== "Unknown" && (
            <div className="flight-section">
              <h4>Flight to {getProvinceName(flight.departureCity)}</h4>
              <p>Direct · {flight.return.duration}</p>
              <p>Guests: {flight.adult || "1"}</p>
              <div className="flight-times">
                <p>{flight.return.departureTime} – {getProvinceName(flight.return.departureAirport)}</p>
                <p>{flight.return.arrivalTime} – {getProvinceName(flight.return.arrivalAirport)}</p>
              </div>
            </div>
          )}

          <div className="info-section">
            <h4>Baggage</h4>
            <ul>
              <li>1 personal item – Included</li>
              <li>1 carry-on bag (max 10 kg) – Included</li>
              <li>1 checked bag (max 23 kg) – Included</li>
            </ul>
          </div>

          <div className="info-section">
            <h4>Fare rules</h4>
            <ul>
              <li>You’re allowed to change this flight for a fee</li>
              <li>You’re allowed to cancel this flight for a fee</li>
            </ul>
          </div>
        </div>

        <div className="footer">
          <div className="price">VND {Number(flight.price * flight.adult).toLocaleString("vi-VN")}</div>
          <button className="select-btn" onClick={handleSelect}>Select</button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailModal;