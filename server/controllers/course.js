const Course = require("../modals/course");

// get Courses

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    return res.status(200).json({
      success: true,
      nbHits: courses.length,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// get Courses

const getCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid course ID format: ${courseId}`,
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: ` No any course with the Id ${courseId}`,
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// create Courses

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// update Courses
const updateCourse = async (req, res) => {
  try {
    const { id: courseID } = req.params;
    const course = await Course.findOneAndUpdate({ _id: courseID }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({
        message: ` No any course with the Id ${courseID}`,
      });
    }
    res.status(200).json({
      success: true,
      course,
      message: "update the course successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
// delete Courses

const deleteCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;

    const course = await Course.findOneAndDelete({ _id: courseId });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `No course found with ID: ${courseID}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
