import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, useTheme } from "@mui/material";

const Card = ({ icon, content, data, backgroundColor, iconColor, linkTo }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Function to handle card click and navigate to the route
  const handleCardClick = () => {
    navigate(linkTo);
  };

  return (
    <Paper
      onClick={handleCardClick}
      elevation={5}
      sx={{
        backgroundColor: backgroundColor || theme.palette.background.default, 
        cursor: "pointer",
        padding: theme.spacing(4),
        borderRadius: theme.shape.borderRadius, 
        transition: "transform 0.3s ease-in",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minWidth: "200px", 
        overflow:"hidden",
        maxWidth: "100%", 
        [theme.breakpoints.down("sm")]: {
          padding: theme.spacing(2),
          flexDirection: "column",
          textAlign: "center", 
        },
        "&:hover": {
          transform: "scale(1.05)", 
        },
      }}
    >
      {/* Icon and Content Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          [theme.breakpoints.down("sm")]: {
            alignItems: "center", // Center the icon on mobile
          },
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            color: iconColor || theme.palette.primary.main,
            fontSize: "2.5rem", // Icon size
            [theme.breakpoints.down("sm")]: {
              fontSize: "2rem", // Smaller icon on small screens
            },
          }}
        >
          {icon}
        </Box>

        {/* Content */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            marginTop: theme.spacing(1),
            color: theme.palette.text.primary,
            [theme.breakpoints.down("sm")]: {
              fontSize: "1rem",
            },
          }}
        >
          {content}
        </Typography>
      </Box>

      {/* Data Section */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          textAlign: "right",
          fontSize: "1.75rem", 
          [theme.breakpoints.down("sm")]: {
            fontSize: "1.5rem", 
            textAlign: "center", 
            marginTop: theme.spacing(1), 
          },
        }}
      >
        {data}
      </Typography>
    </Paper>
  );
};

export default Card;
