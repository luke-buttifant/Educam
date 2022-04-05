import { Scheduler } from "@aldabil/react-scheduler";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const Calendar = () =>{
  let navigate = useNavigate()
  useEffect(() => {
    userAuthenticated()
    getAllUsers()


    }, [navigate]);

const [data, setData] = useState({})
const [users, setUsers] = useState()
const [isAdmin, setIsAdmin] = useState();

  const userAuthenticated = async () => {
      var user = await axios.get("/api/users/currentUser", {headers: {
      "x-access-token": localStorage.getItem("jwt")
    }}).then((response) => {
      setData(response.data)
      console.log(response.data.is_teacher)
      if(response.data.is_teacher === true){
        setIsAdmin(true)
      }
      if(response.data.message == "authentication failed"){
        localStorage.removeItem("jwt");
        navigate("/login")
      }
    })
  }

  const getAllUsers = async () => {
    var users = await axios.get("/api/users", {headers: {
    "x-access-token": localStorage.getItem("jwt")}})
    setUsers(users)
}


  const handleConfirm = async (event, action) => {
    var user = await axios.get("/api/users/currentUser",  {headers: {
      "x-access-token": localStorage.getItem("jwt")
    }})
    if (action === "edit") {
      var classroom = await axios.post("/api/classroom/editClassroom" ,{_id: user.data._id, event_id: event.event_id, title: event.title, start: event.start, end: event.end})
      console.log(event)
    } else if (action === "create") {
      console.log(event, action);
      var classroom = await axios.post("/api/classroom/addClassroom",{_id: user.data._id ,classroom: {
        event_id: Math.floor(Math.random() * 9999), title: event.title, start: event.start, end: event.end,room: '123'}
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

    return new Promise((res) => {

      for (let i = 0; i < user.data.classrooms.length; i++) {
        events.push({event_id: user.data.classrooms[i].event_id, title: user.data.classrooms[i].title, start:  new Date(user.data.classrooms[i].start), end: new Date(user.data.classrooms[i].end)})
      }
      console.log(events)
      try{
        res(
          events
        );
      }
      catch{
        console.log("error")
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
  console.log(`data: ${users}`)
  // for(let i = 0; i < users.data.length; i++ ){
  //   options.push({id: i, text: `test${i}`, value: i})
  // }
    return <ThemeProvider theme={theme}>
    <Scheduler
    // fields={[
    //   {
    //     name: "student_id",
    //     type: "select",
        
    //     // Should provide options with type:"select"
    //     options: options,
    //     config: { label: "Add Students", multiple: true, }
    //   },
    //   {
    //     name: "Room ID",
    //     type: "input",
    //     config: { label: "Room ID", multiline: false}
    //   }
    // ]}
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
      <div className="mx-auto w-max">
        <button className="bg-primary px-6 py-2 text-2xl text-white dark:bg-white dark:text-primary font-bold shadow-lg rounded-lg m-10" type="button">Create Classroom</button>
      </div>
      </div>
     
      </>
    );
  }
  export default Calendar;