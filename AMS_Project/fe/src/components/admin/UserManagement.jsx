import React, { useState, useEffect } from "react";
import UserForm from "./Userform";
import apiService from "../../service/apiService"; // Assuming you have an apiService file

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiService.getAllUsers();
      console.log("Fetched users:", response); // Debug fetched users
      setUsers(response.userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsViewOnly(false);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsViewOnly(false);
    setShowForm(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewOnly(true);
    setShowForm(true);
  };

  const handleSaveUser = async (formData) => {
    try {
      if (selectedUser) {
        // Edit existing user
        await apiService.updateUserProfile(selectedUser.userId, formData);
      } else {
        // Add new user
        await apiService.post("/users", formData);
      }
      fetchUsers();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (id) => {
    try {
      await apiService.deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>User Management</h2>
        <button className="new-btn" onClick={handleAddUser}>New</button>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Role</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.address}</td>
              <td>{user.status}</td>
              <td>
                <button className="action-btn view-btn" onClick={() => handleViewUser(user)}>View</button>
                <button className="action-btn edit-btn" onClick={() => handleEditUser(user)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => handleDeleteUser(user.userId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <UserForm
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={handleCancel}
          isViewOnly={isViewOnly}
        />
      )}
    </div>
  );
};

export default UserManagement;