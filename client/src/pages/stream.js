import {React, useState, useEffect, useRef} from "react"
import * as ReactDOM from 'react-dom';
import "../App.css"
import VideoFeed from "../components/getVideoFeed";
import {BsFillPlusCircleFill, BsThreeDots} from 'react-icons/bs'
import {BiSend} from 'react-icons/bi'
import {FiPhone} from 'react-icons/fi'
import {AiOutlineAudioMuted, AiOutlineUserAdd} from 'react-icons/ai'
import dp from '../images/dp.png'
import ChatMessage from "../components/chat.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import {useLocation} from 'react-router-dom';
import io from 'socket.io-client';
import { socket } from "../components/socketConnection";
import { DataGrid} from '@mui/x-data-grid';
import { useStopwatch } from 'react-timer-hook';

const Stream = () =>{
  const location = useLocation();
  let navigate = useNavigate()
  const pubVideo = useRef();
  const chatRoom = useRef();
  const input = useRef();
  const attendanceGrid = useRef();
  const videoDiv = useRef();
  const [clientState, setClientState] = useState()
  const [connections, setConnections] = useState(0)
   // Messages States
 const [message, setMessage] = useState("");
 const [picture, setPicture] = useState()
 const [firstName, setFirstName] = useState()
 const [messageList, setMessageList] = useState([]);
 const [userStats, setUserStats] = useState([])

 var {
  seconds,
  minutes,
  hours,
  days,
  isRunning,
  start,
  pause,
  reset,
} = useStopwatch({autoStart: true});


  const sendMessage = async () => {
    const messageData = { message: message, picture: picture, firstName: firstName, time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(), room: location.state.room}
    socket.emit("send_message", messageData );
    setMessageList((list) => [...list, messageData])
    input.current.value = '';
  };

  window.onload = () => {
    userAuthenticated();
    connectToSFU();
  }

  useEffect(() => {
    var time = window.localStorage.getItem("meetingTime")
    console.log(JSON.parse(time))
  }, [])

  useEffect(() => {
    window.localStorage.setItem("meetingTime", JSON.stringify({hours: hours, minutes: minutes, seconds: seconds}))
  }, [hours, minutes, seconds])

  useEffect(() => {
    connectToSFU();
    userAuthenticated();


      socket.off().on("receive_message", (data) => {
        setMessageList((list) => [...list, data])
      });

      socket.on("user_joined_room", (room) => {
        if(room == location.state.room){
          connectToSFU()
          setConnections(connections + 1)
        }
      })

      socket.emit("join_room", location.state.room)
      socket.on("user_connected", () => {
      });

      socket.on("user_left", (room) => {
        setConnections(connections - 1)
      })

      
      socket.on("user_sent_stats", (data) => {
        var seconds = data.seconds + (data.minutes * 60) + (data.hours * 3600)

        setUserStats((stats) => [...stats, {id: data.email, hours: data.hours, minutes: data.minutes, seconds: data.seconds}])
      })



      socket.on("user_disconnected", () => {
        
        console.log(`User Disconnected`)
      })
    }, [navigate, socket, connections]);
   

const [data, setData] = useState({})

  const userAuthenticated = async () => {
      var user = await axios.get("/api/users/currentUser", {headers: {
      "x-access-token": localStorage.getItem("jwt")
    }}).then((response) => {
      setData(response.data)
      setPicture(response.data.pic)
      setFirstName(response.data.first_name)
      if(response.data.message == "authentication failed"){
        localStorage.removeItem("jwt");
        navigate("/login")
      }
    })
  }

  // WEBRTC 
  let client, signal;

  const config = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  function connectToSFU(){
    signal = new IonSFUJSONRPCSignal("wss://test.bestwebrtc.co.uk/ws");
    client = new Client(signal, config);
    setClientState(client);

    signal.onopen = () => client.join(location.state.room);
    
   LocalStream.getUserMedia({
      resolution: 'vga',
      audio: true,
      codec: "vp8"
    }).then((media) => {
    pubVideo.current.srcObject = media;
    pubVideo.current.autoplay = true;
    pubVideo.current.controls = true;
    pubVideo.current.muted = true;
    client.publish(media);
    })
  }


  function endCall(){
    clientState.close();
    socket.emit("end_call", {room: location.state.room});
    document.getElementById("videoDiv").classList.add("hidden")
    document.getElementById("attendanceGrid").classList.remove("hidden") 
    document.getElementById("chat").classList.add("hidden")
    pause();
    console.log(seconds,minutes,hours)
  }

  async function updateAttendance(stats){
    
    console.log(stats)
    var emails = []
    var hours = []
    var minutes = []
    var seconds = []
    for(let i = 0; i < stats.length; i++){
      emails.push(stats[i].id)
      hours.push(stats[i].hours)
      minutes.push(stats[i].minutes)
      seconds.push(stats[i].seconds)
    }
    await axios.post("/api/classroom/updateAttendance", {_id: data._id,userEmails: emails, hours: hours, minutes: minutes, seconds: seconds, event_id: location.state.event_id}).then((res) => {
      console.log(res)
      if(res.data === "success"){
        alert("succesfully updated attendance!")
        navigate('/permissions')
      }
      else{
        alert("error, please try again.")
      }
    })
  }




  const columns = [
    { field: 'id', headerName: 'Email', width: 250,},
    {
      field: 'hours',
      headerName: 'Hours',
      type: 'number',
      width: 200,
      editable: true,
    },
    {
      field: 'minutes',
      headerName: 'Minutes',
      type: 'number',
      width: 200,
      editable: true,
    },
    {
      field: 'seconds',
      headerName: 'Seconds',
      type: 'number',
      width: 200,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'string',
      width: 200,
      editable: true,
    },
  ];
  

  
  return (
      <>
      {/* <h1>Meeting time: {hours},{minutes}, {seconds}</h1> */}
      <div className="grid grid-cols-3">
        <div id="attendanceGrid" className="col-span-3 hidden">
          <div  className="grid bg-white mt-10 rounded-lg p-10 mx-10">
              <div className="text-center font-bold text-2xl mb-5">Attendance Statistics</div>
              <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={userStats}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
    </div>
    <button className="px-10 py-2 bg-secondary text-center mx-auto rounded-lg mt-10 text-white hover:opacity-80" onClick={() => updateAttendance(userStats)}>Submit</button>
          </div>
          
        </div>
      <div id="videoDiv" className="col-span-2 mt-32 mx-5">
        <div><video autoPlay={true} id="videoElement" ref={pubVideo} className='rounded-lg shadow-lg min-w-[100%]'></video>
        <div className="max-w-[80%] mx-auto">
        <div className="container mt-5 flex flex-row mx-auto">
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto" ><AiOutlineAudioMuted size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-red-400 rounded-full mx-auto cursor-pointer hover:opacity-50" onClick={endCall}><FiPhone size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-gray-300 rounded-full text-green-400 mx-auto"><AiOutlineUserAdd size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"><BsThreeDots size={40} className="mx-auto text-center mt-5 p-2"/></div>

        </div>
        </div>
        </div>
        </div>
        <div id="chat" className="rounded-lg min-w-max shadow-lg max-h-[90vh] min-h-[90vh]">
        <div className="chat h-[100%] bg-white dark:bg-dark-mode-secondary relative noScrollBar">
            <div className="grid grid-cols-3 items-center">
            <div className=" col-span-2 mt-6"><h1 className="font-bold text-xl text-gray-400 ml-10">{location.state.title}</h1></div>
            <div className="text-secondary mx-auto mt-6"><BsFillPlusCircleFill size={50}/></div>
            </div>
            <div className="items-center mt-2">
                <h2 className="mx-auto text-center font-bold text-secondary mb-2">CHAT</h2>
                <div className="w-full border-t border-4 border-secondary"></div>
            </div>
            <div className="max-h-[80%] overflow-auto noScrollBar">
            <div id="chat-room" ref={chatRoom} className="flex flex-col divide-y">
              {messageList.map((messageContent) => {
                return(
                  <ChatMessage key={messageContent} dp={messageContent.picture} name={messageContent.firstName} message={messageContent.message} time={messageContent.time} />
                )
              })}
            </div>
            </div>
        </div>
        <div className="col-span-2">
        <div className="flex flex-col bg-gray-100 px-10">
        <div className="font-bold text-secondary">Attendance Statistics</div>
        <div className="font-light">Users connected:  {connections}</div>
        <div className="flex flex-row">
        </div>

        </div>

        </div>
        <div className="justify-center flex  w-[100%] mx-auto bg-white dark:bg-dark-mode-secondary">
                <input ref={input} type="text" className="mx-auto min-w-[80%] bg-secondary text-white p-4 rounded-lg m-2" placeholder="Message..." onKeyPress={(event) => {event.key === "Enter" && sendMessage()}} onChange={(event) =>{
                  setMessage(event.target.value)}} ></input>
                <button onClick={sendMessage} className="p-2 dark:text-white"><BiSend size={38}/></button>
                </div>
        </div>
        </div>
    </>
  );
}
export default Stream;