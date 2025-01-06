const express =require('express')
const router=express.Router()
const {getAllStudents,getStudent,createStudent,updateStudent,deleteStudent}=require('../controllers/student')


router.route('/getstudents').get(getAllStudents)
router.route('/getstudent/:id').get(getStudent)
router.route('/createstudent').post(createStudent)
router.route('/updatestudent/:id').put(updateStudent)
router.route('/deletestudent/:id').delete(deleteStudent)

module.exports =router