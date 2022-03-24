const express = require('express')
const router = express.Router()
const User = require('../model/userModel')
const {getUsers, specificUser, registerUser, authUser} = require('../controllers/userController')
const verify = require('../middlewares/verifyToken')


//User Controller
router.get('/',verify, getUsers)
router.post('/', registerUser)
router.post('/login', authUser)
router.get('/:id',verify, specificUser)


module.exports = router