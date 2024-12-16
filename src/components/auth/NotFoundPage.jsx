import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="container">
      <div className="content">
        <div className="error-box">
          <span className="error-content">404</span>
        </div>
        <p className="error-content">
          Oops! The page you’re looking for doesn’t exist.
        </p>
      </div>
      <div className="button-container">
        <Link className="button" to={"/home"}>
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
