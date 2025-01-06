import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  LinearProgress,
  Paper,
  Container,
} from "@mui/material";
import axios from "axios";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(false);

  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 30;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*]/.test(password)) strength += 30;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    calculatePasswordStrength(password);
    setPasswordMatch(password === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    if (!token) {
      return setMessage("Invalid or missing token.");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/admin/resetpassword",
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Password reset successful. You can now log in.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setMessage(
        error.response && error.response.data
          ? "Error: " + error.response.data.message
          : "Error: Something went wrong."
      );
    }
  };

  return (
    <div
      style={{ backgroundColor: "black" }}
      className="d-flex vh-100 justify-content-center align-items-center "
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, mt: 4, backgroundColor: "#f9f9f9" }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              value={newPassword}
              onChange={handlePasswordChange}
              required
            />
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
              <Typography variant="body2">Password Strength: </Typography>
              <Box sx={{ width: "100%", marginLeft: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  color={passwordStrength < 50 ? "error" : passwordStrength < 80 ? "warning" : "success"}
                  sx={{ height: "12px", borderRadius: "5px" }}
                />
              </Box>
            </Box>
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <Typography
              variant="body2"
              color={passwordMatch ? "green" : "error"}
              sx={{ textAlign: "center", marginTop: 1 }}
            >
              {passwordMatch ? "Passwords match" : "Passwords do not match"}
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!passwordMatch || passwordStrength < 50}
              sx={{ marginTop: 3 }}
            >
              Reset Password
            </Button>
          </form>
          {message && (
            <Typography variant="body1" color={message.includes("success") ? "success" : "error"} sx={{ marginTop: 2, textAlign: "center" }}>
              {message}
            </Typography>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default ResetPassword;
