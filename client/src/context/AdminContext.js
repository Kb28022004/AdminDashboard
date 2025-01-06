import { createContext, useContext, useState, useEffect } from "react";
import {
  deleteStudent,
  editStudent,
  getCourses,
  getStudent,
  deleteCourse,
  editCourse,
} from "../api/PostApi";

import {toast} from 'react-hot-toast'
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [student, setstudent] = useState([]);
  const [courses, setCourses] = useState([]);
  const [openSidebar, setopenSidebar] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [errorMessage, seterrorMessage] = useState("");
  const [successMessage, setsuccessMessage] = useState("");

  // Load students and courses from localStorage on component mount
  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem("students");
      const storedCourses = localStorage.getItem("courses");

      setstudent(storedStudents ? JSON.parse(storedStudents) : []);
      setCourses(storedCourses ? JSON.parse(storedCourses) : []);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      setstudent([]);
      setCourses([]);
    }
  }, []);

  // Sync `student` and `courses` data with localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  // Fetch all student data from API
  const getAlldata = async () => {
    try {
      const res = await getStudent();
      setstudent(res.data?.students || [])
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  // Delete a student
  const handleDeleteStudent = async (id) => {
    try {
      const res = await deleteStudent(id);
      if (res.status === 200) {
        setstudent((prevStudents) => prevStudents.filter((curElem) => curElem._id !== id));
        toast.success('Student has been deleted successfully')
        
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Update a student (updated to handle FormData with profile picture)
  const updateStudent = async (studentData) => {
    try {
      const response = await editStudent(studentData);
      const updatedStudent = response.data;
      setstudent((prevStudents) =>
        prevStudents.map((student) =>
          student._id === updatedStudent._id ? updatedStudent : student
        )
      );

      return updatedStudent;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  };

  // Fetch all course data from API
  const getAllCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data?.courses || [])
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  // Delete a course
  const handleDeleteCourse = async (id) => {
    try {
      const res = await deleteCourse(id);
      if (res.status === 200) {
        setCourses((prevCourses) => prevCourses.filter((curElem) => curElem._id !== id));
        toast.success('Course has been deleted successfully')
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Update a course
  const updateCourse = async (courseData) => {
    try {
      const res = await editCourse(courseData);
      return res.data;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        openSidebar,
        setopenSidebar,
        activeIndex,
        setActiveIndex,
        student,
        getAlldata,
        setstudent,
        handleDeleteStudent,
        updateStudent,
        errorMessage,
        seterrorMessage,
        successMessage,
        setsuccessMessage,
        courses,
        setCourses,
        handleDeleteCourse,
        getAllCourses,
        updateCourse,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the Admin context
const useAdminContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider, useAdminContext };
