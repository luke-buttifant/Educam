import {React, useState, useEffect, useRef, useReducer} from "react"
import * as ReactDOM from 'react-dom';
import "../App.css"
import VideoFeed from "../components/getVideoFeed";
import {BsPeopleFill} from 'react-icons/bs'
import {BiSend, BiGlasses} from 'react-icons/bi'
import {FiPhone} from 'react-icons/fi'
import {AiOutlineAudioMuted} from 'react-icons/ai'
import {MdScreenShare} from "react-icons/md"
import {RiSurgicalMaskFill} from "react-icons/ri"
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
import draw from "../mask";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import * as react from "react"
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { MediaPipeFaceMesh } from "@tensorflow-models/face-landmarks-detection/dist/types";



const Stream = () =>{
  const location = useLocation();
  let navigate = useNavigate()
  const pubVideo = useRef();
  const chatRoom = useRef();
  const canvasRef = useRef();
  const input = useRef();
  const attendanceGrid = useRef();
  const videoDiv = useRef();
  const [clientState, setClientState] = useState()
  const [connections, setConnections] = useState(0)
  const [isLoading, setIsloading] = useState(false);
  const [AR, setAR] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);
   // Messages States
 const [message, setMessage] = useState("");
 const [picture, setPicture] = useState()
 const [firstName, setFirstName] = useState()
 const [messageList, setMessageList] = useState([]);
 const [userStats, setUserStats] = useState([])
 const [streamObject, setStream] = useState();
 const [muted, setMuted] = useState(false)
 const [intervalState, setIntervalState] = useState()
 const [open, setOpen] = useState(false);
 const [studentName, setStudentName] = useState()
 const [studentList, setStudentList] = useState([]);
 const [openModal, setOpenModal] = useState(false)
 const [maskColour, setMaskColour] = useState("black")

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


const controlLocalVideo = (radio) => {
  if (radio.value === "false") {
    clientState.mute("video");
  } else {
    clientState.unmute("video");
  }
};

const controlLocalAudio = (radio) => {
  muted ? localStream.unmute("audio") : localStream.mute("audio")
  setMuted(!muted)
};



const handleClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setOpen(false);
};

const handleIgnore = (event, reason) => {
  console.log(reason)
  if (reason === 'clickaway'){
    return;
  }

const openModal = () => {
  setOpenModal(true)
}
const closeModal = () => {
  setOpenModal(false)
}

  socket.emit("ignore_request", location.state.room)
  setOpen(false)
}

const action = (
  <react.Fragment>
    <Button color="secondary" size="small" onClick={handleIgnore}>
      Ignore
    </Button>
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  </react.Fragment>
);

  const sendMessage = async () => {
    const messageData = { message: message, picture: picture, firstName: firstName, time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(), room: location.state.room}
    socket.emit("send_message", messageData );
    setMessageList((list) => [...list, messageData])
    input.current.value = '';
  };



  useEffect(() => {
    userAuthenticated();
    connectToSFU();
    socket.emit("get_users", location.state.room)
  }, [])

  useEffect(() => {
    socket.emit("teacher_joined", location.state.room)

    var time = window.localStorage.getItem("meetingTime")
    console.log(JSON.parse(time))
  }, [])

  useEffect(() => {
    window.localStorage.setItem("meetingTime", JSON.stringify({hours: hours, minutes: minutes, seconds: seconds}))
  }, [hours, minutes, seconds])

  useEffect(() => {

    socket.on("connect", () => {
      socket.emit("get_users", location.state.room)
    })

      socket.off().on("receive_message", (data) => {
        setMessageList((list) => [...list, data])
      });


      socket.on("user_joined_room", (data) => {
        console.log(data)
          // connectToSFU()
          socket.emit("get_users", location.state.room)
          setStudentList([...studentList, data.name])
          socket.emit("teacher_check_approved", location.state.room)
      })

      socket.on("user_count", (data) => {
        console.log(data)
      })

      socket.on("student_raised_hand", (data) => {
        setStudentName(data.name)
        setOpen(true)
      })

      socket.on("student_confirmed_attendance", (data) => {
        console.log(data.name + " is attending")
      })


      socket.on("update_user_connections", (data) => {
        console.log(data)
        console.log("update connections")
      })

      socket.on("user_is_in_room", () => {
        console.log("user in room")
        socket.emit("get_users", location.state.room)
      })
      
      socket.on("student_is_in_room", (data) => {
        console.log("student is in room")
        if(data == location.state.room){
          socket.emit("get_users", location.state.room)
        }
      })

      socket.on("user_list", (data) => {
        console.log(data)
      })

      socket.on("update_user_connection", (data) => {
        console.log("user is already in room")
        if(data == location.state.room){
          socket.emit("get_users", location.state.room)
        }
      })

      socket.on("user_count", (data) => {
        console.log(data)
        setConnections(data.size)
      })


      socket.on("user_left", (room) => {
        socket.emit("get_users", location.state.room)
      })

      
      socket.on("user_sent_stats", (data) => {
        var meetingTime = localStorage.getItem("meetingTime");
        meetingTime = JSON.parse(meetingTime);
        var meetingHours = meetingTime.hours;
        var meetingMinutes = meetingTime.minutes;
        var meetingSeconds = meetingTime.seconds;

        var overalMeetingTime = meetingSeconds + (meetingMinutes * 60) + (meetingHours * 3600);
        var seconds = parseInt(data.seconds) + (parseInt(data.minutes * 60)) + (parseInt(data.hours * 3600))
        console.log(`overal: ${overalMeetingTime} students: ${seconds}`)
        var percDiff = Math.round((seconds / overalMeetingTime) * 100) 
        var status;
        console.log(percDiff)

        var activelyAttendedCount = 0
        var mostlyAttendedCount = 0
        var failedAttendanceCount = 0

        if(percDiff > 60){
          status = "Actively Attended"
          activelyAttendedCount = 1
        }
        else if(percDiff > 0){
          status = "Attended"
          mostlyAttendedCount = 1
        }
        else{
          status = "Not attended"
          failedAttendanceCount = 1
        }


        setUserStats((stats) => [...stats, {id: data.email, hours: data.hours, minutes: data.minutes, seconds: data.seconds, status: status, activelyAttendedCount, mostlyAttendedCount, failedAttendanceCount}])
      })



      socket.on("user_disconnected", () => {
        socket.emit("get_users", location.state.room)
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
      socket.emit("join_room", {room: location.state.room, name: response.data.pic, username: response.data.first_name})
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
    streamWebcam(client);
  }

  const [localStream, setLocalStream] = useState()

  function streamWebcam(client){
    LocalStream.getUserMedia({
      resolution: 'vga',
      audio: true,
      codec: "vp9",
      simulcast: true
    }).then((media) => {
    setLocalStream(media)
    pubVideo.current.srcObject = media;
    pubVideo.current.autoplay = true;
    pubVideo.current.controls = true;
    pubVideo.current.muted = true;
    client.publish(media);
    })
  }


  function endCall(){
    
    socket.emit("end_call", {room: location.state.room});
    document.getElementById("videoDiv").classList.add("hidden")
    document.getElementById("attendanceGrid").classList.remove("hidden") 
    document.getElementById("chat").classList.add("hidden")
    pause();
  }

  async function updateAttendance(stats){
    
    console.log(stats)
    var emails = []
    var hours = []
    var minutes = []
    var seconds = []
    var status = []
    var activeCount = []
    var mostlyCount = []
    var failedCount = []
    for(let i = 0; i < stats.length; i++){
      emails.push(stats[i].id)
      hours.push(stats[i].hours)
      minutes.push(stats[i].minutes)
      seconds.push(stats[i].seconds)
      status.push(stats[i].status)
      activeCount.push(stats[i].activelyAttendedCount)
      mostlyCount.push(stats[i].mostlyAttendedCount)
      failedCount.push(stats[i].failedAttendanceCount)
      
    }
    await axios.post("/api/classroom/updateAttendance", {_id: data._id,userEmails: emails, hours: hours, minutes: minutes, seconds: seconds, event_id: location.state.event_id, status: status, activelyAttendedCount: activeCount, mostlyAttendedCount: mostlyCount, failedAttendanceCount: failedCount }).then((res) => {
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

  function changeState(conditon){
    setIsloading(conditon)
  }

  const runFaceDetection = async () =>{

    changeState(true);
    if(AR){
      clearInterval(intervalState)
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      changeState(false)
      setAR(!AR)
      socket.emit("turn_off_ar", location.state.room)
      return
    }

    console.log("tensorflow loading...")
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
    runtime: 'mediapipe', // or 'tfjs'
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
    }
    const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    console.log("tensorflow loaded...")
    setIntervalState(setInterval(() => {
      detect(detector, AR)
    }, 100))
    changeState(false)
    

    
  }
  var running = true;

  const returnTensors = false;
  

  const detect = async (model, AR) => {
    setAR(!AR)
      if(
        typeof pubVideo.current !== "undefined" &&
        pubVideo.current !== null
      ){
        //Get video properties
        const videoWidth = pubVideo.current.videoWidth;
        const videoHeight = pubVideo.current.videoHeight;
  
        //Set video height and width
        pubVideo.current.width = videoWidth;
        pubVideo.current.height = videoHeight;
  
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
  
        const prediction = await model.estimateFaces(pubVideo.current)        
        const ctx = canvasRef.current.getContext("2d");
        if(prediction.length > 0){
        //   for (let i = 0; i < prediction.length; i++) {
        //     const x = prediction[i].landmarks[0][0]
        //     const y =  prediction[i].landmarks[0][1]
        //     const start = prediction[i].topLeft;
        //     const end = prediction[i].bottomRight;
        //     const size = [end[0] - start[0], end[1] - start[1]];
        
          socket.emit("ar_coordinates", {prediction: prediction, room: location.state.room, colour: localStorage.getItem("mask_colour"), ar: AR})
        // }
          draw(prediction, ctx, videoWidth, videoHeight, localStorage.getItem("mask_colour"))
        // requestAnimationFrame(() => {
        //   // draw(prediction, ctx, videoWidth, videoHeight)
        // })
        // console.log(prediction)
      }
        
    }
  }

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    console.log(maskColour + " has changed")
    
  }, [maskColour])

 function getRoomUsers(){
   socket.emit("get_users", location.state.room)
 }

 function changeMask(colour, e){
   var btns = ["redBtn", "greenBtn", "blackBtn", "purpleBtn"]
   for(let i = 0; i < btns.length; i++){
     document.getElementById(btns[i]).classList.remove("-translate-y-1")
   }
   document.getElementById(e.target.id).classList.add("-translate-y-1")
   localStorage.setItem("mask_colour", colour)
 }

 const [camTrack, setCamTrack] = useState()
 const [shareTrack, setShareTrack] = useState()

 function shareScreen(){
   if(sharingScreen){
    LocalStream.getUserMedia({
      resolution: 'vga',
      audio: true,
      codec: "vp9",
      simulcast: true
    }).then((media) => {
    localStream.updateTrack(media.getTracks()[1], shareTrack)
    pubVideo.current.srcObject = media;
    pubVideo.current.autoplay = true;
    pubVideo.current.controls = true;
    pubVideo.current.muted = true;
    })
    setSharingScreen(false)
   }
   else{
    LocalStream.getDisplayMedia({
      resolution: 'hd',
      audio: false,
      codec: "vp9",
      simulcast: false
    }).then((media) => {
    var screenTrack = media.getTracks()
    var webcamTrack = localStream.getTracks()
    localStream.updateTrack(screenTrack[0], webcamTrack[1])
    pubVideo.current.srcObject = media;
    pubVideo.current.autoplay = true;
    pubVideo.current.controls = true;
    pubVideo.current.muted = true;
    setShareTrack(screenTrack[0])
    setCamTrack(webcamTrack[1])
    socket.emit("sharing_screen", location.state.room)
    setSharingScreen(true)
    })
   }

  
  console.log(localStream)
 }
  return (
      <>
      <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={`${studentName} raised their hand!`}
        action={action}
      />
    </div>
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
      <div id="videoDiv" className="col-span-2 mt-10 mx-5">
        <div>

        <div className="videoParent">
            <div><video autoPlay={true} id="videoElement" ref={pubVideo} className='rounded-lg shadow-lg min-w-[100%] '></video></div>
            <div><canvas className=" min-h-[100%] max-w-[100%]" ref={canvasRef}></canvas></div>
        </div>

        {AR ?  <div className="max-w-[60%] mx-auto grid grid-cols-4 gap-2 transition-all duration-150 ease-out scale-100 ">
        <div onClick={(e) => changeMask("red", e)} id="redBtn" className="rounded-lg shadow-lg cursor-pointer bg-red-400 min-w-[100px] min-h-[20px] hover:animate-pulse"></div>
        <div onClick={(e) => changeMask("green", e)} id="greenBtn" className="rounded-lg shadow-lg cursor-pointer bg-green-400 hover:animate-pulse"></div>
        <div onClick={(e) => changeMask("black", e)} id="blackBtn" className="rounded-lg shadow-lg cursor-pointer bg-black hover:animate-pulse"></div>
        <div onClick={(e) => changeMask("purple", e)} id="purpleBtn" className="rounded-lg shadow-lg cursor-pointer bg-purple-400 hover:animate-pulse"></div>
        </div> : <div className="max-w-[60%] mx-auto grid grid-cols-4 gap-2 transition-all duration-150 ease-out scale-0"></div>}

        <div className="max-w-[80%] mx-auto">
        <div className="container mt-5 flex flex-row mx-auto">
          <div className={muted ? "w-20 h-20 rounded-full mx-auto bg-red-500 hover:opacity-75 cursor-pointer" : "w-20 h-20 bg-gray-300 rounded-full mx-auto hover:opacity-75 cursor-pointer"} onClick={controlLocalAudio}><AiOutlineAudioMuted size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-red-400 rounded-full mx-auto cursor-pointer hover:opacity-50" onClick={endCall}><FiPhone size={40} className="mx-auto text-center mt-5 p-2 "/></div>
             <div className="w-20 h-20 bg-gray-300 rounded-full  mx-auto cursor-pointer" onClick={shareScreen}><MdScreenShare size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"><BsPeopleFill size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto cursor-pointer" onClick={runFaceDetection}>{isLoading ? <RiSurgicalMaskFill color={localStorage.getItem("mask_colour")} size={40} className="mx-auto text-center mt-5 p-2 animate-spin"/> : <RiSurgicalMaskFill color={localStorage.getItem("mask_colour")} size={40} className="mx-auto text-center mt-5 p-2"/> }</div>

        </div>
        </div>
        </div>
        </div>
        <div id="chat" className="rounded-lg min-w-max shadow-lg max-h-[90vh] min-h-[90vh]">
        <div className="chat h-[85%] bg-white dark:bg-dark-mode-secondary relative noScrollBar">
            <div className="flex flex-row items-center">
            <div className="mt-6"><h1 className="font-bold text-xl text-gray-400 ml-10">{location.state.title}</h1></div>
            <div className="text-secondary ml-4 mt-6 w-10 rounded-full flex flex-row">{studentList.map((pics) => <img className="rounded-full mx-1" src={pics}></img>)}</div>
            </div>
            <div className="items-center mt-2">
                <h2 className="mx-auto text-center font-bold text-secondary mb-2">CHAT</h2>
                <div className="w-full border-t border-4 border-secondary"></div>
            </div>
            <div className="max-h-[80%] overflow-auto noScrollBar">
            <div id="chat-room" ref={chatRoom} className="flex flex-col divide-y">
              {messageList.map((messageContent) => {
                return(
                  <ChatMessage key={messageContent.message + Math.random() * 9999} dp={messageContent.picture} name={messageContent.firstName} message={messageContent.message} time={messageContent.time} />
                )
              })}
            </div>
            </div>
        </div>
        <div className="col-span-2">
        <div className="flex flex-col bg-gray-100 px-10">
        <div className="font-bold text-secondary">Attendance Statistics</div>
        <div className="font-light">Users connected:  {connections}</div>
        <div className="font-light">Meeting Time: {hours}:{minutes}:{seconds}</div>
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