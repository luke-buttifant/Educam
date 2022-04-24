import { VictoryPie, VictoryLabel} from 'victory';
import '../components/componentCss/progressCircle.css'
import {AiOutlineSchedule} from 'react-icons/ai'
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
import {useEffect, useState} from 'react'
import axios from 'axios'


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

  const attendanceData = {
    labels,
    datasets: [
      {
        label: 'Attendance',
        data: [0, 10, 15, 18, 20, 15, 8],
        borderColor: '#8472FC',
        backgroundColor: '#000000',
      }
    ],
  };

  const percentage = 66;

    return (
        <>

        <div className='text-3xl mb-10 pt-10 font-bold'>Teacher Dashboard</div>
        <div className='grid grid-cols-2 gap-10 m-10'>
            <div className="">
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
            { x: 1, y: 70 }, { x: 2, y: 20 }, { x: 3, y: 10 }
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
          text="75%"
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
        <div className='rounded-lg dark:bg-dark-mode-secondary shadow-lg max-h-96\ bg-white'>
        <Line className='max-h-full' options={options} data={attendanceData} />


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
          <div className='bg-dark-mode rounded-lg shadow-lg'><button className='p-5 mx-auto text-center text-white' type='button'><AiOutlineSchedule size={100} /></button></div>
          <div className='text-xl font-bold dark:text-white'>Schedule</div></div>
        </div>

        </div>



        </div>

        </>
    );
  }
  export default TeacherDashboard;