import React from "react";
import DashboardCharts from "./Chart";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Page Views</h3>
          <p className="value">
            3,636,363 <span className="trend">+3.63%</span>
          </p>
          <p className="extra">You made an extra 36,000 this year</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="value">
            36,363 <span className="trend">+0.36%</span>
          </p>
          <p className="extra">You made an extra 3,600 this year</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="value">
            3,600 <span className="trend">+3.6%</span>
          </p>
          <p className="extra">You made an extra 636 this year</p>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="value">
            $36,363 <span className="trend">+3.06%</span>
          </p>
          <p className="extra">You made an extra $3,636 this year</p>
        </div>
      </div>
      <DashboardCharts />
    </div>
  );
};

export default Dashboard;
