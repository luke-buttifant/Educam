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


const addClassroomAdmin = asyncHandler(async (req, res) => {
    const {students_emails, classroom} = req.body;
    try{
        console.log("trying...")
        console.log(students_emails, classroom)
        await User.updateMany({email: students_emails},{
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

const updateAttendance = asyncHandler(async (req, res) => {
    var {userEmails, hours, minutes, seconds, event_id} = req.body;
    try{
        for (let i = 0; i < userEmails.length; i++){
            
            var newHours = hours[i] * 3600
            var newMinutes = minutes[i] * 60
            var newSeconds = seconds[i]
            var time = newHours + newMinutes + newSeconds

            var user = await User.findOne({email: userEmails[i], "classrooms.event_id": event_id})
            for(let i = 0; i < user.classrooms.length; i++){
                if(user.classrooms[i].event_id == event_id){
                    var totalAttendance = user.classrooms[i].totalAttendanceTime
                }
            }
            totalAttendance = totalAttendance + time

            await User.findOneAndUpdate({email: userEmails[i], "classrooms.event_id": event_id}, {
                "$set":{
                    "classrooms.$.lastClassAttendanceTime": time,
                    "classrooms.$.totalAttendanceTime": totalAttendance
                }
            })

            console.log(`Updated ${userEmails[i]} attendance statistics`)
        }
        
        res.send("success")
    }
    catch(err){
        console.log(err)
        res.send("fail")
    }
})

module.exports = { addClassroom,addClassroomAdmin, getClassrooms, editClassroom, updateAttendance}