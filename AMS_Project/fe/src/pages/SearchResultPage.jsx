import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import SearchBar from "../components/search/Search";
import SearchSummary from "../components/result/SearchSummary";
import FlightResults from "../components/result/FlightResults";
import Filters from "../components/result/Filters";
import Footer from "../components/footer/Footer";
import FlightDetailModal from "../components/result/FlightDetailModal";
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

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const departure = query.get("departureProvinceId");
  const destination = query.get("destinationProvinceId");
  const date = query.get("takeoffDate") || "2025-06-21";
  const adult = query.get("adult") || "1";
  const sortBy = query.get("sortBy") || "price";
  const sortOrder = query.get("sortOrder") || "asc";

  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [sortOption, setSortOption] = useState("Cheapest");
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [durationRange, setDurationRange] = useState(null); // null means no duration filter

  const getProvinceName = (provinceId) => provinceMap[provinceId] || provinceId;

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const response = await apiService.searchFlights(
          departure,
          destination,
          date,
          sortBy,
          sortOrder,
          selectedAirlines
        );
        const flightsData = response.data || response || [];
        setFlights(flightsData);
        // Apply filters
        let filtered = flightsData;
        if (durationRange) {
          filtered = filtered.filter(
            (flight) =>
              parseInt(flight.duration) >= durationRange.min &&
              parseInt(flight.duration) <= durationRange.max
          );
        }
        if (selectedAirlines.length > 0) {
          filtered = filtered.filter((flight) => selectedAirlines.includes(flight.airline));
        }
        setFilteredFlights(filtered);
      } catch (err) {
        console.error("Error fetching flights:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [departure, destination, date, sortBy, sortOrder, selectedAirlines, navigate]);

  const handleSortChange = (newSortOption) => {
    let newSortBy = "price";
    let newSortOrder = "asc";
    if (newSortOption === "Cheapest") {
      newSortBy = "price";
      newSortOrder = "asc";
    } else if (newSortOption === "Fastest") {
      newSortBy = "duration";
      newSortOrder = "asc";
    } else if (newSortOption === "Best") {
      newSortBy = "best";
      newSortOrder = "desc";
    }
    setSortOption(newSortOption);
    navigate(
      `/result?departureProvinceId=${encodeURIComponent(departure)}&destinationProvinceId=${encodeURIComponent(destination)}&takeoffDate=${encodeURIComponent(date)}&adult=${encodeURIComponent(adult)}&sortBy=${newSortBy}&sortOrder=${newSortOrder}`
    );
  };

  const handleSearch = (newQuery) => {
    navigate(`/result?${newQuery.toString()}`);
  };

  const handleFilterChange = ({ airlines, durationRange }) => {
    setSelectedAirlines(airlines);
    setDurationRange(durationRange);
    // Apply filters
    let filtered = flights;
    if (durationRange) {
      filtered = filtered.filter(
        (flight) =>
          parseInt(flight.duration) >= durationRange.min &&
          parseInt(flight.duration) <= durationRange.max
      );
    }
    if (airlines.length > 0) {
      filtered = filtered.filter((flight) => airlines.includes(flight.airline));
    }
    setFilteredFlights(filtered);
  };

  const handleViewDetails = (flight) => {
    const formattedFlight = {
      flightId: flight.flightId,
      departureCity: getProvinceName(flight.departureProvinceId),
      destinationCity: getProvinceName(flight.destinationProvinceId),
      outbound: {
        departureTime: flight.takeoffTime,
        arrivalTime: flight.landingTime,
        departureAirport: getProvinceName(flight.departureProvinceId),
        arrivalAirport: getProvinceName(flight.destinationProvinceId),
        duration: flight.duration,
      },
      return: flight.return || {
        departureTime: "Unknown",
        arrivalTime: "Unknown",
        departureAirport: getProvinceName(flight.destinationProvinceId),
        arrivalAirport: getProvinceName(flight.departureProvinceId),
        duration: "Unknown",
      },
      price: flight.totalPrice,
      adult: adult,
    };
    setSelectedFlight(formattedFlight);
  };

  const closeModal = () => {
    setSelectedFlight(null);
  };

  // Calculate flight count and minimum price
  const flightCount = filteredFlights.length;
  const minPrice = filteredFlights.length > 0 ? Math.min(...filteredFlights.map(flight => parseFloat(flight.totalPrice))) : 0;

  return (
    <>
      <div className="search-result-page">
        <Navbar />
        <SearchBar
          initialDeparture={getProvinceName(departure)}
          initialDestination={getProvinceName(destination)}
          initialDate={date}
          initialAdult={adult}
          onSearch={handleSearch}
        />
        <div className="result-container">
          <div className="left-panel">
            <SearchSummary
              departure={getProvinceName(departure)}
              destination={getProvinceName(destination)}
              date={date}
              adult={adult}
              flightCount={flightCount}
              minPrice={minPrice}
            />
            <Filters onFilterChange={handleFilterChange} flightCount={flightCount} />
          </div>
          <div className="right-panel">
            <div className="sort-container">
              <div className="sort-options">
                <button
                  className={sortOption === "Best" ? "active" : ""}
                  onClick={() => handleSortChange("Best")}
                >
                  Best
                </button>
                <button
                  className={sortOption === "Cheapest" ? "active" : ""}
                  onClick={() => handleSortChange("Cheapest")}
                >
                  Cheapest
                </button>
                <button
                  className={sortOption === "Fastest" ? "active" : ""}
                  onClick={() => handleSortChange("Fastest")}
                >
                  Fastest
                </button>
              </div>
            </div>
            {loading ? (
              <div className="loading">Loading flights...</div>
            ) : (
              <FlightResults
                flights={filteredFlights}
                sortOption={sortOption}
                onViewDetails={handleViewDetails}
              />
            )}
          </div>
        </div>
        {selectedFlight && (
          <FlightDetailModal flight={selectedFlight} onClose={closeModal} />
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResult;