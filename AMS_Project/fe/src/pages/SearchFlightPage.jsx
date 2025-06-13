import React from "react";
import Navbar from "../components/navbar/Navbar";
import Search from "../components/search/Search";
import PopularFlights from "../components/search/PopularFlight";
import TrendingCities from "../components/search/TrendingCities";
import Footer from "../components/footer/Footer";
import FAQ from "../components/search/FAQ";

const SearchFlightPage = () => {
  return (
    <div className="search-flight-page">
      <Navbar />
      <Search />
      <PopularFlights />
      <TrendingCities />
      <FAQ />
      <Footer />
    </div>
  );
};

export default SearchFlightPage;