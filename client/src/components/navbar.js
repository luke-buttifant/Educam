import { CgProfile } from 'react-icons/cg'
import { BsCalendarCheck, BsInfoCircle } from 'react-icons/bs'
import { MdNavigateBefore, MdOutlineNavigateBefore, MdOutlineNavigateNext, MdOutlineSpaceDashboard } from 'react-icons/md'
import { AiOutlineInfoCircle, AiOutlineSetting } from 'react-icons/ai'
import { GoSignOut } from 'react-icons/go'
import Logo from '../images/Logo.webp'
import dp from '../images/dp.png'
import {React, useState, useEffect} from 'react'
import {useLocation } from "react-router-dom";
import Toggle from './ThemeToggle'
import MobileToggle from './MobileThemeToggle'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { LazyLoadImage } from 'react-lazy-load-image-component';


function NavBar(){
  const withouSidebarRoutes = ["/login", "/register", "/terms"];

  let navigate = useNavigate()
  
  useEffect(async () => {
    await userAuthenticated();
  }, []);

const [data, setData] = useState({first_name: "Loading..."})

  const userAuthenticated = async () => {
    await axios.get("/api/users/currentUser", {headers: {
      "x-access-token": localStorage.getItem("jwt")
    }}).then((response) => {
      setData(response.data)
    })
  }

  function toggleNav(){
    document.getElementById("topNav").classList.toggle("hidden");
    document.getElementById("bottomNav").classList.toggle("hidden");
  }
  

  const {pathname} = useLocation();
  if (withouSidebarRoutes.some((item) => pathname.includes(item))) return null;

  function logOut(){
    localStorage.removeItem("jwt");
    navigate('/login');
  }
  
  return(
  <>
  <section id="bottom-navigation" className="block fixed inset-x-0 bottom-0 z-10 bg-white shadow">
		<div id="tabs" className="flex justify-between">
			<a href="/permissions" className="w-full focus:text-primary hover:text-primary justify-center inline-block text-center pt-2 pb-1">
      <MdOutlineSpaceDashboard size={30} className="inline-block mb-1" />
				<span className="tab tab-home block text-xs">Home</span>
			</a>
			<a href="/profile" className="w-full focus:text-primary hover:text-primary justify-center inline-block text-center pt-2 pb-1">
      <CgProfile size={30} className="inline-block mb-1" />
				<span className="tab tab-kategori block text-xs">Profile</span>
			</a>
			<a href="/calendar" className="w-full focus:text-primary hover:text-primary justify-center inline-block text-center pt-2 pb-1">
      <BsCalendarCheck size={30} className="inline-block mb-1" />
				<span className="tab tab-explore block text-xs">Calendar</span>
			</a>
			<a href="#" className="w-full focus:text-primary hover:text-primary justify-center inline-block text-center pt-2 pb-1">
      <AiOutlineInfoCircle size={30} className="inline-block mb-1" />
				<span className="tab tab-whishlist block text-xs">About</span>
			</a>
			<a href="#" className="w-full focus:text-primary hover:text-primary justify-center inline-block text-center pt-2 pb-1">
      <GoSignOut size={30} className="inline-block mb-1" />
				<span className="tab tab-account block text-xs">Log Out</span>
			</a>
		</div>
	</section>
  {/* <div id="topNav" className="float-left top-0 left-0 h-screen m-5 shadow-2xl flex justify-center min-h-screen hidden">
    <div className="w-64 bg-white dark:bg-dark-mode rounded-md">
      <div className="px-6 pt-8">
        <div className="flex items-center justify-between">
          <a
            href="#"
            className="w-12 rounded flex "
          >
            <img width="50px" height="50px" src={Logo}></img>
          </a>
          <button onClick={toggleNav} className="flex items-center justify-center p-0.5 bg-gray-200 rounded-md roundedfocus:outline-none focus:ring-1 focus:ring-gray-500 shadow-lg">
            <MdOutlineNavigateBefore size={30} />
          </button>
        </div>
      </div>
      <div className="px-6 pt-4">
        <div className="relative">
        </div>
      </div>
      <div className="px-6 pt-4">
        <ul className="flex flex-col space-y-2">
          <li className="relative text-primary dark:text-white hover:text-white focus-within:text-white">
            <div
              className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none"
            >
              <MdOutlineSpaceDashboard size={30} className="ml-2" />

            </div>
            <a
              href="/permissions"
              className="inline-block w-full py-2 pl-14 text-m rounded hover:bg-secondary dark:hover:bg-gray-600 dark:text-white focus:outline-none hover:text-white focus:bg-secondary focus:text-white text-primary"
            >Dashboard</a
            >
          </li>
          <li className="relative text-primary dark:text-white hover:text-white focus-within:text-white">
            <div
              className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none"
            >
              <CgProfile size={30} className="ml-2"/>

            </div>
            <a href='/profile'
                  className="inline-block w-full py-2 pl-14 text-m rounded hover:bg-secondary focus:outline-none hover:text-white focus:ring-1 focus:ring-gray-500 focus:bg-secondary focus:text-white text-primary dark:hover:bg-gray-600 dark:text-white"
                >Profile</a>
          </li>
          <li className="relative text-primary dark:text-white hover:text-white focus-within:text-white">
            <div
              className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none hover:text-white"
            >
              <BsCalendarCheck size={30} className="ml-2"/>
            </div>
            <a
              href="/calendar"
              className="inline-block w-full py-2 pl-14  text-m rounded hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-gray-500 focus:bg-secondary focus:text-white dark:hover:bg-gray-600 dark:text-white"
            >Calendar</a
            >
          </li>
          <li className="relative text-primary dark:text-white hover:text-white focus-within:text-white">
            <div
              className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none"
            >
              < AiOutlineInfoCircle size={30} className="ml-2"/>
            </div>
            <a
              href="#"
              className="inline-block w-full py-2 pl-14 text-m rounded hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-gray-500 focus:bg-secondary focus:text-white dark:hover:bg-gray-600 dark:text-white"
            >About Us</a
            >
          </li>
        </ul>
      </div>

             <div className="px-6 pt-8">
          <hr className="border-gray-700" />
         </div>
        <div className="pl-6 pr-4 py-4 bg-secondary rounded shadow-lg flex items-center justify-between mt-10">
         <div className="flex items-center">
            <div
              className="relative w-14 h-14 rounded-full"
            >
              {data.pic ? <LazyLoadImage
              alt="profile picture"
              height="50px"
              width="50px"
              className='rounded-full mt-1'
              src={data.pic}
              /> : ""} */}
              {/* <img
                className="rounded-full w-14 h-14"
                src={data.pic}
                alt=""
              /> */}
            {/* </div>
            <div className="flex flex-col pl-3">
              <div className="text-sm text-gray-50">{data.first_name ? data.first_name : "Loading..."}</div>
              <span className="text-sm text-gray-200 font-light tracking-tight">
               {data.school}
               </span>
            </div>
          </div> */}
       {/* </div>
      <div className="px-6 pt-4 pb-8">
        <ul>
          <li className="relative text-primary dark:text-white hover:text-white focus-within:text-white">
            <div
              className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none"
            >
              < AiOutlineSetting size={30} className="ml-2"/>
            </div>
            <a
              href="#"
              className="inline-block w-full py-2 pl-14 text-m rounded hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-gray-500 focus:bg-secondary focus:text-white"
            >Settings</a
            >
          </li>
          <button type='button' onClick={logOut}><li className="relative text-primary dark:text-white hover:text-white focus-within:text-white">
            <div
              className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none mt-2">
              <GoSignOut size={30} className="ml-2"/></div>
            <div className="inline-block w-full py-2 pl-14 text-m rounded hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-gray-500 focus:bg-secondary focus:text-white">Sign Out</div>
          </li></button>
        </ul> */}
        {/* DARK MODE TOGGLE */}
        {/* <Toggle /> */}

      {/* </div>
    </div>
  </div> */}


  {/* IN NAV */}
  {/* <div id="bottomNav" className="float-left top-0 left-0 h-screen m-5 shadow-2xl flex justify-center min-h-screen  ">
    <div className="w-24 bg-white dark:bg-dark-mode rounded-tl-lg rounded-bl-lg shadow">


      <div className="px-6 pt-8">


        <div className="flex items-center justify-between mb-5 w-14">
          <a
            href="#"
            className="flex "
          >
            <img width={50} height={50} src={Logo} className="w-12"></img>
          </a>
        </div>
                  <button onClick={toggleNav} className="bg-white  rounded-tr-lg rounded-br-lg focus:outline-none  absolute top-16 left-24 dark:bg-dark-mode dark:text-white">
            <MdOutlineNavigateNext  size={30}/>
          </button>

      </div>
      <div className="px-6 pt-4">
        <ul className="flex flex-col space-y-5">
          
        <a href='/permissions'><li className="relative text-primary hover:text-white focus-within:text-white mx-auto rounded-lg p-2 hover:bg-secondary dark:text-white">
            <div
            className="flex items-center mx-auto pointer-events-none pl-1">
            <MdOutlineSpaceDashboard size={30}/>
          </div>
          </li>
          </a>

          <a href='/profile'><li className=" relative text-primary hover:text-white focus-within:text-white mx-auto rounded-lg p-2 hover:bg-secondary dark:text-white">
            <div
            className="flex items-center pointer-events-none pl-1">
            <CgProfile size={25}/>
          </div>
          </li>
          </a>

          <a href='/calendar'><li className="relative text-primary hover:text-white focus-within:text-white mx-auto rounded-lg p-2 hover:bg-secondary dark:text-white">
            <div
            className="flex items-center mx-auto pointer-events-none pl-1">
            <BsCalendarCheck size={25}/>
          </div>
          </li></a>

          <li className="relative text-primary hover:text-white focus-within:text-white mx-auto rounded-lg p-2 hover:bg-secondary dark:text-white">
            <div
            className="flex items-center mx-auto pointer-events-none">
            <BsInfoCircle size={25}/>
          </div>
          </li>

        </ul>
      </div>

      <div className="px-6 pt-8">
        <hr className="border-gray-700" />
      </div>
      <div className="px-6 pt-4">

        <ul className="space-y-2">

          <a href='/test'><li className="relative text-primary hover:text-white focus-within:text-white mx-auto rounded-lg p-4 hover:bg-secondary dark:text-white">
            <div
              className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
              < AiOutlineSetting size={25}/>
            </div>
          </li></a>

          <button type='button' onClick={logOut}><li className="relative text-primary hover:text-white focus-within:text-white mx-auto rounded-lg p-4 hover:bg-secondary dark:text-white mt-4">
            <div
              className="absolute inset-y-0 left-0 flex items-center pl-3 mx-auto pointer-events-none">
              <GoSignOut size={25}/>
            </div>
          </li></button>

        </ul>
        <MobileToggle />
      </div>

    </div>
  </div> */}
</>

  )
  
}

const NavBarIcon = ({ icon, text }) => (
  <div className='sidebar-icon group'>
    {icon}

    <span className='sidebar-tooltip group-hover:scale-100'>
      {text}
    </span>
  </div>
);

export default NavBar;