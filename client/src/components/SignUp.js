import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Box, CircularProgress } from "@mui/material";
import BatteryStdIcon from "@mui/icons-material/BatteryStd";
import axios from "axios";
import Cookies from "js-cookie";
import { useAdminContext } from "../context/AdminContext";

const API = "http://localhost:5000/api/v1/admin";

const SignUp = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [image, setImage] = useState(null); // New state for profile picture
  const [loading, setLoading] = useState(false);

  const { errorMessage, seterrorMessage, successMessage, setsuccessMessage } =
    useAdminContext();

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChangeHandler = (e) => {
    setImage(e.target.files[0]); // Set selected image file
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    seterrorMessage("");
    setsuccessMessage("");

    if (!input.name || !input.email || !input.password) {
      seterrorMessage("Kindly enter all the required credentials");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("email", input.email);
      formData.append("password", input.password);
      if (image) formData.append("profilePicture", image); // Append profile picture

      const res = await axios.post(`${API}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.status === 200) {
        // Set userData cookie with profilePicture
        Cookies.set(
          "userData",
          JSON.stringify({
            name: res.data.user.name,
            email: res.data.user.email,
            profilePicture: res.data.user.profilePicture, // Set profile picture URL in cookie
          }),
          { expires: 30 }
        );

        setsuccessMessage("Registration successful! You can now log in.");
        setInput({ email: "", password: "", name: "" });
        setImage(null); // Reset image input
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        seterrorMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        seterrorMessage(error.response.data.message);
      } else {
        seterrorMessage(
          "Failed to register. Please check your connection and try again."
        );
      }
    }

    setLoading(false);
  };

  return (
    <>
      <Box
        style={{ backgroundColor: "black" }}
        className="d-flex vh-100 justify-content-center align-items-center "
      >
        <form
          style={{ width: 400, boxShadow: "0px 0px 10px 0px white" }}
          onSubmit={submitHandler}
          className="rounded p-4"
        >
          <div className="d-flex justify-content-center gap-2 ">
            <div style={{ color: "#FEAF00" }}>
              <BatteryStdIcon />
            </div>

            <div className="text-center fw-bold fs-5 text-white text-uppercase">
              Crud Operations
            </div>
          </div>

          <div className="text-uppercase mt-4">
            <h5 className="text-center text-white ">Sign Up</h5>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <p className="text-center mt-3">
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              {successMessage && (
                <Alert severity="success">{successMessage}</Alert>
              )}
            </p>
          </div>

          {/* Name Input */}
          <div className="mb-3 text-white ">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              autoComplete="off"
              placeholder="Enter your full name"
              type="text"
              value={input.name}
              name="name"
              onChange={onChangeHandler}
              className="form-control"
              id="name"
            />
          </div>

          {/* Email Input */}
          <div className="mb-3 text-white ">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              autoComplete="new-email"
              placeholder="Enter your mail"
              type="email"
              value={input.email}
              name="email"
              onChange={onChangeHandler}
              className="form-control"
              id="email"
            />
          </div>

          {/* Password Input */}
          <div className="mb-3 text-white ">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              autoComplete="new-password"
              placeholder="Enter your password"
              type="password"
              name="password"
              value={input.password}
              onChange={onChangeHandler}
              className="form-control"
              id="password"
            />
          </div>

          {/* Profile Picture Input */}
          <div className="mb-3 text-white">
            <label htmlFor="profilePicture" className="form-label">
              Profile Picture
            </label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={onFileChangeHandler}
              className="form-control"
              id="profilePicture"
            />
          </div>

          <button
            type="submit"
            style={{ backgroundColor: "#FEAF00" }}
            className="btn w-100 fw-bold text-uppercase text-white"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </button>
          <div className="mt-4 d-flex justify-content-center align-items-center text-white">
            Already have an account?
            <span>
              <Link
                className="text-decoration-none"
                to="/login"
                style={{ color: "#FEAF00", marginLeft: "5px" }}
              >
                Login
              </Link>
            </span>
          </div>
        </form>
      </Box>
    </>
  );
};

export default SignUp;
