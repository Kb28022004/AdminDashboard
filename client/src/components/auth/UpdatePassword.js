import { Box } from "@mui/material";
import React, { useState } from "react";
import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import { CircularProgress } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios"; // Import axios

const UpdatePassword = () => {
  const [loading, setloading] = useState(false);
  const [input, setinput] = useState({
    password: "",
    cfpassword: "",
  });

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setinput((prev) => ({ ...prev, [name]: value }));
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    const { password, cfpassword } = input;

    try {
      const res = await axios.post("http://localhost:5000/api/v1/admin/update/password", {
        password,
        cfpassword,
        token: localStorage.getItem("passToken"),
      });

      const result = res.data;

      if (result.success) {
        setloading(false);
        toast.success(result?.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed.");
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
          height: 500,
          boxShadow: "0px 0px 15px 0px white",
        }}
        className="rounded p-4"
      >
        <div style={{ textAlign: "center" }}>
          <div>
            <LoopRoundedIcon />
          </div>
          <div style={{ marginTop: 35 }}>
            <h3> New Password</h3>
          </div>
          <div style={{ marginTop: 5, color: "grey" }}>
            <p> Enter at least 8-digit long password</p>
          </div>
        </div>
        <div className="mb-3 ">
          <label htmlFor="password" className="form-label">
            Password *
          </label>
          <input
            autoComplete="off"
            placeholder="Enter your password"
            type="password"
            value={input.password}
            onChange={onChangeHandler}
            required
            name="password"
            className="form-control"
            id="password"
          />
        </div>
        <div className="mb-3 ">
          <label htmlFor="cfpassword" className="form-label">
            Confirm Password *
          </label>
          <input
            autoComplete="off"
            required
            value={input.cfpassword}
            placeholder="Enter your confirm password"
            type="password"
            onChange={onChangeHandler}
            name="cfpassword"
            className="form-control"
            id="cfpassword"
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            style={{ backgroundColor: "#FEAF00" }}
            className="btn w-100 fw-bold text-uppercase text-white"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update Password"}
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

export default UpdatePassword;
