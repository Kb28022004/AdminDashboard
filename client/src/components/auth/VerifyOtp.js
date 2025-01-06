import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import "../../index.css";
import { CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import WestIcon from "@mui/icons-material/West";
import Timer from "../../helper/Timer";
import { toast } from "react-hot-toast";
import axios from "axios"; // Import axios

const VerifyOtp = () => {
  const [loading, setloading] = useState(false);
  const [otpTime, setotpTime] = useState(null);
  const [isExpire, setisExpire] = useState(false);
  const [otp1, setotp1] = useState("");
  const [otp2, setotp2] = useState("");
  const [otp3, setotp3] = useState("");
  const [otp4, setotp4] = useState("");
  const [otp5, setotp5] = useState("");
  const [otp6, setotp6] = useState("");

  const otpArray = [setotp1, setotp2, setotp3, setotp4, setotp5, setotp6];

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);

  const navigate = useNavigate();
  const inputRef = [ref1, ref2, ref3, ref4, ref5, ref6];

  useEffect(() => {
    const getTime = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/v1/admin/otp/time", {
          token: localStorage.getItem("passToken"),
        });

        const result = res.data;

        if (result?.status) {
          const remainingTime = new Date(result?.sendTime).getTime() - new Date().getTime();
          if (remainingTime > 0) {
            setotpTime(remainingTime);
          } else {
            setisExpire(true);
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch OTP time.");
      }
    };

    getTime();
  }, []);

  useEffect(() => {
    if (ref1.current) {
      ref1.current.focus();
    }
  }, []);

  const inputChange = (e, location) => {
    if (location < 5 && e.target.value) {
      inputRef[location + 1].current.focus();
    }
    otpArray[location](e.target.value);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    const finalOtp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

    try {
      const res = await axios.post("http://localhost:5000/api/v1/admin/verify/otp", {
        otp: finalOtp,
      });

      const result = res.data;

      if (result?.status) {
        setloading(false);
        toast.success(result?.message);
        navigate("/password/update");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
      setloading(false);
    }
  };

  const onResendButtonClick = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/v1/admin/forget/password", {
        email: localStorage.getItem("email"),
      });

      const result = res.data;

      if (result?.status) {
        toast.success(result?.message);
        localStorage.setItem("passToken", result?.token);
        setotpTime(1 * 60 * 1000);
        setisExpire(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <Box style={{ backgroundColor: "black", color: "#fff" }}>
      <div className="d-flex vh-100 justify-content-center align-items-center ">
        <form
          onSubmit={onFormSubmit}
          style={{
            width: 400,
            height: 450,
            boxShadow: "0px 0px 15px 0px white",
          }}
          className="rounded p-4"
        >
          <div style={{ textAlign: "center" }}>
            <div>
              <FingerprintRoundedIcon />
            </div>
            <div style={{ marginTop: 35 }}>
              <h3> Verify Your OTP</h3>
            </div>
            <div style={{ marginTop: 5, color: "grey" }}>
              <p> Enter 6 digit OTP that we have sent to your email</p>
            </div>
          </div>
          <div className="mb-3 ">
            <label>OTP *</label>
            <br />
            {inputRef.map((curElem, index) => {
              return (
                <input
                  required
                  key={index}
                  onChange={(e) => inputChange(e, index)}
                  ref={curElem}
                  type="number"
                  onInput={(e) => {
                    if (e.target.value.length > 1) {
                      e.target.value = e.target.value.slice(0, 1);
                    }
                  }}
                  style={{
                    width: "52px",
                    height: "52px",
                    margin: "3px",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                />
              );
            })}
          </div>
          <div className="mt-4">
            <button
              type="submit"
              style={{ backgroundColor: "#FEAF00" }}
              className="btn w-100 fw-bold text-uppercase text-white"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Verify OTP"}
            </button>
          </div>
          <div className="mt-2">
            {otpTime !== null && !isExpire ? (
              <Timer setisExpire={setisExpire} time={otpTime} />
            ) : (
              <span
                onClick={onResendButtonClick}
                style={{
                  top: "5px",
                  padding: "10px",
                  borderRadius: "5px",
                  color: "white",
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Resend OTP
              </span>
            )}
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
      </div>
    </Box>
  );
};

export default VerifyOtp;
