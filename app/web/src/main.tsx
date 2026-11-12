import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App.js";
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Failed to find root DOM element with id 'root'. Ensure index.html contains <div id=\"root\"></div>."
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
