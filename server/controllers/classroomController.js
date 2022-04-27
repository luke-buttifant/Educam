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
    console.log("attemping...")
    var {_id, userEmails, hours, minutes, seconds, event_id, status, activelyAttendedCount, mostlyAttendedCount, failedAttendanceCount} = req.body;
    try{
        for (let i = 0; i < userEmails.length; i++){
            
            var newHours = parseInt(hours[i] * 3600) 
            var newMinutes = parseInt(minutes[i] * 60) 
            var newSeconds = parseInt(seconds[i]) 
            var time = newHours + newMinutes + newSeconds

            var user = await User.findOne({email: userEmails[i], "classrooms.event_id": event_id})
            for(let i = 0; i < user.classrooms.length; i++){
                if(user.classrooms[i].event_id == event_id){
                    var totalAttendance = user.classrooms[i].totalAttendanceTime
                    var activeCount = parseInt(user.classrooms[i].activelyAttendedCount)
                    var mostlyCount = parseInt(user.classrooms[i].mostlyAttendedCount)
                    var failedCount = parseInt(user.classrooms[i].failedToAttendCount)
                }
            }
            totalAttendance = totalAttendance + time

            await User.findOneAndUpdate({email: userEmails[i], "classrooms.event_id": event_id}, {
                "$set":{
                    "classrooms.$.lastClassAttendanceTime": time,
                    "classrooms.$.totalAttendanceTime": totalAttendance,
                    "classrooms.$.status": status[i],
                    "classrooms.$.activelyAttendedCount": (activeCount + parseInt(activelyAttendedCount)),
                    "classrooms.$.mostlyAttendedCount": (mostlyCount + parseInt(mostlyAttendedCount)),
                    "classrooms.$.failedToAttendCount": (failedCount + parseInt(failedAttendanceCount))
                }
            })

            await User.findOneAndUpdate({_id: _id},{"$set":{ "classrooms.$[e].students.$[n].lastClassAttendanceTime": time, "classrooms.$[e].students.$[n].totalAttendanceTime": totalAttendance, "classrooms.$[e].students.$[n].status": status[i]}},{
                arrayFilters: [
                    { "e.event_id": event_id},
                    {"n.name": userEmails[i]}
                ]
               })


            console.log(`Updated ${userEmails[i]} attendance statistics`)
        }        
        res.send("success")
    }
    catch(err){
        console.log(err)
        res.send("failed to update attendance statistics")
    }
})

module.exports = { addClassroom,addClassroomAdmin, getClassrooms, editClassroom, updateAttendance}