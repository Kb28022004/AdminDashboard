import { Box } from "@mui/material";
import React, { useState } from "react";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import { CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import WestIcon from "@mui/icons-material/West";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [loading, setloading] = useState(false);
  const [email, setemail] = useState("");

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setemail(e.target.value);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/admin/forget/password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result?.message || "Something went wrong. Please try again."
        );
      }

      if (result?.status) {
        toast.success(result.message || "OTP sent successfully!");
        setloading(false);
        localStorage.setItem("passToken", result.token);
        localStorage.setItem("email", email);
        navigate("/otp/verify");
      }
    } catch (error) {
      // Handle unexpected HTML error response
      if (error.message === "Unexpected response format") {
        toast.error(
          "The server responded with an unexpected format. Please try again later."
        );
      } else {
        toast.error(error.message || "Failed to send OTP. Please try again.");
      }
      setloading(false);
    }
  };

  return (
    <Box
      style={{ backgroundColor: "black", color: "#fff" }}
      className="d-flex vh-100 justify-content-center align-items-center"
    >
      <form
        onSubmit={onFormSubmit}
        style={{
          width: 400,
          height: 400,
          boxShadow: "0px 0px 15px 0px white",
        }}
        className="rounded p-4"
      >
        <div style={{ textAlign: "center" }}>
          <div>
            <AttachEmailIcon />
          </div>
          <div style={{ marginTop: 35 }}>
            <h3> Forget Your Password</h3>
          </div>
          <div style={{ marginTop: 5, color: "grey" }}>
            <p> Enter your registered email to send a 6 digit OTP</p>
          </div>
        </div>

        <div className="mb-3 ">
          <label htmlFor="email" className="form-label">
            Email *
          </label>
          <input
            required
            autoComplete="off"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={onChangeHandler}
            name="email"
            className="form-control"
            id="email"
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            style={{ backgroundColor: "#FEAF00" }}
            className="btn w-100 fw-bold text-uppercase text-white"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Send OTP"}
          </button>
        </div>

        <div className="mt-4">
          <Link to="/login">
            <button
              style={{ backgroundColor: "none" }}
              className="btn w-100 fw-bold  text-white"
            >
              <div className="d-flex gap-2 justify-content-center align-items-center">
                <WestIcon />
                back to login
              </div>
            </button>
          </Link>
        </div>
      </form>
    </Box>
  );
};

export default ForgotPassword;
