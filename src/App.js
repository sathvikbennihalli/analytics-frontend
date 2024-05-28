import React from "react";
import FileUpload from "./components/FileUpload";
import "./App.css"; // Ensure to have styles imported

const App = () => {
  return (
    <div className="app-container">
      <h1>Monthly Data Analytics</h1>
      <FileUpload />
    </div>
  );
};

export default App;
