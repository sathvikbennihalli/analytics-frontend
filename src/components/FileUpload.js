import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const FileUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [tableName, setTableName] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [orderCounts, setOrderCounts] = useState({
    "0-10": 0,
    "10-30": 0,
    "30-60": 0,
    ">60": 0,
  });
  // eslint-disable-next-line no-unused-vars
  const [totalUsers, setTotalUsers] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    readExcel(selectedFile);
  };

  const readExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        raw: false, // Ensure that dates and times are parsed as actual Date objects
      });

      // Convert date and time columns from numeric to Date objects
      const convertedData = jsonData.map((row) => {
        // Iterate over each property in the row
        for (const key in row) {
          // Check if the value is a numeric date (Excel dates are usually above 40000)
          if (typeof row[key] === "number" && row[key] > 25567) {
            row[key] = new Date((row[key] - (25567 + 1)) * 86400 * 1000);
          }
          // Check if the value is a numeric time (fraction of a day)
          else if (typeof row[key] === "number" && row[key] <= 1) {
            const hours = Math.floor(row[key] * 24);
            const minutes = Math.round(((row[key] * 24) % 1) * 60);
            row[key] = new Date(1970, 0, 1, hours, minutes);
          }
        }
        return row;
      });

      setData(convertedData);
      localStorage.removeItem("totalUsers");
      localStorage.removeItem("orderCounts");
      localStorage.removeItem("tableName");
      calculateOrderCounts(convertedData);
      setTotalUsers(convertedData.length);
      localStorage.setItem("uploadedData", JSON.stringify(convertedData));
    };
    reader.readAsBinaryString(file);
  };

  const calculateOrderCounts = (data) => {
    const counts = {
      "0-10": 0,
      "10-30": 0,
      "30-60": 0,
      ">60": 0,
    };

    data.forEach((row) => {
      const orderCount = parseInt(row["30 Days Order Count"], 10);
      if (orderCount >= 0 && orderCount <= 10) counts["0-10"]++;
      if (orderCount > 10 && orderCount <= 30) counts["10-30"]++;
      if (orderCount > 30 && orderCount <= 60) counts["30-60"]++;
      if (orderCount > 60) counts[">60"]++;
    });

    setOrderCounts(counts);
    localStorage.setItem("orderCounts", JSON.stringify(counts));
    localStorage.setItem("totalUsers", JSON.stringify(data.length));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/uploadData`,
        {
          method: "POST",
          body: JSON.stringify({ data }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setTableName(responseData.tableName);
        setMessage("Data uploaded successfully.");
        localStorage.setItem("tableName", responseData.tableName);
        navigate("/analytics");
      } else {
        setMessage("Failed to upload data.");
      }
    } catch (error) {
      setMessage("Error occurred while uploading data.");
    }
  };

  return (
    <div className="app-container">
      <h1>Monthly Data Analytics</h1>
      <div className="file-upload-container">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <button type="submit">Upload Excel Data</button>
          </div>
        </form>
        <div>
          <button
            type="button"
            className="analytics-button"
            onClick={() => navigate("/analytics")}
          >
            Get Analytics
          </button>
        </div>
        {message && <p>{message}</p>}
        {tableName && <p>Table Name: {tableName}</p>}
        <div className="table-container">
          {data.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{value.toString()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
