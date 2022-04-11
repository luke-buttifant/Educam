const express = require('express')
const router = express.Router()
const User = require('../model/userModel')
const {addClassroom, getClassrooms, editClassroom, addClassroomAdmin} = require('../controllers/classroomController.js')
const verify = require('../middlewares/verifyToken')

router.post('/addClassroom', addClassroom)
router.get('/getClassrooms', getClassrooms)
router.post('/editClassroom', editClassroom)
router.post('/addClassroomAdmin', addClassroomAdmin)


module.exports = router