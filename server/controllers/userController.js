const User = require('../model/userModel')
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateJWT');
require("dotenv").config();
const multer = require('multer')
const {normalize} = require('path')

// Get users
// Route: /api/users
const getUsers = async (req, res) => { 
    const users = await User.find()


    res.status(200).json(users)
}

const registerUser = asyncHandler(async (req, res) => {
    const {first_name, last_name, email, password, gender, dob, school, is_teacher} = req.body;

    const userExists = await User.findOne({email});

    if (userExists)
    {
    res.status(400);
    throw new Error('User already exists with that email.')
    }

    const user = await User.create({first_name, last_name, email, password, gender, dob, school, is_teacher});

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
        const user = await User.findById(req.userId);
        console.log(user.first_name);
        res.send(user)
    }catch(err){
        console.log(err);
    }
})

const multerConfig = multer.diskStorage({
    destination: (req, file, callback) =>{
         callback(null, normalize('./client/public/images'));

    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1];
        callback(null, `image-${Date.now()}.${ext}`);
    }
});

const isImage = (req, file, callback) =>{
    if(file.mimetype.startsWith('image')){
        callback(null, true);
    }
    else{
        callback(new Error('Only images are allowed...'));
    }
}


const upload = multer({
    storage: multerConfig,
    fileFilter: isImage,
});

const uploadImage = upload.single('photo')

const uploadReq = async (req, res) => {
    console.log(req.file);
    try{
        var filename = req.file.filename;
        const _id = req.body._id;
        const first_name = req.body.first_name
        const last_name = req.body.last_name;
        const gender = req.body.gender
        const dob = req.body.dob
        const email = req.body.email

        await User.findByIdAndUpdate(_id,{
                pic: `images/${filename}`,
                first_name: first_name,
                last_name: last_name,
                gender: gender, 
                email: email,
                dob: dob, 

        }),
        res.status(200).json({
            success: 'success',
            filename: filename
        })
    }
    catch{
        const _id = req.body._id;
        const first_name = req.body.first_name
        const last_name = req.body.last_name;
        const gender = req.body.gender
        const dob = req.body.dob
        const email = req.body.email

        await User.findByIdAndUpdate(_id,{
            first_name: first_name,
            last_name: last_name,
            gender: gender, 
            email: email,
            dob: dob, 

    }),
    res.status(200).json({
        success: 'success'
    })
    }

    
}


const getAllUsersSpecificSchool = async (req, res) => {
    console.log(req.query.school)
        console.log(req.body)
        const school = req.query.school
        const users = await User.find({school: school})
        res.status(200).json(users)


}


module.exports = { getUsers, registerUser, authUser, specificUser, currentUserInfo, uploadImage, uploadReq, getAllUsersSpecificSchool}

