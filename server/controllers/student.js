const upload = require("../middleware/multer");
const Student = require("../modals/student");


// get Students

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json({
      success: true,
      nbHits: students.length,
      students,
     
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// get Students

const getStudent = async (req, res) => {
  try {
    const { id: studentID } = req.params;
    const student = await Student.findById({ _id: studentID });
    if (!student) {
      return res.status(404).json({
        message: ` No any student with the Id ${studentID}`,
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// create Students

const createStudent = async (req, res) => {
  try {
    const studentData={
      name:req.body.name,
      email:req.body.email,
      phone:req.body.phone,
      enroll:req.body.enroll,
      admission:req.body.admission,
      profilePicture : req.file ? `/uploads/${req.file.filename}` : null // Store only the file path
      
      
    }
    const student = await Student.create(studentData);
    res.status(201).json({
      student,
      success: true,
      message: "New student created succssfully",
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// update Students

const updateStudent = async (req, res) => {
  try {
    const { id: studentID } = req.params;
    const updatedData={
      name:req.body.name,
      email:req.body.email,
      phone:req.body.phone,
      enroll:req.body.enroll,
      admission:req.body.admission,
      profilePicture : req.file ? `/uploads/${req.file.filename}` :  req.body.profilePicture // Store only the file path
      
      
    }
    const student = await Student.findOneAndUpdate(
      { _id: studentID },
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        message: ` No any student with the Id ${studentID}`,
      });
    }
    res.status(200).json({
      success: true,
      student,
      message: "update the student successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// delete Students



// Backend deleteStudent function
const deleteStudent = async (req, res) => {
  try {
    const { id: studentID } = req.params;
    const student = await Student.findOneAndDelete({_id:studentID});

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `No student found with ID: ${studentID}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting student",
      error: error.message,
    });
  }
};




module.exports = {
  getAllStudents,
  getStudent,
  createStudent:[upload.single("profilePicture"),createStudent],
  updateStudent:[upload.single("profilePicture"),updateStudent],
  deleteStudent,
};
