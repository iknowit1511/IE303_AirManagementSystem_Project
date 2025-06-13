import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import FlightDetailModal from "../components/result/FlightDetailModal";
import { FaSuitcaseRolling } from "react-icons/fa";
import { MdOutlineLuggage } from "react-icons/md";
import apiService from "../service/apiService";

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

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const departure = query.get("from") || "Ho Chi Minh City (SGN)";
  const destination = query.get("to") || "Hanoi (HAN)";
  const date = query.get("date") || "2025-06-21 - 2025-06-28";
  const adult = query.get("adult") || "1";
  const flightId = query.get("flightId");
  const priceFromUrl = query.get("price") || "0";
  const bookingId = query.get("bookingId");

  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [userDetails, setUserDetails] = useState({ email: "N/A", phone: "N/A" });
  const [flightData, setFlightData] = useState(null);
  const [flightDetails, setFlightDetails] = useState({
    flightId: flightId,
    departureCity: departure,
    destinationCity: destination,
    price: Number(priceFromUrl),
    adult: adult,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardholderName: "",
    cardNumber: "",
    expirationDate: "",
    cvc: "",
    momoPhone: "",
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Trạng thái cho modal xác nhận

  const normalizeUser = (userData) => ({
    email: userData.email || userData.username || "N/A",
    phone: userData.phone || userData.phoneNumber || "N/A",
  });

  const normalizeFlight = (flightData) => ({
    tax: flightData.tax || 0,
    originalPrice: flightData.originalPrice,
  });

  const getProvinceName = (provinceId) => provinceMap[provinceId] || provinceId;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!apiService.isAuthenticated()) {
        localStorage.setItem("redirectAfterLogin", location.pathname + location.search);
        navigate("/login");
        return;
      }

      try {
        const userResponse = await apiService.getUserProfile();
        const normalizedUser = normalizeUser(userResponse.usersDTO);
        setUserDetails(normalizedUser);

        const flightResponse = await apiService.getFlightById(flightId);
        const normalizedFlight = normalizeFlight(flightResponse.flightsDTO);
        setFlightData(normalizedFlight);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load user or flight details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [flightId, navigate, priceFromUrl, location]);

  const handleViewDetails = (flight) => {
    setSelectedFlight(flight || flightDetails);
  };

  const closeModal = () => {
    setSelectedFlight(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentDetails({
      cardholderName: "",
      cardNumber: "",
      expirationDate: "",
      cvc: "",
      momoPhone: "",
    });
    setShowModal(false);
    setShowConfirmModal(false);
  };

  const validatePaymentDetails = () => {
    const { cardholderName, cardNumber, expirationDate, cvc, momoPhone } = paymentDetails;
    if (paymentMethod === "MOMO") {
      if (!momoPhone) {
        return "Phone number is required for MoMo payment.";
      }
      if (!/^\d{10}$/.test(momoPhone)) {
        return "Phone number must be 10 digits.";
      }
    } else {
      if (!cardholderName || !cardNumber || !expirationDate || !cvc) {
        return "All card fields are required.";
      }
      if (!/^[a-zA-Z\s]+$/.test(cardholderName)) {
        return "Cardholder's name should contain only letters and spaces.";
      }
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
        return "Card number must be 16 digits.";
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
        return "Expiration date must be in MM/YY format.";
      }
      if (!/^\d{3}$/.test(cvc)) {
        return "CVC must be 3 digits.";
      }
    }
    return null;
  };

  const handlePayment = async () => {
    setShowModal(false);
    const validationError = validatePaymentDetails();
    if (validationError) {
      setModalMessage(validationError);
      setShowModal(true);
      return;
    }

    if (!bookingId) {
      setModalMessage("Booking ID is missing. Please try again.");
      setShowModal(true);
      return;
    }

    // Hiển thị modal xác nhận thanh toán
    setModalMessage(`Bạn xác nhận thanh toán? Tổng tiền: VND ${Number(priceFromUrl).toLocaleString("vi-VN")}`);
    setShowConfirmModal(true);
  };

  const confirmPayment = async () => {
    setShowConfirmModal(false);
    try {
      setLoading(true);
      const paymentResponse = await apiService.makePayment({
        bookingId: Number(bookingId),
        amount: priceFromUrl,
        method: paymentMethod,
      });

      if (paymentResponse.statusCode === 200) {
        setPaymentSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setModalMessage(paymentResponse.message || "Payment failed. Please try again.");
        setShowModal(true);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setModalMessage("An error occurred during payment. Please try again.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const closePaymentModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setModalMessage("");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="booking-page">
      <Navbar />
      <div className="booking-container">
        <div className="left-panel">
          <h1>Check and pay</h1>
          <div className="traveler-details">
            <h3>Traveler details</h3>
            <p>Email: {userDetails.email}</p>
            <p>Số điện thoại: {userDetails.phone}</p>
            <p>Số khách: {adult} Guest(s)</p>
          </div>
          <div className="baggage-section">
            <h2>Baggage</h2>
            <p>Total number of bags included for {adult} traveler(s)</p>
            <div className="baggage-details">
              <div className="flight-baggage">
                <h3>Flight to {getProvinceName(departure)}</h3>
                <ul>
                  <li><span className="baggage-icon"> <FaSuitcaseRolling /> </span> 1 personal item</li>
                  <li><span className="baggage-icon"> <FaSuitcaseRolling /> </span> Fits under the seat in front of you</li>
                  <li><span className="baggage-icon"> <MdOutlineLuggage /> </span> 1 carry-on bag</li>
                  <li><span className="baggage-icon"> <MdOutlineLuggage /> </span> 23 x 36 x 56 cm · Max weight 10 kg</li>
                  <li><span className="baggage-icon"> <FaSuitcaseRolling /> </span> 1 checked bag</li>
                  <li><span className="baggage-icon"> <FaSuitcaseRolling /> </span> Max weight 23 kg</li>
                </ul>
                <a href="#" className="view-baggage-btn">View baggage per traveler</a>
              </div>
            </div>
            <p className="baggage-note">
              For more detailed baggage info and options, check airline baggage policies:
              <a href="#">Vietnam Airlines</a>
            </p>
          </div>
          <div className="payment-section">
            <h2>Your payment</h2>
            <p>Simple, safe, and secure.</p>
            <div className="payment-options">
              <span>How do you want to pay?</span>
              <div className="card-logos">
                <img
                  src="/src/assets/mastercard.png"
                  alt="MasterCard"
                  className={`card-logo ${paymentMethod === "CARD" ? "selected" : ""}`}
                  onClick={() => handlePaymentMethodChange("CARD")}
                />
                <img
                  src="/src/assets/visa.webp"
                  alt="Visa"
                  className={`card-logo ${paymentMethod === "CARD" ? "selected" : ""}`}
                  onClick={() => handlePaymentMethodChange("CARD")}
                />
                <img
                  src="/src/assets/momo.webp"
                  alt="MoMo"
                  className={`card-logo ${paymentMethod === "MOMO" ? "selected" : ""}`}
                  onClick={() => handlePaymentMethodChange("MOMO")}
                />
              </div>
            </div>
            <div className="payment-form">
              {paymentMethod === "MOMO" ? (
                <>
                  <label>MoMo Phone Number *</label>
                  <input
                    type="text"
                    name="momoPhone"
                    placeholder="Enter your MoMo phone number"
                    value={paymentDetails.momoPhone}
                    onChange={handleInputChange}
                  />
                </>
              ) : (
                <>
                  <label>Cardholder's name *</label>
                  <input
                    type="text"
                    name="cardholderName"
                    placeholder="AB CD"
                    value={paymentDetails.cardholderName}
                    onChange={handleInputChange}
                  />
                  <label>Card number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="•••• •••• •••• ••••"
                    value={paymentDetails.cardNumber}
                    onChange={handleInputChange}
                  />
                  <div className="expiration-cvc">
                    <div>
                      <label>Expiration date *</label>
                      <input
                        type="text"
                        name="expirationDate"
                        placeholder="MM/YY"
                        value={paymentDetails.expirationDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label>CVC *</label>
                      <input
                        type="text"
                        name="cvc"
                        placeholder="•••"
                        value={paymentDetails.cvc}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {paymentSuccess && <p className="success-message">Payment successful! Redirecting...</p>}
            </div>
          </div>
          <div className="terms-and-conditions">
            <p className="terms">
              By clicking "pay now" you agree with the terms and conditions and privacy policies of Booking.com, Gotogate
              International AB, Vietnam Airlines, and with the fare rules.
            </p>
            <div className="payment-buttons">
              <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
              <button className="pay-now-btn" onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : "Pay now"}
              </button>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="price-details">
            <h3>Price details</h3>
            <div className="price-item">
              <span>Flight</span>
              <span>Adult ({adult})</span>
              <span>VND {Number(flightData?.originalPrice * Number(adult)).toLocaleString("vi-VN")}</span>
            </div>
            <button
              className={`toggle-breakdown-btn ${showPriceBreakdown ? "expanded" : ""}`}
              onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
            >
              Details
            </button>
            <div className={`price-breakdown ${showPriceBreakdown ? "show" : ""}`}>
              <div className="breakdown-item">
                <span>Total taxes and fees</span>
                <span>VND {Number(flightData?.tax * Number(adult)).toLocaleString("vi-VN")}</span>
              </div>
            </div>
            <div className="total">
              <span>Total</span>
              <span>VND {Number(priceFromUrl).toLocaleString("vi-VN")}</span>
              <span>Includes taxes and fees</span>
              <span>No hidden fees - here's what you'll pay</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {selectedFlight && <FlightDetailModal flight={selectedFlight} onClose={closeModal} />}
      {/* Modal thông báo lỗi */}
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
            <h3>Payment Error</h3>
            <p>{modalMessage}</p>
            <button
              className="btn"
              onClick={closePaymentModal}
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
      {/* Modal xác nhận thanh toán */}
      {showConfirmModal && (
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
            <h3>Confirm Payment</h3>
            <p>{modalMessage}</p>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
              <button
                className="btn"
                onClick={confirmPayment}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Confirm
              </button>
              <button
                className="btn"
                onClick={closeConfirmModal}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;