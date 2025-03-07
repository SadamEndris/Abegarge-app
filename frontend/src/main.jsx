import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./assets/template_assets/css/style.css";
import "./assets/template_assets/css/color.css";
import "./assets/template_assets/css/bootstrap.css";
import { BrowserRouter } from "react-router-dom";
// import the context provider
import { AuthProvider } from "./Context/AuthContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
