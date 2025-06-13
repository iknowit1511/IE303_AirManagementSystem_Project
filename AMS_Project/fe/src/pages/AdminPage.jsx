import React, { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import SearchBar from "../components/admin/Searchbar";
import UserManagement from "../components/admin/UserManagement";
import FlightManagement from "../components/admin/FlightManagement";
import Dashboard from "../components/admin/Dashboard";
import BookingManagement from "../components/admin/BookingManagement";
import Footer from "../components/footer/Footer";
import Navbar from "../components/navbar/Navbar";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="admin-page-wrapper">
      <Navbar />
      <div className="admin-page">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="admin-content">
          {activeSection === "dashboard" && (
            <div className="section">
              <Dashboard />
            </div>
          )}
          {activeSection === "overview" && (
            <div className="section overview-section">
              <h2>Overview</h2>
              <p>Welcome to the Admin Panel. Select a section from the sidebar to manage users, flights, bookings, or payments.</p>
            </div>
          )}
          {activeSection === "analytics" && (
            <div className="section">
              <h2>Analytics</h2>
              <p>Analytics section coming soon...</p>
            </div>
          )}
          {activeSection === "users" && (
            <div className="section">
              <UserManagement />
            </div>
          )}
          {activeSection === "flights" && (
            <div className="section">
              <FlightManagement />
            </div>
          )}
          {activeSection === "bookings" && (
            <div className="section">
              <BookingManagement />
            </div>
          )}
          {activeSection === "payments" && (
            <div className="section">
              <h2>Payments</h2>
              <p>Payment management coming soon...</p>
            </div>
          )}
          {activeSection === "settings" && (
            <div className="section">
              <h2>Settings</h2>
              <p>Settings section coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;