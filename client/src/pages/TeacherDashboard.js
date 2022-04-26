import { VictoryPie, VictoryLabel} from 'victory';
import '../components/componentCss/progressCircle.css'
import {AiOutlineConsoleSql, AiOutlineSchedule} from 'react-icons/ai'
import {BiVideoPlus} from 'react-icons/bi'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CircularProgressbar,  buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from "react-router-dom"
import * as React from 'react';
import {useEffect, useState} from 'react'
import axios from 'axios'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const TeacherDashboard = () =>{ 
  const [classrooms, setClassrooms] = useState([]);
  const [choice, setChoice] = useState();
  const [attendanceDataValues, setAttendanceData] = useState([]);
  const [studentNames, setStudentNames] = useState([]);
  const [activelyAttended, setActivelyAttended] = useState([])
  const [attended, setAttended] = useState([])
  const [failedAttendedance, setFailedAttendance] = useState([])
  let navigate = useNavigate()

  useEffect(() => {
      userAuthenticated();
    }, [navigate]);
   

const [data, setData] = useState({})

  const userAuthenticated = async () => {
      var user = await axios.get("/api/users/currentUser", {headers: {
      "x-access-token": localStorage.getItem("jwt")
    }}).then((response) => {
      setData(response.data)
      console.log(response.data.classrooms)
      setClassrooms(response.data.classrooms)
      if(response.data.message == "authentication failed"){
        localStorage.removeItem("jwt");
        navigate("/login")
      }
    })
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Classroom Attendance',
      }
    },
  };

  const labels = ['Start', '', '', '', '', '', 'End'];

  // const attendanceData = {
  //   labels,
  //   datasets: [
  //     {
  //       label: 'Attendance',
  //       data: attendanceDataValues,
  //       borderColor: '#8472FC',
  //       backgroundColor: '#000000',
  //     }
  //   ],
  // };

  const percentage = 66;



  const handleChange = (event) => {
    setActivelyAttended([])
    setAttended([])
    setFailedAttendance([])
    setAttendanceData([])
    var active = []
    var mostly = []
    var failed = []
    var students = []
    var attendanceTime = []

    setChoice(event.target.value);
    for(let i = 0; i < classrooms.length; i++){
      if(classrooms[i].title == event.target.value){
        for(let s = 0; s < classrooms[i].students.length; s++){
          attendanceTime.push( classrooms[i].students[s].lastClassAttendanceTime)
          
          students.push( classrooms[i].students[s].name)
          
          console.log(classrooms[i].students[s].lastClassAttendanceTime)
          if(classrooms[i].students[s].status === "Actively Attended"){
            active.push(classrooms[i].students[s].status)
          }
          else if(classrooms[i].students[s].status === "Attended"){
            mostly.push(classrooms[i].students[s].status)
          }
          else if(classrooms[i].students[s].status === "Not attended"){
            failed.push(classrooms[i].students[s].status)
          }
        }
      }
    }

    console.log(active)
    console.log(mostly)
    console.log(failed)
    setActivelyAttended(active)
    setAttended(mostly)
    setFailedAttendance(failed)
    setStudentNames(students)
    setAttendanceData(attendanceTime)
  };



    return (
        <>
        <div className='text-3xl mb-10 pt-10 font-bold mx-auto'>
          <div className="mx-auto text-center max-w-[50%] bg-white">
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Classrooms</InputLabel>
        <Select
          value={choice == undefined ? '' : choice}
          label="Class"
          onChange={handleChange}
        >
        {classrooms.map((classroom) => 
      <MenuItem key={classroom.room} value={classroom.title}>{classroom.title}</MenuItem>)}
        </Select>
      </FormControl>
    </div>
        </div>
        
        <div className='grid grid-cols-2 gap-10 m-10'>
            <div>
            <div className='m-0 mx-auto'>
        <div className=' bg-white rounded-lg dark:bg-dark-mode-secondary shadow-lg'>
        
        <svg className='max-h-64 mx-auto' viewBox="-50 -50 500 500">
        <VictoryPie
        animate={{
          duration: 2000
        }}
        padAngle={5}
          standalone={false}
          width={400} height={400}
          data={[
            { x: 1, y: activelyAttended.length }, { x: 2, y: attended.length }, { x: 3, y: failedAttendedance.length }
          ]}
          colorScale={["blue", "cyan", "red"]}
          innerRadius={180} labelRadius={155}
          style={{ labels: { display:"none" } }}
          padding={{ top: 20, bottom: 60 }}
        />
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 80, fill: "black"}}
          x={210} y={180}
          text={isNaN(activelyAttended.length / (activelyAttended.length + attended.length + failedAttendedance.length) * 100) ? "0%" : `${(activelyAttended.length / (activelyAttended.length + attended.length + failedAttendedance.length)) * 100}%`}
        />
      </svg>
        <div className='grid grid-cols-3 p-10 text-center'>
          <li className='text-blue-500'>Actively Attended</li>
          <li className='text-cyan-500'>Mostly Attended</li>
          <li className='text-red-500'>Failed to Attend</li>
        </div>
        </div>

        </div>
            </div>
        <div className='rounded-lg dark:bg-dark-mode-secondary shadow-lg max-h-96 bg-white'>
        <Line className='max-h-full' options={options} data={{labels: studentNames.map((names) => names), datasets: [
      {
        label: 'Attendance',
        data: attendanceDataValues.map((times) => times),
        borderColor: '#8472FC',
        backgroundColor: '#000000',
      }
    ]}} />


        </div>




        </div>

        <div className='grid grid-cols-1 lg:px-20 px-0 mt-10'>
            <div className=" mx-24 md:mx-48">
            <div className='m-0 mx-auto'>
        <div className=' bg-white rounded-lg dark:bg-dark-mode-secondary shadow-lg'>
          
          <div className='grid grid-cols-3'>
        <div className='grid col-span-2 grid-rows-2 p-10 rounded-tl-lg rounded-bl-lg'>
          <h1 className='font-bold dark:text-white'>Challenge</h1>
          <h2 className='dark:text-white'>Get 100% of class to actively attend.</h2>
        </div>
        <div className='max-h-max w-24 mx-auto mt-4'>
        <CircularProgressbar value={percentage} text={`${percentage}%`} styles={buildStyles({
              pathColor: `#8472FC`,
              textColor: '#8472FC',
              backgroundColor: '#8472FC',
        })}/>
      </div>
        </div>
        </div>

        </div>
            </div>



        </div>

                <div className='grid grid-cols-1 lg:gap-20 gap-4 lg:px-20 px-0 mt-10'>
            <div className='m-0 mx-auto'>
          
          <div className='grid grid-cols-2 gap-2 mb-10 text-center bg-white dark:bg-dark-mode-secondary px-10 py-4 rounded-lg'>
          <div className='flex flex-col'><a href='/stream'><div className='bg-secondary rounded-lg shadow-lg flex flex-col'><button className='p-5 text-center text-white' type='button'><BiVideoPlus size={100}/></button></div></a>
            <div className='text-xl font-bold dark:text-white'>New Classroom</div></div>
            <div className='flex flex-col'>
            <a href='/students'><div className='bg-dark-mode rounded-lg shadow-lg'><button className='p-5 mx-auto text-center text-white' type='button'><AiOutlineSchedule size={100} /></button></div>
         <div className='text-xl font-bold dark:text-white'>Students</div></a></div>
        </div>

        </div>



        </div>

        </>
    );
  }
  export default TeacherDashboard;