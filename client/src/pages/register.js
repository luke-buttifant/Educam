import {React, useState} from "react"
import "../App.css"
import loginIllustration from "../images/loginIllustration.png"
import Logo from '../images/Logo.png'
import illustration from '../images/loginIllustration.png'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import schools from "../Objects/schools"


const Register = () =>{
  return (
      <>
    <div className="grid grid-cols-2">
      <div className="min-w-max min-h-screen"><img className="min-w-max min-h-screen hidden lg:flex" src={loginIllustration}></img></div>
      <div className="text-white font-sans font-bold container bg-white mx-auto text-center">
                <div className="grid grid-rows-6 items-center mx-auto text-center">
                
                    <div className="row-span-4 row-start-1 col-auto text-black mx-auto min-w-max">
                        <img className="w-32 mb-5 mt-10 ml-20 mx-auto" src={Logo}></img>
                        <div className="flex"><h1 className="text-2xl lg:text-3xl pr-2 pt-2">Welcome to</h1><h1 className="text-3xl lg:text-3xl bg-secondary p-2 rounded-lg text-white">Educam.</h1></div>
                        <h2 className="text-xl float-left text-gray-500">Register an account</h2>      
                        <div className="pt-10 pr-20 mx-auto">                        
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email..." 
                                className="w-full py-3 px-3 border hover: border-gray-500 shadow-lg rounded-2xl text-base border-gray-400"/>                            
                        </div>
                    <div className="pt-2 pr-20">
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password..." 
                            className=" w-full py-3 px-3 border hover: border-gray-500 shadow-lg rounded-2xl text-base border-gray-400"/>
                    </div>
                    <div className="pt-2 pr-20">
                        <input 
                            type="password" 
                            name="repeatPassword" 
                            placeholder="Repeat password..." 
                            className=" w-full py-3 px-3 border hover: border-gray-500 shadow-lg rounded-2xl text-base border-gray-400"/>
                    </div>
                    <div className="pt-2 pr-20">
                    <Autocomplete
                    className="bg-white w-full shadow-lg rounded-2xl text-base border-none "
                        disablePortal
                        id="combo-box-demo"
                        options={schools}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Please select a school..." />}
                        />
                    </div>
                    <div className="text-sm font-sans font-medium w-full pr-20 pt-5 text-center">
                        <button 
                            type="button"   
                            className="text-center w-full py-4 bg-secondary hover:bg-primary rounded-md text-white shadow-lg rounded-2xl">
                                REGISTER
                        </button>
                        <a href="/login" className="text-sm font-sans font-medium text-gray-500 underline mx-auto text-center">
                   Already have an account? Sign in
                    </a>
                    </div>

                </div>

            </div>         
        </div>
    </div>
    </>
  );
}
export default Register;