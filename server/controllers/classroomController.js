const User = require('../model/userModel')
const asyncHandler = require('express-async-handler');
require("dotenv").config();

const addClassroom = asyncHandler(async (req, res) => {
    const {_id, classroom} = req.body;
    try{
        console.log("trying...")
        console.log(_id, classroom)
        await User.findByIdAndUpdate(_id,{
            $push: {classrooms: classroom}
        } ).then(() =>{
            res.send("success")
        })
    }catch(err){
        console.log(err);
        res.send("failed")
    }
})



const getClassrooms = asyncHandler(async (req, res) => {
    const {_id} = req.body
    try{
        const user = await User.findById(_id);
        console.log(user.classrooms);
        res.send(user.classrooms)
    }catch(err){
        console.log(err);
    }
})

module.exports = { addClassroom, getClassrooms}