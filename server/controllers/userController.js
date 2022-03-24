const User = require('../model/userModel')
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateJWT');

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
        res.status(201).json({
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            jwt_token:generateToken(user._id),
        })}
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
        res.header('auth-token', token).send(token)
    }
    else{
        res.status(400)
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

module.exports = { getUsers, registerUser, authUser, specificUser}

