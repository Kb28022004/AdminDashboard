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
  CircularProgress,
  Grid2,
  useMediaQuery,
  useTheme,
  styled,
  InputAdornment,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import { useAdminContext } from "../context/AdminContext";
import { createCourse } from "../api/PostApi";

const Courses = () => {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", instructor: "" });
  const [editMode, setEditMode] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    courses,
    setCourses,
    getAllCourses,
    handleDeleteCourse,
    updateCourse,
  } = useAdminContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    getAllCourses();
  }, []);

  const handleOpen = (course = null) => {
    if (course) {
      setEditMode(true);
      setSelectedCourse(course);
      setNewCourse({ name: course.name, instructor: course.instructor });
    } else {
      setEditMode(false);
      setNewCourse({ name: "", instructor: "" });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleAddOrUpdateCourse = async () => {
    if (newCourse.name && newCourse.instructor) {
      setLoading(true);
      setOpen(false); // Close the modal immediately

      setTimeout(async () => {
        try {
          if (editMode) {
            const updatedCourse = await updateCourse({
              ...newCourse,
              id: selectedCourse._id,
            });
            setCourses((prev) =>
              prev.map((curElem) =>
                curElem.id === selectedCourse._id ? updatedCourse : curElem
              )
            );
          } else {
            const newCourseData = await createCourse(newCourse);
            setCourses((prev) => [...prev, newCourseData]);
          }

          const updatedCourse = await getAllCourses();
          localStorage.setItem("courses", JSON.stringify(updatedCourse));
          setSnackbarOpen(true);
        } catch (error) {
          console.error("Error adding or updating course:", error);
        } finally {
          setLoading(false); // Ensure loading is stopped regardless of success or failure
        }
      }, 2000);
    }
  };

  const filterCourses = courses.filter(
    (curElem) =>
      curElem &&
      typeof curElem.name === "string" &&
      typeof curElem.instructor === "string" &&
      (curElem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        curElem.instructor.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <BoxWrapper>
      {loading && (
        <LoadingBox>
          {" "}
          <CircularProgress sx={{ color: "#FEAF00" }} />{" "}
        </LoadingBox>
      )}

      <Grid2
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid2 item xs={12} md="auto">
          <Typography variant="h6" fontWeight="bold">
            Courses
          </Typography>
        </Grid2>
        <Grid2 item xs={12} md="auto">
          <TextField
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            placeholder="Search ....."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid2>
        <Grid2 item xs={12} md="auto">
          <Button
            onClick={() => handleOpen()}
            variant="contained"
            fullWidth
            size="large"
          >
            Add New Course
          </Button>
        </Grid2>
      </Grid2>

      <Box sx={{ marginTop: 2 }}>
        <hr
          style={{
            width: "100%",
            marginTop: "3px",
            backgroundColor: "#E5E5E5",
          }}
        />
        <TableContainer component={Paper} sx={{ boxShadow: 4 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>
                  <Typography fontWeight="bold">Course Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Instructor</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Action</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterCourses.length > 0 ? (
                filterCourses.map((course, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit Course">
                        <IconButton
                          onClick={() => handleOpen(course)}
                          sx={{ mr: 1 }}
                        >
                          {" "}
                          <Edit sx={{ color: "#FEAF00" }} />{" "}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Course">
                        <IconButton
                          onClick={() => handleDeleteCourse(course._id)}
                        >
                          {" "}
                          <Delete sx={{ color: "#FEAF00" }} />{" "}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    {" "}
                    No courses found{" "}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={isMobile}
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {editMode ? "Edit Course" : "Add New Course"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Course Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCourse.name}
            onChange={(e) =>
              setNewCourse({ ...newCourse, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Instructor"
            type="text"
            fullWidth
            variant="outlined"
            value={newCourse.instructor}
            onChange={(e) =>
              setNewCourse({ ...newCourse, instructor: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddOrUpdateCourse}
            color="primary"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            {editMode ? "Update Course" : "Add Course"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={
          editMode
            ? "Course updated successfully!"
            : "Course added successfully!"
        }
      />
    </BoxWrapper>
  );
};

export default Courses;

const BoxWrapper = styled(Box)(({ theme }) => ({
  margin: "15px",
  padding: "25px",
  border: "1px solid #e0e0e0",
  borderRadius: "5px",
  position: "relative",
}));

const LoadingBox = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(255,255,255,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
});
