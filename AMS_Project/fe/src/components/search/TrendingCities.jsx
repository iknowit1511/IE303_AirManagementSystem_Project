import React from "react";

const TrendingCities = () => {
  const cities = [
    {
      id: 1,
      image: "/src/assets/hcm-phanthiet.webp",
      title: "Phan Thiet, Vietnam",
      date: "May 24 - May 31 - Round-trip",
    },
    {
      id: 2,
      image: "/src/assets/hcm-hanoi.webp",
      title: "Hanoi, Vietnam",
      date: "May 24 - May 31 - Round-trip",
    },
    {
      id: 3,
      image: "/src/assets/hcm-siem.webp",
      title: "Siem Reap, Cambodia",
      date: "May 24 - May 31 - Round-trip",
    },
    {
      id: 4,
      image: "/src/assets/los.webp",
      title: "Lost Angeles, USA",
      date: "May 24 - May 31 - Round-trip",
    },
  ];

 return (
    <div className="trending-cities">
      <div className="trending-cities-container">
        <h3>Trending cities</h3>
        <p>Book flights to destinations popular with travelers from Vietnam</p>
        <div className="city-grid">
          {cities.map((city) => (
            <div key={city.id} className="city-card">
              <img src={city.image} alt={city.title} />
              <div className="city-info">
                <h4>{city.title}</h4>
                <p>{city.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingCities;