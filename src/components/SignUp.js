
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { handleError, handleSuccess } from "../utils";

function SignUp() {
  const [signupInfo, setsignupInfo] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
     
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setsignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(signupInfo);

    const { first_name, email, password, confirm_password } = signupInfo;

      if (!first_name || !email || !password || !confirm_password) {
          return handleError("All fields are required.");
      }
      if(password !== confirm_password) {
          return handleError("Passwords do not match.");
      }

    try {
      const url = "https://bharati-clinic-test.vercel.app/users/register/";

      const response = await axios.post(url, signupInfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);


      if (response.data.access) {
          handleSuccess("Registered successfully!");
          setTimeout(() => {
              navigate("/login");
          }, 500);
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
             required
            />
          </div>

          <div>
            <label htmlFor="last_name">Last Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="last_name"
              value={signupInfo.last_name}
              placeholder="Enter your last name..."
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
              required
            />
          </div>
        <div>
            <label htmlFor="phone">Phone</label>
            <input
                onChange={handleChange}
                type="text"
                name="phone"
                value={signupInfo.phone}
                placeholder="Enter your phone number..."
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
             required
            />
          </div>

          <div>
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="confirm_password"
              value={signupInfo.confirm_password}
              placeholder="Confirm your password..."
             required
            />
          </div>

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