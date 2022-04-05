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

const editClassroom = asyncHandler(async (req, res) => {
    const {_id, event_id, title, start, end} = req.body
    try{
        const classroom = await User.findOneAndUpdate({_id: _id, "classrooms.event_id": event_id},{
           "$set":{
               "classrooms.$.title": title,
               "classrooms.$.start": start,
               "classrooms.$.end": end,
           }
        });
        console.log(classroom);
        res.send(classroom)
    }catch(err){
        console.log(err);
    }
})

module.exports = { addClassroom, getClassrooms, editClassroom}