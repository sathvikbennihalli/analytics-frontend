import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const FileUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [tableName, setTableName] = useState("");

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
        raw: false,
      });

      setData(jsonData);
      localStorage.setItem("uploadedData", JSON.stringify(jsonData));
    };
    reader.readAsBinaryString(file);
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
