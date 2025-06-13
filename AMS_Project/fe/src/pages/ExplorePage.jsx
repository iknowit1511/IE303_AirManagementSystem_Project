import React from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import ExploreVietnam from "../components/explore/ExploreVietnam";
import TripPlanner from "../components/explore/TripPlanner";
import BrowseByType from "../components/explore/BrowseByType";
import DealsForWeekend from "../components/explore/DealsForWeekend";
import HomesGuestsLove from "../components/explore/HomesGuestsLove";
import TopUniqueProperties from "../components/explore/TopUniqueProperties";

const ExplorePage = () => {
  return (
    <>
      <Navbar />
        <div className="explore-page">
            <ExploreVietnam />
            <TripPlanner />
            <BrowseByType />
            <DealsForWeekend />
            <TopUniqueProperties />
            <HomesGuestsLove />
        </div>
      <Footer />
    </>
  );
};

export default ExplorePage;