import React from "react";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";


const UserSidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div className="user-profile-sidebar">
      <div className="sidebar-header">
        <div className="logoDiv">
        </div>
        <span className="sidebar-title">User Profile</span>
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-section-title">Account</li>
        <li
          className={`sidebar-item ${activeSection === "personalInfo" ? "active" : ""}`}
          onClick={() => setActiveSection("personalInfo")}
        >
          <span className="icon"> <FaRegUser /> </span> Personal Info
        </li>
        <li
          className={`sidebar-item ${activeSection === "changePassword" ? "active" : ""}`}
          onClick={() => setActiveSection("changePassword")}
        >
          <span className="icon"> <RiLockPasswordFill /> </span> Change Password
        </li>
        <li
          className={`sidebar-item ${activeSection === "transactionHistory" ? "active" : ""}`}
          onClick={() => setActiveSection("transactionHistory")}
        >
          <span className="icon"><FaHistory /></span> Booking History
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;
