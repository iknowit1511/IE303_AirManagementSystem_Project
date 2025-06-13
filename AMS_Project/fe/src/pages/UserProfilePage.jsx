import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import UserSidebar from "../components/user/UserSidebar";
import PersonalInfo from "../components/user/PersonalInfo";
import ChangePassword from "../components/user/ChangePassword";
import TransactionHistory from "../components/user/TransactionHistory";


const UserProfilePage = () => {
  const [activeSection, setActiveSection] = useState("personalInfo");

  return (
    <div className="user-profile-page-wrapper">
      <Navbar />
      <div className="user-profile-page">
        <UserSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="user-profile-content">
          {activeSection === "personalInfo" && (
            <div className="section">
              <PersonalInfo />
            </div>
          )}
          {activeSection === "changePassword" && (
            <div className="section">
              <ChangePassword />
            </div>
          )}
          {activeSection === "transactionHistory" && (
            <div className="section">
              <TransactionHistory />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;