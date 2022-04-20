import { Scheduler } from "@aldabil/react-scheduler";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import * as ReactDOM from 'react-dom';
import ClassroomCard from "../components/classroomCards";
import { Button, Typography } from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import { math } from "@tensorflow/tfjs";



const Calendar = () =>{

  window.onload = () => {
    userAuthenticated()
  }

  let navigate = useNavigate()
  useEffect(() => {
    userAuthenticated()
    getAllUsersSpecificSchool()


    }, [navigate]);

const [data, setData] = useState([{title: "fetching...", time: "fetching..."}])
const [users, setUsers] = useState({})
const [isAdmin, setIsAdmin] = useState();

  const userAuthenticated = async () => {
      await axios.get("/api/users/currentUser", {headers: {
      "x-access-token": localStorage.getItem("jwt")
    }}).then((response) => {
      setData(response.data)
      if(response.data.is_teacher === true){
        setIsAdmin(true)
      }
      if(response.data.message === "authentication failed"){
        localStorage.removeItem("jwt");
        navigate("/login")
      }
    })
  }

  const getAllUsersSpecificSchool = async () => {
    var currentUser = await axios.get("/api/users/currentUser",  {headers: {
      "x-access-token": localStorage.getItem("jwt")
    }})
    var users = await axios.get("/api/users/UsersFromSchool", {params: {school: currentUser.data.school }})
    setUsers(users.data)

}

  const handleConfirmAdmin = async(event, action) => {
    var user = await axios.get("/api/users/currentUser",  {headers: {
      "x-access-token": localStorage.getItem("jwt")
    }})
    if (action === "edit") {
      await axios.post("/api/classroom/editClassroom" ,{_id: user.data._id, event_id: event.event_id, title: event.title, start: event.start, end: event.end, room: event.Room_id})
    } else if (action === "create") {
      var students_emails = event.student_id;

      var event_id = Math.floor(Math.random() * 9999)
      await axios.post("/api/classroom/addClassroomAdmin",{students_emails: students_emails ,classroom: {
        event_id: event_id, title: event.title, teacher: `${user.data.first_name} ${user.data.last_name}`, start: event.start, end: event.end,room: event.Room_id}
      })

      var students = []
      for(let i = 0; i < students_emails.length; i++){
        students.push({name: students_emails[i]})
      }
      await axios.post("/api/classroom/addClassroom",{_id: user.data._id ,classroom: {
        event_id: event_id, title: event.title, start: event.start, end: event.end,room: event.Room_id, students: students}
      })
      }

      
      return new Promise((res, rej) => {
          res({
            ...event,
            event_id: event.event_id || Math.floor(Math.random() * 9999)
          });
      });
  }


  const handleConfirm = async (event, action) => {
    var user = await axios.get("/api/users/currentUser",  {headers: {
      "x-access-token": localStorage.getItem("jwt")
    }})
    if (action === "edit") {
      await axios.post("/api/classroom/editClassroom" ,{_id: user.data._id, event_id: event.event_id, title: event.title, start: event.start, end: event.end})
    } else if (action === "create") {
      await axios.post("/api/classroom/addClassroom",{_id: user.data._id ,classroom: {
        event_id: Math.floor(Math.random() * 9999), title: event.title, start: event.start, end: event.end,room: event.Room_id}
      })


      }
      
      return new Promise((res, rej) => {
          res({
            ...event,
            event_id: event.event_id || Math.floor(Math.random() * 9999)
          });
      });
    } 

const fetchRemote = async () => {
  var user = await axios.get("/api/users/currentUser",  {headers: {
    "x-access-token": localStorage.getItem("jwt")
  }})
  var events = []
  for (let i = 0; i < user.data.classrooms.length; i++) {
    events.push({event_id: user.data.classrooms[i].event_id, title: user.data.classrooms[i].title, start:  new Date(user.data.classrooms[i].start), end: new Date(user.data.classrooms[i].end), room: user.data.classrooms[i].room})
  }
    return new Promise((res) => {
      try{
        res(
          events
        );
      }
      catch{
        console.log("error fetching events")
      }
    });
  }



  const theme = createTheme({
    palette: {
      primary: {
        main: "#8472FC",
      },
      secondary: {
        main: "#41416E",
      },
      text: {
        primary: "#8472FC",
        },
    },
  });

  function UserCalendar(){
    return <ThemeProvider theme={theme}>
    <Scheduler
        viewerExtraComponent={(fields, event) => {
          var room = event.room
          return (
                        <div className="text-center mt-2">
                          
                          <Link key={Math.random() * 9999} to={"/viewer"}
        state={{room:room, title: event.title, event_id: event.event_id}}
    ><Button key={Math.random() * 9999} variant="contained">Join Classroom</Button></Link>
                        </div>
                      );
                  }}
    onConfirm={handleConfirm}
    remoteEvents={fetchRemote}
view="month"
month={{
 weekDays: [0,1,2,3,4,5,6],
 weekStartOn: 6, 
 startHour: 9, 
 endHour: 17,
}}
week={{ 
 weekDays: [0, 1, 2, 3, 4, 5, 6], 
 weekStartOn: 6, 
 startHour: 9, 
 endHour: 17,
 step: 60
  }}
/> </ThemeProvider>
  }




const AdminCalendar = (users) =>{
  let options = []
  for(let i = 0; i < users.data.length; i++ ){
    options.push({id: i, text: users.data[i].email, value: users.data[i].email})
  }
    return <ThemeProvider theme={theme}>
    <Scheduler
    fields={[
      {
        name: "student_id",
        type: "select",
        
        // Should provide options with type:"select"
        options: options,
        config: { label: "Add Students", multiple: true, }
      },
      {
        name: "Room_id",
        type: "input",
        config: { label: "Room ID", multiline: false, required: true}
      }
    ]}
    viewerExtraComponent={(fields, event) => {
      return (
<div>
              {fields.map((field, i) => {
                if (field.name === "Room_id") {
                  return (
                    <div className="text-center mt-2">
                      <Link key={i} to={"/stream"}
    state={{room:event.room, title: event.title, event_id: event.event_id}}
><Button key={i} variant="contained">Join Classroom</Button></Link>
                    </div>
                  );
                } else {
                  return "";
                }
              })}
            </div>
      );
    }}
    onConfirm={handleConfirmAdmin}
    remoteEvents={fetchRemote}
view="month"
month={{
 weekDays: [0,1,2,3,4,5,6],
 weekStartOn: 6, 
 startHour: 9, 
 endHour: 17,
}}
week={{ 
 weekDays: [0, 1, 2, 3, 4, 5, 6], 
 weekStartOn: 6, 
 startHour: 9, 
 endHour: 17,
 step: 60
  }}


/> </ThemeProvider>
  }

  function CalendarGui(props){
    const isAdmin = props.isAdmin

    if(!isAdmin){
      return <UserCalendar  />;
    }
    return <AdminCalendar data={users}/>;
  }



    return (
        <>
        
        <div className="p-10 dark:bg-dark-mode ">
          <div className="flex mx-auto">
          <div className="w-4 min-h-max bg-secondary mx-auto rounded-l-lg"></div>
          <div className="min-w-[99%] dark:bg-dark-mode-secondary bg-white p-2 rounded-r-lg">
          <CalendarGui isAdmin={isAdmin}/>

</div>
</div>
      </div>
     
      </>
    );
  }
  export default Calendar;