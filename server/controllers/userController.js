const User = require('../model/userModel')
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateJWT');
const jsonwebtoken = require('jsonwebtoken');

// Get users
// Route: /api/users
const getUsers = async (req, res) => { 
    const users = await User.find()


    res.status(200).json(users)
}

const registerUser = asyncHandler(async (req, res) => {
    const {first_name, last_name, email, password, gender, dob, school} = req.body;

    const userExists = await User.findOne({email});

    if (userExists)
    {
    res.status(400);
    throw new Error('User already exists with that email.')
    }

    const user = await User.create({first_name, last_name, email, password, gender, dob, school});

    if(user){
        const token = generateToken(user._id);
        res.json({auth: true, token: token, result: user})
    }
        
        else{
            res.status(400)
            throw new Error("Error Occured!")
        }
});

const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    
    if(user && (await user.matchPassword(password))){
        const token = generateToken(user._id);
        res.json({auth: true, token: token, result: user})
    }
    else{
        res.status(400)
        res.json({auth: false})
        throw new Error("Invalid email or password!")
    }

});

const specificUser = asyncHandler(async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        res.json(user);
    }
    catch{
        console.log("failed to fetch data");
    }
    }
);

const currentUserInfo = asyncHandler(async (req, res) => {
    try{
        console.log(req.userId)
        const user = await User.findById(req.userId);
        console.log(user);
        res.send(user)
    }catch(err){
        console.log(err);
    }
})

module.exports = { getUsers, registerUser, authUser, specificUser, currentUserInfo}

