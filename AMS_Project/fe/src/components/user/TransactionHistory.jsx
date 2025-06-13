import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/apiService";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.getUserProfile();
        setUserId(response.usersDTO.userId);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const bookings = await ApiService.getUserBookings(userId);
        console.log("Fetched bookings:", bookings);
        setTransactions(bookings.usersDTO.bookings);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const handlePayNow = (transaction) => {
    // Navigate to the booking page with relevant query parameters
    navigate(
      `/booking?bookingId=${encodeURIComponent(transaction.bookingId)}&flightId=${encodeURIComponent(
        transaction.flightId
      )}&price=${encodeURIComponent(transaction.price)}&adult=${encodeURIComponent(
        transaction.ticketQuantity
      )}&from=${encodeURIComponent(transaction.departureCity || "Unknown")}&to=${encodeURIComponent(
        transaction.destinationCity || "Unknown"
      )}`
    );
  };

  return (
    <div className="transaction-history">
      <h2>Booking History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : transactions.length > 0 ? (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Flight</th>
              <th>Ticket Quantity</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.bookingId}>
                <td>{transaction.bookingId}</td>
                <td>{transaction.flightId}</td>
                <td>{transaction.ticketQuantity}</td>
                <td>{Number(transaction.price).toLocaleString("vi-VN")} VND</td>
                <td>{transaction.bookingStatus}</td>
                <td>
                  {transaction.bookingStatus !== "PAID" ? (
                    <button
                      className="pay-now-btn"
                      onClick={() => handlePayNow(transaction)}
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span>Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionHistory;