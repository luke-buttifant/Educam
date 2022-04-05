const express = require('express')
const router = express.Router()
const User = require('../model/userModel')
const {addClassroom, getClassrooms} = require('../controllers/classroomController.js')
const verify = require('../middlewares/verifyToken')

router.post('/addClassroom', addClassroom)
router.get('/getClassrooms', getClassrooms)


module.exports = router