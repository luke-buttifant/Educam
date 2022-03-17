import {React, useState} from "react"
import "../App.css"
import loginIllustration from "../images/loginIllustration.png"
import Logo from '../images/Logo.png'


const Login = () =>{

  return (
    <>
    <div className="flex flex-row">
      <div className="min-w-max min-h-full"><img className="min-w-max min-h-screen hidden lg:flex" src={loginIllustration}></img></div>
      <div className="text-white font-sans font-bold mx-auto container bg-white mx-auto text-center">
                <div className="grid grid-rows-6 min-h-screen items-center mx-auto text-center">
                
                    <div className="row-span-4 row-start-1 col-auto text-black mx-auto">
                        <img className="w-52 mb-5 mt-20 ml-10" src={Logo}></img>
                        <div className="flex"><h1 className="text-2xl lg:text-3xl pr-2 pt-2">Welcome to</h1><h1 className="text-3xl lg:text-3xl bg-secondary p-2 rounded-lg text-white">Educam.</h1></div>
                        <h2 className="text-xl float-left text-gray-500">login to your account</h2>      
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
                                className=" w-full py-3 px-3 border hover: border-gray-500 shadow-lg rounded-2xl text-base border-gray-400 mx-auto"/>
                            <a href="" className="text-sm font-sans font-medium text-gray-600 underline">
                                Forgot password?
                            </a>
                        </div>
                        <div className="text-sm font-sans font-medium w-full pr-20 pt-5 text-center mx-auto">
                            <a href="/profile"><button 
                                type="button"   
                                className="text-center w-full py-4 bg-secondary hover:bg-dark-mode rounded-md text-white shadow-lg rounded-2xl mx-auto font-bold">
                                    SIGN IN
                            </button></a>
                            <a href="/register" className="text-sm font-sans font-medium text-gray-500 underline mx-auto text-center">
                        Don´t have an account? Sign up
                        </a>
                        </div>
    
                    </div>
    
                </div>         
            </div>
        
    </div>
    
        </>
  );
}
export default Login;