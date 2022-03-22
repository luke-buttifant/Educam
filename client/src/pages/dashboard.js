import ApexCharts from 'apexcharts'
import { useEffect } from 'react'
import { VictoryPie, VictoryLabel, VictoryChart, VictoryLine } from 'victory';
import { CircularProgress } from '@mui/material';
import '../components/componentCss/progressCircle.css'
import {AiFillVideoCamera, AiOutlineSchedule} from 'react-icons/ai'
import {BiVideoPlus} from 'react-icons/bi'

const Dashboard = () =>{  

    return (
        <>
        <div className='text-3xl mb-10 pt-10 font-bold'>Teacher Dashboard</div>
        <div className='container'>
        <div className='grid grid-cols-2 lg:gap-20 gap-4 lg:px-20 px-0'>
            <div className=" mx-24 lg:mx-48">
            <div className='m-0 mx-auto'>
        <div className=' bg-white rounded-lg dark:bg-dark-mode-secondary shadow-lg'>
          
          <div className='flex flex-col'>
        <svg viewBox="-50 -50 500 450">
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
            </div>
        <div className=' rounded-lg dark:bg-dark-mode-secondary shadow-lg'>
          <div className=' bg-white max-h-max'>
          <svg viewBox='0 0 510 300'>
        <VictoryChart
        standalone={false}
        width={300}
        height={300}>
  <VictoryLine
   standalone={false}
  animate={{
    duration: 2000,
    onLoad: { duration: 1000 }
  }}
  interpolation="natural"
style={{ data: { stroke: "blue", strokeWidth: 1, strokeLinecap: "round"} }}
    data={[
      { x: 0, y: 0 },
      { x: 15, y: 8 },
      { x: 30, y: 8 },
      { x: 45, y: 10 },
      { x: 60, y: 6 }
    ]}
  />
</VictoryChart>
</svg>
</div>
        </div>




        </div>

        <div className='grid grid-cols-1 lg:px-20 px-0 mt-10'>
            <div className=" mx-24 md:mx-48">
            <div className='m-0 mx-auto'>
        <div className=' bg-white rounded-lg dark:bg-dark-mode-secondary shadow-lg'>
          
          <div className='grid grid-cols-3'>
        <div className='grid col-span-2 grid-rows-2 p-10 rounded-tl-lg rounded-bl-lg'>
          <h1 className='font-bold'>Challenge</h1>
          <h2>Get 100% of class to actively attend.</h2>
        </div>
        <div className='p-5 float-right'>
        <CircularProgress className='float-right' variant="determinate" value={100} size={100} color={'primary'} />
      </div>
        </div>
        </div>

        </div>
            </div>



        </div>

                <div className='grid grid-cols-1 lg:gap-20 gap-4 lg:px-20 px-0 mt-10'>
            <div className='m-0 mx-auto'>
          
          <div className='grid grid-cols-2 gap-2 mb-10 text-center bg-white px-10 py-4 rounded-lg'>
          <div className='flex flex-col'><a href='/stream'><div className='bg-secondary rounded-lg shadow-lg flex flex-col'><button className='p-5 text-center text-white' type='button'><BiVideoPlus size={100}/></button></div></a>
            <div className='text-xl font-bold'>New Classroom</div></div>
            <div className='flex flex-col'>
          <div className='bg-dark-mode rounded-lg shadow-lg'><button className='p-5 mx-auto text-center text-white' type='button'><AiOutlineSchedule size={100} /></button></div>
          <div className='text-xl font-bold'>Schedule</div></div>
        </div>

        </div>



        </div>
        </div>

        </>
    );
  }
  export default Dashboard;