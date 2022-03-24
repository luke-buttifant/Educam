import {React, useState} from "react"
import "../App.css"
import loginIllustration from "../images/loginIllustration.png"
import Logo from '../images/Logo.png'
import illustration from '../images/loginIllustration.png'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import schools from "../Objects/schools"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from '@mui/lab';
import ErrorMessage from "../components/errorMessage"
import axios from "axios"
import Spinner from "../components/spinner"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import moment from "moment";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const Register = () =>{
    const [email, setEmail] = useState("")
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [password,setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [gender, setGender] = useState("")
    const [dobInput, setDob] = useState("")
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [value, setValue] = useState();

    let navigate = useNavigate()

    useEffect(() =>{
          
      const userInfo = localStorage.getItem("jwt");
      if (userInfo){
          navigate("/")
      }
  }, [navigate])

    const submitHandler = async (e) => {
        e.preventDefault();
        const school = value;


        if(password !== repeatPassword){
            setMessage('Passwords do not match!')
        }
        else{
            setMessage(null)
            // try{
                const config = {
                    headers: {
                        "Content-type": "application/json",
                    },
                };
                setLoading(true);
                const dob = moment(dobInput).format("DD/MM/YYYY").toString();
                const {data} = await axios.post(
                    "/api/users",
                    {first_name, last_name, email, password, gender, dob, school}
                ).then((response) => {
                    localStorage.setItem('jwt', response.data.token);
                    navigate("/")
                    setLoading(false)
                })
                
                setLoading(false)
                navigate('/')
                console.log("succesfull registration")
            // }
            // catch (error){
            //     // setError(error.response.data.message)
            //     setLoading(false)
            //     console.log("failed")
            // }

        }    
    }
    
  return (
      <>
    <div className="grid grid-cols-2">
      <div className="min-w-max min-h-screen"><img className="min-w-max min-h-screen flex" src={loginIllustration}></img></div>
      <div className="text-white font-sans font-bold container bg-white mx-auto text-center">
                <div className="grid grid-rows-6 items-center mx-auto text-center mt-20">
                
                    <div className="row-span-4 row-start-1 col-auto text-black mx-auto min-w-max">
                        <div className="flex"><h1 className="text-2xl lg:text-3xl pr-2 pt-2">Welcome to</h1><h1 className="text-3xl lg:text-3xl bg-secondary p-2 rounded-lg text-white">Educam.</h1></div>
                        <h2 className="text-xl float-left text-gray-500">Register an account</h2>
                        <form onSubmit={submitHandler}>
                        <div className="pt-10 pr-20 mx-auto">   
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                            <input
                                type="text" 
                                name="firstName" 
                                value={first_name}
                                placeholder="First name..." 
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full py-3 px-3 border hover:border-gray-700 shadow-lg rounded-md text-base border-gray-400"/>     
                                </div>
                                <div>
                            <input 
                                type="text" 
                                name="lastName" 
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last name..." 
                                className="w-full py-3 px-3 border hover:border-gray-700 shadow-lg rounded-md text-base border-gray-400"/>     
                                </div>
                            <div>
                        </div>
                        </div>
                            </div>
                        <div className="pr-20 mx-auto">                        
                            <input 
                                type="email" 
                                name="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email..." 
                                className="w-full py-3 px-3 border hover:border-gray-700 border-gray-400  shadow-lg rounded-md text-base "/>                            
                        </div>
                    <div className="pt-2 pr-20">
                        <input 
                            type="password" 
                            name="password" 
                            value={password}
                            placeholder="Password..." 
                            onChange={(e) => setPassword(e.target.value)}
                            className=" w-full py-3 px-3 border hover:border-gray-700 border-gray-400 shadow-lg rounded-md text-base"/>
                    </div>
                    <div className="pt-2 pr-20">
                        <input 
                            type="password" 
                            name="repeatPassword" 
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            placeholder="Repeat password..." 
                            className=" w-full py-3 px-3 border hover:border-gray-700 border-gray-400 shadow-lg rounded-md text-base "/>
                    </div>

                    <div className="pt-2 pr-20">
                    <Autocomplete
        value={value}
        onChange={(event, school) => {
          setValue(school);
        }}
        id="schoolPicker"
        options={schools}
        sx={{ width: 425 }}
        renderInput={(params) => <TextField {...params} label="Please choose a school..." />}
      />
                    </div>
                    <div className="pt-2 mr-20">
                    <LocalizationProvider dateAdapter={AdapterDateFns} className="bg-white">
  <DatePicker
  className="bg-white"
    label="Date of birth"
    value={dobInput || null}
    format="DD-MM-YYYY"
    onChange={(dobInput) => {
      setDob(dobInput);
    }}
    renderInput={(params) => <TextField {...params} fullWidth className="bg-white" />}
    showTodayButton={true}
  />
</LocalizationProvider>
                    </div>
                    <div className="pt-2 pr-20">
                    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
      <RadioGroup
      row
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        onChange={(e) => setGender(e.target.value)}
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
      </RadioGroup>
    </FormControl>
                    </div>
                    <div className="text-sm font-sans font-medium w-full pr-20 pt-5 text-center">
                    {error &&<ErrorMessage>{error}</ErrorMessage>}
                    {message &&<ErrorMessage>{message}</ErrorMessage>}
                    <button 
                                type="submit"   
                                className="text-center w-full py-4 bg-secondary hover:bg-dark-mode  text-white shadow-lg rounded-2xl mx-auto font-bold ">
                                    <div className="flex flex-row items-center">
                                        <div className="mx-auto flex">
                                        <div className="text-center">Register</div>{loading && <Spinner />}
                                        </div>
                                    
                                    </div>
                                   
                            </button>
                        
                        <a href="/login" className="text-sm font-sans font-medium text-gray-500 underline mx-auto text-center">
                   Already have an account? Sign in
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
export default Register;