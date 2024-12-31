import React from "react";
import { Link } from "react-router-dom";


function Navbar({ isAuthenticated, handleLogout }) {
  return (
    <header id="header" className="header sticky-top">

    <div>
      {/* Top Navbar (for email and phone number) */}
    <div className="topbar d-flex align-items-center">
      <div className="container d-flex justify-content-center justify-content-md-between">
        <div className="contact-info d-flex align-items-center">
          <i className="bi bi-envelope d-flex align-items-center"><a href="mailto:contact@example.com">contact@example.com</a></i>
          <i className="bi bi-phone d-flex align-items-center ms-4"><span>+1 5589 55488 55</span></i>
        </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          {/* Navbar Brand */}
          <Link
            className="navbar-brand"
            to="/"
            style={{
              color: "#2c4964",
              fontSize: "40px",
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
            }}
          >
            Doctor
          </Link>

          {/* Navbar Toggler for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/">
                      Home
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#about">
                      About
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#contact">
                      Contact
                    </a>
                  </li>
                </>
              ) : null}
            </ul>

            {/* Authentication Buttons */}
            <div className="d-flex">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="btn btn-outline-primary me-2">
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-outline-primary me-2">
                    Sign Up
                  </Link>
                </>
              ) : (
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
    </header>
  );
}

export default Navbar;
