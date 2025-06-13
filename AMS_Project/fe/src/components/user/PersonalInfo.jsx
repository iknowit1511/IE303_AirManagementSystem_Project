import React, { useState, useEffect } from "react";
import apiService from "../../service/apiService";

const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {

    const fetchUserProfile = async () => {
      try {
        const response = await apiService.getUserProfile();
        const userProfile = response.usersDTO;
        setUserId(userProfile.userId);
        setFormData({
          fullName: userProfile.name || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
          address: userProfile.address || "",
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError("Failed to load user profile. Please try again.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!formData.fullName) {
        setError("Name is required.");
        return;
      }
      if (!formData.email) {
        setError("Email is required.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Invalid email format.");
        return;
      }

      // Chuẩn bị dữ liệu để gửi
      const updatedUser = {
        name: formData.fullName,
        phone: formData.phone,
        address: formData.address ,
      };
      console.log("Updated user data:", updatedUser);

      // Gọi API để update profile
      const response = await apiService.updateUserProfile(userId, updatedUser);
      console.log("Update response:", response);
      setIsEditing(false);
      setSuccess(response.message || "Profile updated successfully!");
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Failed to update user profile:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile. Please try again.";
      setError(errorMessage);
      setSuccess(null);
    }
  };

  const handleCancel = () => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiService.getUserProfile();
        const userProfile = response.usersDTO;
        setFormData({
          fullName: userProfile.name || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
          address: userProfile.address || "",
        });
        setIsEditing(false);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError("Failed to load user profile. Please try again.");
      }
    };

    fetchUserProfile();
  };

  return (
    <div className="personal-info">
      <h2>Personal Information</h2>

      {error && <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      {success && <div className="success-message" style={{ color: "green", marginBottom: "10px" }}>{success}</div>}

      <div className="info-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={true}
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;