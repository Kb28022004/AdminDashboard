const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course");

router.route("/getcourses").get(getAllCourses);
router.route("/getcourse/:id").get(getCourse);
router.route("/createcourse").post(createCourse);
router.route("/updatecourse/:id").put(updateCourse);
router.route("/deletecourse/:id").delete(deleteCourse);

module.exports = router;
