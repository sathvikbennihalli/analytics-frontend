import React from "react";
import { useLocation } from "react-router-dom";

const AnalyticsPage = () => {
  const location = useLocation();
  const analytics = location.state?.analytics;

//   if (!analytics) {
//     return <div>Loading...</div>;
//   }

  const { totalUsers, count0To10, count10To30, count30To60, countMoreThan60 } =
    analytics;

  return (
    <div className="analytics-container">
      <h1 className="analytics-header">MAY MONTH 2024</h1>
      <table className="analytics-table">
        <thead>
          <tr>
            <th colSpan="2">APNA - SWIGGY - MAY MONTH</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="analytics-subheader">TOTAL OB</td>
            <td>{totalUsers}</td>
          </tr>
          <tr>
            <td className="analytics-subheader">0-10 ORDERS</td>
            <td>{count0To10}</td>
          </tr>
          <tr>
            <td className="analytics-subheader">10-30 ORDERS</td>
            <td>{count10To30}</td>
          </tr>
          <tr>
            <td className="analytics-subheader">30-60 ORDERS</td>
            <td>{count30To60}</td>
          </tr>
          <tr>
            <td className="analytics-subheader">MORE THAN 60 ORDERS</td>
            <td>{countMoreThan60}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AnalyticsPage;
