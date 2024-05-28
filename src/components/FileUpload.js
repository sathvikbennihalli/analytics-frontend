import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setMessage("File uploaded successfully.");
      } else {
        setMessage("Failed to upload file.");
      }
    } catch (error) {
      setMessage("Error occurred while uploading file.");
    }
  };

  return (
    <div className="file-upload-container">
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="submit">Upload Excel File</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
