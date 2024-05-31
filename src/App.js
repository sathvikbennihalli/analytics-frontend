import React from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import FileUpload from "./components/FileUpload";
import Analytics from "./pages/AnalyticsPage"; // Import the Analytics component
import "./App.css"; // Ensure to have styles imported

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<FileUpload />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
};

export default App;
