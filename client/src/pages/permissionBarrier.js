import '../components/componentCss/progressCircle.css'

import { useNavigate } from "react-router-dom"
import {useEffect, useState} from 'react'
import axios from 'axios'



const Permissions = () =>{  
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
      if(response.data.is_teacher){
          console.log("true")
          navigate("/teacherDashboard")
      }
      else if(!response.data.is_teacher){
        console.log("false")
          navigate("/studentDashboard")
      }
    })
  }

    return (
        <>
        </>
    );
  }
  export default Permissions;