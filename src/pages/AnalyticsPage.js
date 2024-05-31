import React from "react";

const AnalyticsPage = () => {
  const totalUsers = JSON.parse(localStorage.getItem("totalUsers")) || 0;
  const orderCounts = JSON.parse(localStorage.getItem("orderCounts")) || {
    "0-10": 0,
    "10-30": 0,
    "30-60": 0,
    ">60": 0,
  };
  const tableName = localStorage.getItem("tableName");

  return (
    <div className="app-container">
      <h1 className="analytics-header">Analytics Page</h1>
      <p className="analytics-subheader">Here are your SWIGGY analytics data:</p>
      {tableName && <p>Table Name: {tableName}</p>}
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Metrics</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Users</td>
            <td>{totalUsers}</td>
          </tr>
          <tr>
            <td>0-10 orders</td>
            <td>{orderCounts["0-10"]}</td>
          </tr>
          <tr>
            <td>10-30 orders</td>
            <td>{orderCounts["10-30"]}</td>
          </tr>
          <tr>
            <td>30-60 orders</td>
            <td>{orderCounts["30-60"]}</td>
          </tr>
          <tr>
            <td>Above 60 orders</td>
            <td>{orderCounts[">60"]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AnalyticsPage;
