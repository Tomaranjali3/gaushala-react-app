import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="1071906646410-k4s6np6v6b2fc2dsmv9mkscdprfnvqqp.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
