import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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

const FlightResults = ({ sortOption, onViewDetails, flights }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [nearbyFlights, setNearbyFlights] = useState([]);

  const departureProvinceId = searchParams.get("departureProvinceId");
  const destinationProvinceId = searchParams.get("destinationProvinceId");
  const takeoffDate = searchParams.get("takeoffDate");

  const getProvinceName = (provinceId) => provinceMap[provinceId] || provinceId;

  const getDateRange = (baseDate, daysOffset) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split("T")[0];
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  useEffect(() => {
    if (departureProvinceId && destinationProvinceId && takeoffDate) {
      const fetchNearbyFlights = async () => {
        try {
          const startDate = getDateRange(takeoffDate, -2);
          const endDate = getDateRange(takeoffDate, 2);
          const response = await apiService.searchFlightsByDateRange(
            departureProvinceId,
            destinationProvinceId,
            startDate,
            endDate
          );
          const flightsData = response.data || response || [];
          const normalizedNearbyFlights = flightsData.map((flight) => ({
            flightId: flight.id || flight.flightId || `flight-${Math.random()}`,
            takeoffDate: flight.date || flight.takeoffDate,
            price: flight.price || flight.totalPrice || "0",
          }));

          const cheapestByDate = normalizedNearbyFlights.reduce((acc, flight) => {
            const date = flight.takeoffDate;
            const price = parseFloat(flight.price);
            if (!acc[date] || price < acc[date].price) {
              acc[date] = { date, price };
            }
            return acc;
          }, {});

          const nearbyOptions = Object.values(cheapestByDate)
            .filter((option) => option.date !== takeoffDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 4);
          setNearbyFlights(nearbyOptions);
        } catch (err) {
          console.error("Error fetching nearby flights:", err);
          setNearbyFlights([]);
        }
      };
      fetchNearbyFlights();
    }
  }, [departureProvinceId, destinationProvinceId, takeoffDate]);

  if (!flights.length || !departureProvinceId || !destinationProvinceId || !takeoffDate) {
    return <div>Please provide valid search criteria or perform a new search.</div>;
  }

  return (
    <div className="flight-results">
      {flights.map((flight, index) => (
        <div key={flight.flightId} className="flight-card">
          <div className="badges">
            {index === 0 && <span className="badge green">Best</span>}
            <span className="badge lightgreen">Flexible ticket upgrade available</span>
          </div>
          <div className="flight-content">
            <div className="flight-info">
              <div className="time-info">
                <strong>{flight.takeoffTime}</strong>
                <span>
                  {getProvinceName(flight.departureProvinceId)} • {formatDate(flight.takeoffDate)}
                </span>
              </div>
              <div className="stop-info">
                <div className="line"></div>
                <span className="stops">nonstop</span>
                <div className="line"></div>
                <span className="duration">{flight.duration} mins</span>
              </div>
              <div className="time-info">
                <strong>{flight.landingTime}</strong>
                <span>
                  {getProvinceName(flight.destinationProvinceId)} • {formatDate(flight.landingDate)}
                </span>
              </div>
            </div>
            <div className="flight-price">
              <div className="price">VND {Number(flight.totalPrice).toLocaleString()} /ticket</div>
              <button className="view-details" onClick={() => onViewDetails(flight)}>
                View details
              </button>
            </div>
          </div>
          <div className="airline-name">{flight.airline}</div>
          <div className="seat-class">Hạng ghế {flight.seatClass}</div>
          {index === 0 && (
            <div className="better-prices">
              <div className="better-prices-text">
                <strong>We found better prices! Compare nearby dates.</strong>
                <p>Latest prices found for your search – actual prices shown in next step</p>
              </div>
              <div className="date-options">
                {nearbyFlights.length > 0 ? (
                  nearbyFlights.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate(
                          `/result?departureProvinceId=${encodeURIComponent(
                            departureProvinceId
                          )}&destinationProvinceId=${encodeURIComponent(
                            destinationProvinceId
                          )}&takeoffDate=${encodeURIComponent(option.date)}&sortBy=${sortOption === "Fastest" ? "duration" : sortOption === "Best" ? "best" : "price"
                          }&sortOrder=${sortOption === "Best" ? "desc" : "asc"}`
                        );
                      }}
                    >
                      {formatDate(option.date)}<br />
                      <strong>VND {Math.round(option.price).toLocaleString()}</strong>
                    </button>
                  ))
                ) : (
                  <div>No nearby date options available.</div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FlightResults;