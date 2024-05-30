import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App";

const el = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  el
);
