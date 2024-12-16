import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "@/contexts/AuthProvider.jsx";
import AxiosProvider from "@/contexts/AxiosProvider.jsx";
import { Provider } from "react-redux";
import { Store } from "@/redux/Store.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={Store}>
        <AxiosProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AxiosProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
