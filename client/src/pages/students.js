import { useNavigate } from "react-router-dom"
import {useEffect, useState} from 'react'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid';


const Students = () =>{  
  let navigate = useNavigate()

  useEffect(() => {
      userAuthenticated();
    }, [navigate]);
   

const [data, setData] = useState({})

const [classrooms, setClassrooms] = useState([])

  const userAuthenticated = async () => {
      var user = await axios.get("/api/users/currentUser", {headers: {
      "x-access-token": localStorage.getItem("jwt")
    }}).then((response) => {
      setData(response.data)
      setClassrooms(response.data.classrooms)
      if(response.data.message == "authentication failed"){
        localStorage.removeItem("jwt");
        navigate("/login")
      }
    })
  }

  const columns = [
    {
      field: 'name',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastClassAttendanceTime',
      headerName: 'Last Class Attendance Time',
      width: 150,
      editable: true,
    },
    {
      field: 'totalAttendanceTime',
      headerName: 'Total Attendance Time',
      type: 'number',
      width: 110,
      editable: true,
    },
  ];



    return (
        <>
<div className="grid grid-rows mx-10 gap-3 p-10">
{classrooms.map((classroom) => 
    <div className="w-[100%] p-10 bg-white"> <h1 className="font-bold text-center">{classroom.title}</h1>
        <DataGrid key={classroom} style={{height: 400, width: '100%'}}
    
    rows={classroom.students}
    getRowId={(row) => row.name}
    columns={columns}
    pageSize={5}
    rowsPerPageOptions={[5]}
    checkboxSelection
    disableSelectionOnClick
  />
        </div>
)}
</div>

        </>
    );
  }
  export default Students;