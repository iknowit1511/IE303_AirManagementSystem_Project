import React from "react";
import SearchBar from "./Searchbar";
import { MdOutlineSpaceDashboard, MdPayment } from "react-icons/md";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { IoAirplaneOutline, IoSettingsOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { FaChartArea } from "react-icons/fa6";

const Sidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logoDiv">
        </div>
        <span className="sidebar-title">Admin Panel</span>
      </div>

      <ul className="sidebar-menu">
        <li className="sidebar-section-title">Dashboard</li>

        <li
          className={`sidebar-item ${activeSection === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveSection("dashboard")}
        >
          <span className="icon"><FaChartArea /></span> Dashboard
        </li>

        <li
          className={`sidebar-item ${activeSection === "overview" ? "active" : ""}`}
          onClick={() => setActiveSection("overview")}
        >
          <span className="icon"><MdOutlineSpaceDashboard /></span> Overview
        </li>

        <li
          className={`sidebar-item ${activeSection === "analytics" ? "active" : ""}`}
          onClick={() => setActiveSection("analytics")}
        >
          <span className="icon"><TbBrandGoogleAnalytics /></span> Analytics
        </li>

        <li className="sidebar-section-title">Management</li>

        <li
          className={`sidebar-item ${activeSection === "users" ? "active" : ""}`}
          onClick={() => setActiveSection("users")}
        >
          <span className="icon"><FaRegUser /></span> Users
        </li>

        <li
          className={`sidebar-item ${activeSection === "flights" ? "active" : ""}`}
          onClick={() => setActiveSection("flights")}
        >
          <span className="icon"><IoAirplaneOutline /></span> Flights
        </li>

        <li
          className={`sidebar-item ${activeSection === "bookings" ? "active" : ""}`}
          onClick={() => setActiveSection("bookings")}
        >
          <span className="icon"><SlCalender /></span> Bookings
        </li>

        <li
          className={`sidebar-item ${activeSection === "payments" ? "active" : ""}`}
          onClick={() => setActiveSection("payments")}
        >
          <span className="icon"><MdPayment /></span> Payments
        </li>

        <li className="sidebar-section-title">General</li>

        <li
          className={`sidebar-item ${activeSection === "settings" ? "active" : ""}`}
          onClick={() => setActiveSection("settings")}
        >
          <span className="icon"><IoSettingsOutline /></span> Settings
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
