import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BatteryStdIcon from "@mui/icons-material/BatteryStd";
import { Alert, Box, CircularProgress } from "@mui/material";


const API = "http://localhost:5000/api/v1/admin";

const SignIn = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Redirect if already logged in
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/home");
  }

 

  const onChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!input.email || !input.password) {
      setErrorMessage("Both email and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure cookies are sent
      });

      if (res.status === 200) {
        // Set token and user data in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setSuccessMessage("Login successful!");
        setInput({ email: "", password: "" });
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to log in. Please check your connection.");
      }
    }

    setLoading(false);
  };

  return (
    <Box
      style={{ backgroundColor: "black" }}
      className="d-flex vh-100 justify-content-center align-items-center"
    >
      <form
        style={{
          width: 400,
          height: 500,
          boxShadow: "0px 0px 15px 0px white",
        }}
        onSubmit={submitHandler}
        className="rounded p-4"
      >
        <div className="d-flex justify-content-center gap-2">
          <div style={{ color: "#FEAF00" }}>
            <BatteryStdIcon />
          </div>
          <div className="text-center fw-bold fs-5 text-white text-uppercase">
            CRUD Operations
          </div>
        </div>

        <div className="text-uppercase mt-4">
          <h5 className="text-center text-white">Sign In</h5>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <p className="text-center mt-3">
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && (
              <Alert severity="success">{successMessage}</Alert>
            )}
          </p>
        </div>

        {/* Email Input */}
        <div className="mb-3 text-white">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            autoComplete="off"
            placeholder="Enter your email"
            type="email"
            value={input.email}
            name="email"
            onChange={onChangeHandler}
            className="form-control"
            id="email"
          />
        </div>

        {/* Password Input */}
        <div className="mb-3 text-white">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            autoComplete="off"
            placeholder="Enter your password"
            type="password"
            name="password"
            value={input.password}
            onChange={onChangeHandler}
            className="form-control"
            id="password"
          />
        </div>

        <button
          type="submit"
          style={{ backgroundColor: "#FEAF00" }}
          className="btn w-100 fw-bold text-uppercase text-white"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Sign In"}
        </button>

        <div className="mt-4 text-center text-white">
          <Link to='/forgot-password' className="text-decoration-none">
            Forgot your Password?
          </Link>
        </div>

        <div className="mt-2 text-center">
          <Link to="/register" className="text-white text-decoration-none">
            New User
          </Link>
        </div>
      </form>
    </Box>
  );
};

export default SignIn;
