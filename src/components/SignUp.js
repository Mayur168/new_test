
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, handleSuccess } from "../utils";

function SignUp() {
  const [signupInfo, setsignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setsignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    // Validation
    if (!name || !email || !password) {
      return handleError("All fields are required");
    }

    try {
      const url = "http://localhost:8080/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message} = result;

      if(success){
        handleSuccess(message);
        setTimeout(()=>{
          navigate('/login')
        },1000)
      }

      if (!response.ok) {
        throw new Error(result.message || "Signup failed. Please try again.");
      }

    } catch (err) {
      handleError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="container-Signup">
      <div className="signup form">
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            value={signupInfo.name}
            placeholder="Enter your name..."
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

        {/* <button type="submit">Signup</button> */}
        <button button className="submit-button" type="submit">Signup</button>

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
