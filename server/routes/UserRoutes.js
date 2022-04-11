const express = require('express')
const router = express.Router()
const User = require('../model/userModel')
const {getUsers,registerUser, authUser, currentUserInfo,uploadReq, uploadImage, getAllUsersSpecificSchool } = require('../controllers/userController')
const verify = require('../middlewares/verifyToken')


//User Controller
router.get('/',verify, getUsers)
router.post('/', registerUser)
router.post('/login', authUser)
router.get('/currentUser',verify, currentUserInfo)
router.get('/UsersFromSchool', getAllUsersSpecificSchool)
router.post('/updateUser', uploadImage, uploadReq)


module.exports = router