import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { handleError, handleSuccess } from "../utils";
import Spinner from "./Spinner"; // Import the spinner

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        phone: "",
        password: "",
    });
    const [loading, setLoading] = useState(false); // Added loading state
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { phone, password } = loginInfo;

        // Validation
        if (!phone || !password) {
            return handleError("Both phone number and password are required.");
        }

        setLoading(true); // Set loading to true before the request

        try {
            const url = "https://hoteltest-six.vercel.app/users/login/";

            // Sending request using axios
            const response = await axios.post(url, loginInfo);

            // Log the API response for debugging
            console.log("API Response:", response.data);

            // Check if the `access` token is present in the response
            if (response.data.access) {
                handleSuccess("Login successful!");

                // Save tokens to localStorage
                localStorage.setItem("accessToken", response.data.access);
                localStorage.setItem("refreshToken", response.data.refresh);

                // Navigate to the Home page
                setTimeout(() => {
                    console.log("Navigating to Home page...");
                    navigate("/Home");
                    console.log("after Navigating to Home page...");
                }, 500);
            } else {
                handleError("Login failed. Please try again.");
            }
        } catch (err) {
            // Log error details for debugging
            console.error("Login Error:", err);
            const errorMessage =
                err.response?.data?.message || "An unexpected error occurred.";
            handleError(errorMessage);
        } finally {
            setLoading(false); // Set loading to false after request is complete
        }
    };

    return (
        <div className="container-login">
             {loading && <Spinner />} {/* Conditionally render the Spinner */}
            <div className="login-form">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            name="phone"
                            value={loginInfo.phone}
                            placeholder="Enter your phone number..."
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            name="password"
                            value={loginInfo.password}
                            placeholder="Enter your password..."
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                         Login
                    </button>
                    <span>
                        Don't have an account? <Link to="/signup">SignUp</Link>
                    </span>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Login;