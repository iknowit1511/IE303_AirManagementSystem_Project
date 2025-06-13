import React, { useState, useEffect } from "react";
import apiService from "../../service/apiService";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { currentPassword, newPassword, confirmPassword } = formData;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiService.getUserProfile();
        setUserId(response.usersDTO.userId);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to fetch user profile.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    // Kiểm tra token
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in again.");
      return;
    }

    try {
      const response = await apiService.changeUserPassword(userId, currentPassword, newPassword);
      console.log("Change password response:", response);

      if (response.statusCode === 200) {
        setSuccess(response.message || "Password changed successfully!");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setError(null);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred while changing the password.";
      setError(errorMessage);
      setSuccess(null);
    }
  };

  return (
    <div className="change-password">
      <h2>Change Password</h2>
      {error && <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      {success && <div className="success-message" style={{ color: "green", marginBottom: "10px" }}>{success}</div>}
      <form className="password-form" onSubmit={handleSubmit}>
        {[
          { label: "Current Password", name: "currentPassword", value: currentPassword },
          { label: "New Password", name: "newPassword", value: newPassword },
          { label: "Confirm New Password", name: "confirmPassword", value: confirmPassword },
        ].map(({ label, name, value }) => (
          <div className="form-group" key={name}>
            <label>{label}</label>
            <input
              type="password"
              name={name}
              value={value}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="save-btn" disabled={!userId}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;