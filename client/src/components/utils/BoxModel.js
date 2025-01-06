import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Tooltip,
  Box,
  Grid2,
  useMediaQuery,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useAdminContext } from "../../context/AdminContext";
import { addStudent } from "../../api/PostApi";

const BoxModel = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStudent, setselectedStudent] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // for profile image
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const [newStudent, setnewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    enroll: "",
    admission: "",
  });

  const { student, setstudent, getAlldata, handleDeleteStudent, updateStudent } =
    useAdminContext();

  useEffect(() => {
    getAlldata();
  }, []);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpen = () => {
    setnewStudent({
      name: "",
      email: "",
      phone: "",
      enroll: "",
      admission: "",
    });
    setProfileImage(null); // Clear previous image
    setEditMode(false);
    setOpen(true);
  };

  const handleOpenEdit = (students) => {
    setnewStudent(students);
    setselectedStudent(students);
    setProfileImage(students.profilePicture || null); // Load existing profile image
    setEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setselectedStudent(null);
  };

  const handleAddOrUpdateStudents = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append("name", newStudent.name);
    formData.append("email", newStudent.email);
    formData.append("phone", newStudent.phone);
    formData.append("enroll", newStudent.enroll);
    formData.append("admission", newStudent.admission);

    if (profileImage) {
      formData.append("profilePicture", profileImage);
    }

    const authToken = localStorage.getItem("authToken");

    try {
      let response;
      if (editMode && selectedStudent) {
        formData.append("id", selectedStudent._id);
        response = await updateStudent(formData, authToken);

        setstudent((prevStudents) =>
          prevStudents.map((student) =>
            student._id === selectedStudent._id ? response : student
          )
        );
      } else {
        response = await addStudent(formData, authToken);
        setstudent((prevStudents) => [...prevStudents, response]);
      }

      setSnackbarOpen(true);
      setOpen(false);
      setselectedStudent(null);

      const updatedStudents = await getAlldata();
      localStorage.setItem("students", JSON.stringify(updatedStudents));
    } catch (error) {
      console.error("Failed to add/update student:", error);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // Filter students based on the search query
 const filteredStudents = student
  ?.filter((curElem) =>curElem?.name?.toLowerCase().includes(searchQuery.toLowerCase())) || [];


  return (
    <Box
      sx={{
        margin: 2,
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        padding: 2,
      }}
    >
      <Grid2
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid2 item xs={12} md="auto">
          <Typography
            sx={{
              fontFamily: "Montserrat",
              fontWeight: "700",
              fontSize: isSmallScreen ? "1.2rem" : "1.5rem",
            }}
            variant="h6"
          >
            Added Students
          </Typography>
        </Grid2>
        <Grid2 item xs={12} md="auto">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: <Search />,
            }}
            sx={{ marginBottom: isSmallScreen ? 2 : 0 }}
          />
        </Grid2>
        <Grid2 item xs={12} md="auto">
          <Button
            onClick={handleOpen}
            sx={{
              width: isSmallScreen ? "380px" : "199px",
              height: "44px",
              backgroundColor: "#FEAF00",
              fontSize: "14px",
              color: "#FFFFFF",
              fontWeight: "400",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#e08f00",
              },
              ...(isSmallScreen ? { marginLeft: 0 } : { marginLeft: "auto" }),
            }}
          >
            Add new student
          </Button>
        </Grid2>
      </Grid2>

      <Box sx={{ marginTop: 2 }}>
        <hr
          style={{
            width: "100%",
            margin: "0 auto",
            backgroundColor: "#E5E5E5",
          }}
        />
        
          <TableContainer component={Paper} sx={{ boxShadow: 4 }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Profile</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Enroll Number</TableCell>
                  <TableCell>Date of Admission</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((curElem, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        {curElem.profilePicture ? (
                          <img
                            src={curElem.profilePicture}
                            alt="profile"
                            style={{ width: 40, height: 40, borderRadius: "50%" }}
                          />
                        ) : (
                          <Typography>No Profile Picture</Typography>
                        )}
                      </TableCell>
                      <TableCell>{curElem.name}</TableCell>
                      <TableCell>{curElem.email}</TableCell>
                      <TableCell>{curElem.phone}</TableCell>
                      <TableCell>{curElem.enroll}</TableCell>
                      <TableCell>{curElem.admission}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit student">
                          <IconButton
                            sx={{ mr: 1, color: "#FEAF00" }}
                            onClick={() => handleOpenEdit(curElem)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete student">
                          <IconButton
                            sx={{ color: "#FEAF00" }}
                            onClick={() => handleDeleteStudent(curElem._id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
    
      </Box>
       {/* Add/Edit Student Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={isSmallScreen}
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {editMode ? "Update Student" : "Add New Student"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newStudent.name}
            onChange={(e) =>
              setnewStudent({ ...newStudent, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newStudent.email}
            onChange={(e) =>
              setnewStudent({ ...newStudent, email: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={newStudent.phone}
            onChange={(e) =>
              setnewStudent({ ...newStudent, phone: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Enroll Number"
            type="text"
            fullWidth
            variant="outlined"
            value={newStudent.enroll}
            onChange={(e) =>
              setnewStudent({ ...newStudent, enroll: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
           
            type="date"
            fullWidth
            variant="outlined"
            value={newStudent.admission}
            onChange={(e) =>
              setnewStudent({ ...newStudent, admission: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files[0])} // Store the selected file
            accept="image/*"
            style={{ marginBottom: "1rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddOrUpdateStudents}
            color="primary"
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={
          editMode
            ? "Student updated successfully!"
            : "Student added successfully!"
        }
      />
    </Box>
  );
};


export default BoxModel;
