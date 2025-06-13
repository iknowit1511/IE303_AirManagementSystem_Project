import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const DashboardCharts = () => {
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Page Views",
        data: [60, 80, 70, 120, 100, 90, 110],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.4,
      },
      {
        label: "Sessions",
        data: [50, 70, 60, 100, 90, 80, 95],
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "This Week Statistics",
        data: [5000, 6000, 5500, 7000, 6500, 6200, 7500],
        backgroundColor: "rgba(0, 255, 127, 0.6)",
        borderColor: "rgba(0, 255, 127, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard-charts">
      <div className="chart-container">
        <h3>Unique Visitor</h3>
        <Line data={lineData} options={options} />
      </div>

      <div className="chart-container">
        <h3>Income Overview</h3>
        <Bar data={barData} options={options} />
      </div>
    </div>
  );
};

export default DashboardCharts;
