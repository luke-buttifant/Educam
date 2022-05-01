import {React, useEffect, useState} from "react"
import "../App.css"
import loginIllustration from "../images/loginIllustration.webp"
import Logo from '../images/Logo.png'
import axios from "axios"
import Spinner from "../components/spinner"
import ErrorMessage from "../components/errorMessage"
import { useNavigate } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component"


const Login = () =>{
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState("")

    let navigate = useNavigate()


	useEffect(() =>{
	  const userInfo = localStorage.getItem("jwt");
	  if (userInfo){
		  navigate("/permissions")
	  }
  })





    const submitHandler = async (e) =>{
        e.preventDefault();
        
        try{
            const config = {
                headers: {
                    "Content-type":"application/json"
                }
            }
            setLoading(true)
            const {data} = await axios.post('api/users/login',{
                email, password
            }, config).then((response) => {
                localStorage.setItem('jwt', response.data.token);
                navigate("/login")
                setLoading(false)
            })

            console.log(data)

        }catch(error){
            setError(error.response.data.message);
            setLoading(false)
        }
    }

  return (
    <>
    <h1 className="flex sm:hidden text-center"><b>Warning!</b>Beta version: This website is not optomised for mobile devices. Please use a desktop/laptop</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <div className="min-w-max min-h-screen hidden sm:flex bg-white">        <LazyLoadImage
              alt="Login Illustration"
              height="50px"
              width="50px"
              className='min-w-max min-h-screen flex'
              src={loginIllustration}
              /></div>
      <div className="text-white font-sans font-bold container bg-white mx-auto text-center">
                <div className="grid grid-rows-6 min-h-screen items-center mx-auto text-center">
                
                    <div className="row-span-4 row-start-1 col-auto text-black mx-auto">
                        <img className="w-32 mb-5 mt-10 ml-20 mx-auto" width={128} height={128} src={Logo}></img>
                        <div className="flex"><h1 className="text-2xl lg:text-3xl pr-2 pt-2">Welcome to</h1><h1 className="text-3xl lg:text-3xl bg-secondary p-2 rounded-lg text-white">Educam.</h1></div>
                        <h2 className="text-xl float-left text-gray-500">login to your account</h2>

                        <form onSubmit={submitHandler}>   
                        <div className="pt-10 pr-20 mx-auto">    
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                            <input 
                                type="email" 
                                name="email" 
                                value={email}
                                placeholder="Email..." 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full py-3 px-3 border hover: border-gray-500 shadow-lg rounded-2xl text-base border-gray-400"/>                            
                        </div>
                        <div className="pt-2 pr-20">
                            <input 
                                type="password" 
                                name="password" 
                                value={password}
                                placeholder="Password..." 
                                onChange={(e) => setPassword(e.target.value)}
                                className=" w-full py-3 px-3 border hover: border-gray-500 shadow-lg rounded-2xl text-base border-gray-400 mx-auto"/>
                            <a href="" className="text-sm font-sans font-medium text-gray-600 underline">
                                Forgot password?
                            </a>
                        </div>
                        <div className="text-sm font-sans font-medium w-full pr-20 pt-5 text-center mx-auto">
                            <button 
                                type="submit"   
                                className="text-center w-full py-4 bg-secondary hover:bg-dark-mode  text-white shadow-lg rounded-2xl mx-auto font-bold ">
                                    <div className="flex flex-row items-center">
                                        <div className="mx-auto flex">
                                        <div className="text-center">SIGN IN</div>{loading && <Spinner />}
                                        </div>
                                    
                                    </div>
                                   
                            </button>
                            <a href="/register" className="text-sm font-sans font-medium text-gray-500 underline mx-auto text-center">
                        Don´t have an account? Sign up
                        </a>
                        </div>
                        </form>
    
                    </div>
    
                </div>         
            </div>
        
    </div>
    
        </>
  );
}
export default Login;