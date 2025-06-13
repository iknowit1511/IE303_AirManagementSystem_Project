import React, { useState } from "react";

const PopularFlights = () => {
  const [tab, setTab] = useState("International");

  const flights = {
    International: [
      {
        id: 1,
        image: "src/assets/hcm-bangkok.webp",
        title: "Ho Chi Minh City to Bangkok",
        date: "May 29 - Jun 2 - Round-trip",
      },
      {
        id: 2,
        image: "src/assets/hcm-kuta.webp",
        title: "Ho Chi Minh City to Kuta",
        date: "May 26 - May 30 - Round-trip",
      },
      {
        id: 3,
        image: "src/assets/hcm-singapore.webp",
        title: "Ho Chi Minh City to Singapore",
        date: "May 24 - May 29 - Round-trip",
      },
      {
        id: 4,
        image: "src/assets/hcm-tokyo.webp",
        title: "Ho Chi Minh City to Tokyo",
        date: "May 23 - Jun 6 - Round-trip",
      },
    ],
    Domestic: [
      {
        id: 1,
        image: "src/assets/hcm-phanthiet.webp",
        title: "Phan Thiet, Vietnam",
        date: "May 24 - May 31 - Round-trip",
      },
      {
        id: 2,
        image: "src/assets/hcm-hanoi.webp",
        title: "Hanoi, Vietnam",
        date: "May 24 - May 31 - Round-trip",
      },
      {
        id: 3,
        image: "src/assets/hcm-danang.webp",
        title: "Da Nang, Vietnam",
        date: "May 24 - May 31 - Round-trip",
      },
      {
        id: 4,
        image: "src/assets/hcm-hue.webp",
        title: "Nha Trang, Vietnam",
        date: "May 24 - May 31 - Round-trip",
      },
    ],
  };

  return (
    <div className="popular-flights">
      <div className="popular-flights-container">
        <h3>Popular flights near you</h3>
        <p>Find deals on domestic and international flights</p>
        <div className="tabs">
          <button
            className={tab === "International" ? "active" : ""}
            onClick={() => setTab("International")}
          >
            International
          </button>
          <button
            className={tab === "Domestic" ? "active" : ""}
            onClick={() => setTab("Domestic")}
          >
            Domestic
          </button>
        </div>
        <div className="flight-grid">
          {flights[tab].map((flight) => (
            <div key={flight.id} className="flight-card">
              <img src={flight.image} alt={flight.title} />
              <div className="flight-info">
                <h4>{flight.title}</h4>
                <p>{flight.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularFlights;