import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import AdminPage from "./pages/AdminPage";
import SearchFlightPage from "./pages/SearchFlightPage";
import SearchResultPage from "./pages/SearchResultPage";
import BookingPage from "./pages/BookingPage";
import UserProfilePage from "./pages/UserProfilePage";
import ChatWidget from "./components/chatbot/ChatWidget";
import ChatbotPage from "./pages/ChatbotPage";
import ExplorePage from "./pages/ExplorePage";
import AboutPage from "./pages/AboutPage";
import HelpCenter from "./components/support/HelpCenter";
import MapPage from "./pages/MapPage";
import RecommendationsPage from "./pages/RecommendPage";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SigninPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/search" element={<SearchFlightPage />} />
        <Route path="/result" element={<SearchResultPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/profile" element={<UserProfilePage/>} />
        <Route path="/chat" element={<ChatbotPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />

      </Routes>
      <ChatWidget />
    </Router>
  );
};

export default App;