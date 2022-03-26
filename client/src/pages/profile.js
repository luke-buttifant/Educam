import "../App.css"
import dp from "../images/dp.png";
import {AiOutlineProfile} from 'react-icons/ai'
import {IoSchoolOutline} from 'react-icons/io5'
import {RiLockPasswordLine} from 'react-icons/ri'
import {FiSettings, FiLogOut} from 'react-icons/fi'
import {ImBin} from 'react-icons/im'
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () =>{
  let navigate = useNavigate()

  useEffect(() => {
      userAuthenticated();
    }, [navigate]);
   
    const [file, setFile] = useState(null)
    const [first_name, setFirstName] = useState();
    const [last_name, setLastName] = useState();
    const [email, setEmail] = useState();
    const [gender, setGender] = useState();
    const [dob, setDob] = useState();

    const onFormSubmit = (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('_id', data._id)
      if(first_name !== undefined){
        formData.append('first_name', first_name)
      }
      if(last_name !== undefined){
        formData.append('last_name', last_name)
      }
      if(email !== undefined){
        formData.append('email', email)
      }
      if(gender !== undefined){
        formData.append('gender', gender)
      }
      if(dob !== undefined){
        formData.append('dob', dob)
      }
      
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        }
      }
  
     axios.post('/api/users/updateUser', formData, config).then((response) => {
        console.log(response.data.filename);
        alert("Succesfully uploaded image");
        
      }).catch((err) => {
        console.log('error', err)
      })
      
    }

    const onInputChange = (e) => {
      setFile(e.target.files[0])
    }
  

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



  return (
      <>
      <form onSubmit={onFormSubmit}>
          <div className="container pt-10">
          <img className="w-52 h-52 mx-auto rounded-full hover:opacity-50 cursor-pointer" src={data.pic}></img>
          <div className="text-center mx-auto">
          <input type="file" className=" text-center mx-auto text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-primary
      hover:file:bg-violet-100
    " name="photo" onChange={onInputChange}/>
          </div>
        
    <h1 className="text-center text-4xl font-Sora dark:text-white mt-2">{data.first_name} {data.last_name}</h1>
    <h2 className="text-center text-2xl font-Sora dark:text-white mb-2">{data.school}</h2>
    <hr className="w-96 mx-auto mb-8 dark:opacity-25"></hr>
    <div className="flex flex-row bg-white dark:bg-dark-mode-secondary rounded-lg shadow-lg mx-auto max-w-[70%] lg:max-w-[50%]">
      <div className="container">
        <div className="grid grid-rows-3 m-10 gap-3 rounded-lg text-center">
          <a href="/profile"><div className="text-2xl text-primary hover:bg-gray-200 p-2 rounded-lg"><div className="flex dark:text-white dark:hover:text-dark-mode"><AiOutlineProfile className="mr-2 mt-1 "/> Profile</div></div></a>
          <a href="/profile"><div className="text-2xl text-primary hover:bg-gray-200 p-2 rounded-lg"><div className="flex dark:text-white dark:hover:text-dark-mode"><RiLockPasswordLine className="mr-2 mt-1"/> Password</div></div></a>
          <a href="/profile"><div className="text-2xl text-primary hover:bg-gray-200 p-2 rounded-lg"><div className="flex dark:text-white dark:hover:text-dark-mode"><IoSchoolOutline className="mr-2 mt-1"/> School</div></div></a>
        </div>
        <hr className="dark:opacity-25"></hr>
      <div className="grid grid-rows-3 mt-4 mr-10 ml-10">
      <a href="/profile"><div className="text-xl text-primary hover:bg-gray-200 p-2 rounded-lg"><div className="flex dark:text-white dark:hover:text-dark-mode"><FiSettings className="mr-2 mt-1"/> Settings</div></div></a>
          <a href="/profile"><div className="text-xl text-primary hover:bg-gray-200 p-2 rounded-lg"><div className="flex dark:text-white dark:hover:text-dark-mode"><FiLogOut className="mr-2 mt-1"/> Sign Out</div></div></a>
          <a href="/profile"><div className="text-xl text-primary hover:text-white p-2 rounded-lg hover:bg-red-500"><div className="flex dark:text-white dark:hover:text-white "><ImBin className="mr-2 mt-1"/> Delete Account</div></div></a>
          
      </div>
      </div>
    <div className="container">
      <h1 className="text-center text-3xl text-gray-600 dark:text-white font-bold m-5">Edit Profile</h1>
      <div className="grid grid-rows-9 gap-2">
      <div><label className="text-gray-500 dark:text-white" htmlFor="name">Username</label></div>
      <div className="grid grid-cols-2">
        <input className="min-w-full dark:bg-dark-mode-secondary   p-2" name="name" defaultValue={data.first_name} type="text" onChange={(e) => setFirstName(e.target.value)}/>
        <input className="min-w-full dark:bg-dark-mode-secondary  mx-2 p-2" name="name" defaultValue={data.last_name} type="text" onChange={(e) => setLastName(e.target.value)}/>
      </div>
      <hr className="dark:opacity-25"></hr>
      <div><label className="text-gray-500 dark:text-white" htmlFor="email">Email Address</label></div>
      <div><input className="min-w-full dark:bg-dark-mode-secondary p-2" name="email" type="text" defaultValue={data.email} onChange={(e) => setEmail(e.target.value)}/></div>
      <hr className="dark:opacity-25"></hr>
      <div><label className="text-gray-500 dark:text-white" htmlFor="gender">Gender</label></div>
      <div><input className="min-w-full dark:bg-dark-mode-secondary p-2" name="gender" type="text" defaultValue={data.gender} onChange={(e) => setGender(e.target.value)}/></div>
      <hr className="dark:opacity-25"></hr>
      <div><label className="text-gray-500 dark:text-white" htmlFor="dob">D.O.B</label></div>
      <div><input className="min-w-full dark:bg-dark-mode-secondary p-2" name="dob" type="text" defaultValue={data.dob} onChange={(e) => setDob(e.target.value)}/></div>
      <hr className="dark:opacity-25"></hr>
      <div className="mx-auto"><button type="submit" className="bg-secondary dark:bg-green-200 p-4 text-3xl rounded-lg w-96 m-5 text-white dark:text-black font-bold dark:hover:bg-primary dark:hover:text-white">Update</button></div>
      </div>

     
    </div>
    </div>

      </div>
      </form>
    
    </>
  );
}
export default Profile;