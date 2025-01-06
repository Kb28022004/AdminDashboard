import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/admin",
});

// Get students
export const getStudent = (authToken) => {
  return api.get("/getstudents",{
    headers:{
      Authorization:`Bearer ${authToken}`
    }
  });
};

// Delete student
export const deleteStudent = (id,authToken) => {
  return api.delete(`/deletestudent/${id}`,{
    headers:{
      Authorization:`Bearer ${authToken}`
    }
  });
};

// Add student (updated to handle FormData for image upload)
export const addStudent = (data, authToken) => {
  const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
  return api.post("/createstudent", data, {
    headers: {
      ...headers,
      Authorization: `Bearer ${authToken}`,
    },
  });
};

// Edit student (updated to handle FormData for image upload)
export const editStudent = (studentData,authToken) => {
  // Ensure the studentData is in FormData format (especially when updating the profile picture)
  const headers = studentData instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
  return api.put(`/updatestudent/${studentData.get("id")}`, studentData, {
     headers:{
      ...headers,
      Authorization:`Bearer ${authToken}`
     }
    
    });
};

// Get courses
export const getCourses = () => {
  return api.get("/getcourses");
};

// Create course
export const createCourse = (data) => {
  return api.post("/createcourse", data);
};

// Delete course
export const deleteCourse = (id) => {
  return api.delete(`/deletecourse/${id}`);
};

// Edit course
export const editCourse = (courseData) => {
  return api.put(`/updatecourse/${courseData.id}`, courseData);
};
