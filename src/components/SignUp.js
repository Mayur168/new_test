import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";  // Import axios
import { handleError, handleSuccess } from "../utils";

function SignUp() {
  const [signupInfo, setsignupInfo] = useState({
    first_name: "",
    last_name: "test",          
    email: "",
    password: "",
    confirm_password:"1234",
    phone: "7447849429",      
    is_customer: true,          
    is_receptionist: false,     
    is_hotelowner: false,       
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setsignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(signupInfo);  // Log the data being sent

    const { first_name, email, password } = signupInfo;

    // Validation
    if (!first_name || !email || !password) {
      return handleError("First name, email, and password are required.");
    }

    try {
      const url = "https://hoteltest-six.vercel.app/users/register/";

      // Making the POST request using axios
      const response = await axios.post(url, signupInfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { success, message } = response.data;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        },100);
      }

    } catch (err) {
      handleError(err.response?.data?.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="container-Signup">
      <div className="signup form">
        <h1>Signup</h1>
        <form onSubmit={handleSignup}>
          <div>
            <label htmlFor="first_name">First Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="first_name"
              value={signupInfo.first_name}
              placeholder="Enter your first name..."
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              value={signupInfo.email}
              placeholder="Enter your email..."
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              value={signupInfo.password}
              placeholder="Enter your password..."
            />
          </div>

          {/* Hidden fields with default values */}
          <input type="hidden" name="last_name" value={signupInfo.last_name} />
          <input type="hidden" name="phone" value={signupInfo.phone} />
          <input type="hidden" name="is_customer" value={signupInfo.is_customer} />
          <input type="hidden" name="is_receptionist" value={signupInfo.is_receptionist} />
          <input type="hidden" name="is_hotelowner" value={signupInfo.is_hotelowner} />

          <button className="submit-button" type="submit">
            Signup
          </button>

          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default SignUp;
