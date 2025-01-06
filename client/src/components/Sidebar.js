import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Collapse,
  useMediaQuery,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import ReportIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminContext } from "../context/AdminContext";
import { toast } from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const getToken = () => {
  return localStorage.getItem("token");
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { openSidebar } = useAdminContext();
  const { activeIndex, setActiveIndex } =
    useAdminContext();
    const [loading, setloading] = useState(false)
  const [open, setopen] = useState(false);
  const [input, setinput] = useState({ name: "", email: "" });
  const [image, setimage] = useState(null);
  const [user, setUser] = useState({ name: "", profilePicture: "" });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  const handleClickLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("You are logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const index = SidebarData.findIndex(
      (item) => `/${item.heading.toLowerCase()}` === currentPath
    );
    setActiveIndex(index);
  }, [location.pathname]);

  const handleItemClick = (index, route) => {
    setActiveIndex(index);
    navigate(route);
  };

  const handleClose = () => {
    setopen(false);
  };

  const handleOpen = () => {
    setopen(true);
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setinput((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeFileHandler = (e) => {
    setimage(e.target.files[0]);
  };

  const handleUpdateData = async (e) => {
    e.preventDefault();
    setloading(true);
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("email", input.email);
    if (image) formData.append("profilePicture", image);

    const token = getToken();

    if (!token) {
      setloading(false);
      toast.error('You are not login, login first login to update profile')
      navigate("/login");
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/v1/admin/profile/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setloading(false);
        setopen(false);
        toast.success("Your profile has been updated successfully");
      }
    } catch (error) {
      setloading(false);
      console.log(error);
    }
  };

  const SidebarData = [
    { icon: HomeIcon, heading: "Home" },
    { icon: SchoolIcon, heading: "Course" },
    { icon: PeopleIcon, heading: "Students" },
    { icon: PaymentIcon, heading: "Payment" },
    { icon: ReportIcon, heading: "Report" },
    { icon: SettingsIcon, heading: "Settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: openSidebar ? (isMobile ? 180 : 240) : 60,
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: openSidebar ? (isMobile ? 180 : 240) : 60,
          boxSizing: "border-box",
          backgroundColor: "#f0e7d9",
          transition: "width 0.3s ease",
        },
      }}
    >
      {/* Profile section */}
      <Collapse in={openSidebar} timeout={{ enter: 300, exit: 300 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop:"18px"
            
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            CRUD OPERATION
          </Typography>
          <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{ position: "relative", marginBottom: 2 }}
          >
            <Avatar
              src={user.profilePicture || "https://via.placeholder.com/100"}
              alt="Profile"
              sx={{
                width: isMobile ? 60 : 100,
                height: isMobile ? 60 : 100,
                transition: "transform 0.3s ease, filter 0.3s ease",
                transform: isHovered ? "scale(0.95)" : "scale(1)",
                filter: isHovered ? "blur(2px)" : "none",
              }}
            />
            {isHovered && (
              <Button
                variant="text"
                sx={{
                  position: "absolute",
                  top: 3,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
                onClick={handleOpen}
              >
                Edit Profile
              </Button>
            )}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {user.name || "User Name"}
          </Typography>
          <Typography variant="body2" color="#FEAF00">
            Admin
          </Typography>
        </Box>
      </Collapse>

      {/* Profile section when collapsed */}
      {!openSidebar && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Tooltip title=" Edit Profile">
            <Box
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              sx={{ position: "relative" }}
            >
              <Avatar
                src={user.profilePicture || "https://via.placeholder.com/100"}
                alt="Profile"
                sx={{
                  width: 40,
                  height: 40,
                  cursor: "pointer",
                  transition: "transform 0.3s ease, filter 0.3s ease",
                  transform: isHovered ? "scale(0.9)" : "scale(1)",
                  filter: isHovered ? "blur(2px)" : "none",
                }}
              />
              {isHovered && (
                <Button
                  sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,

                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                  onClick={() => handleOpen()}
                >
                  <EditIcon />
                </Button>
              )}
            </Box>
          </Tooltip>
          <Typography sx={{ fontWeight: "bold", fontSize: "8px" }}>
            {user.name || "User Name"}
          </Typography>
        </Box>
      )}

      {/* Sidebar Menu */}
      <List
        sx={{
          margin: openSidebar ? (isMobile ? "20px" : "40px") : "",
          cursor: "pointer",
        }}
      >
        {SidebarData.map((item, index) => (
          <ListItem
            key={index}
            onClick={() =>
              handleItemClick(index, `/${item.heading.toLowerCase()}`)
            }
            sx={{
              backgroundColor: activeIndex === index ? "#FEAF00" : "",
              borderRadius: "6px",
              marginTop: "4px",
              paddingLeft: openSidebar ? "20px" : "",
              "&:hover": {
                backgroundColor: activeIndex === index ? "#FEAF00" : "",
              },
            }}
            button
          >
            <Tooltip title={openSidebar ? "" : item.heading}>
              <ListItemIcon sx={{ minWidth: openSidebar ? 40 : 30 }}>
                {<item.icon />}
              </ListItemIcon>
            </Tooltip>
            {openSidebar && (
              <ListItemText
                primary={item.heading}
                sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
              />
            )}
          </ListItem>
        ))}

        {/* Logout */}
        <ListItem sx={{ mt: 3 }} button onClick={handleClickLogout}>
          <Tooltip title="Logout">
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
          </Tooltip>
          {openSidebar && (
            <ListItemText
              primary="Logout"
              sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
            />
          )}
        </ListItem>
      </List>
      <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
        <DialogTitle style={{ fontWeight: "bold" }}>
          Update your profile
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            margin="dense"
            value={input.name}
            name="name"
            fullWidth
            onChange={onChangeHandler}
            type="text"
            placeholder="Enter your name to update"
          />
          <TextField
            label="Email"
            margin="dense"
            name="email"
            value={input.email}
            onChange={onChangeHandler}
            type="email"
            fullWidth
            placeholder="Enter your email to update"
          />
          <TextField
            onChange={onChangeFileHandler}
            fullWidth
            margin="dense"
            cursor="pointer"
            type="file"
            accept="image/*"
          />
        </DialogContent>
        <DialogActions color="primary">
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={loading}
            onClick={handleUpdateData}
            variant="contained"
          >
            {" "}
            {loading ? <CircularProgress /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default Sidebar;
