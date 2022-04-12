import {React, useState, useEffect, useRef} from "react"
import "../App.css"
import VideoFeed from "../components/getVideoFeed";
import {BsFillPlusCircleFill, BsThreeDots} from 'react-icons/bs'
import {BiSend} from 'react-icons/bi'
import {FiPhone} from 'react-icons/fi'
import {AiOutlineAudioMuted, AiOutlineUserAdd} from 'react-icons/ai'
import dp from '../images/dp.png'
import ChatMessage from "../components/chat.js";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Client } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import Webcam from 'react-webcam'
import draw from "../utilities";
import * as tf from '@tensorflow/tfjs'
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom'
import { useStopwatch } from 'react-timer-hook';
import { socket } from "../components/socketConnection";

const Viewer = () =>{
  
  const location = useLocation();
  const blazeface = require('@tensorflow-models/blazeface');
  const webcamRef = useRef(null);
  const canvasRef = useRef(null)
  const attendanceTime = useRef(null)
  const attendanceTxt = useRef(null)
  const [faceDetected, setFaceDetected]= useState(false)

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({autoStart: false});
  

  const runFaceDetection = async () =>{
    const model = await blazeface.load()
    console.log("Blazeface loaded...")
    setInterval(() => {
      detect(model)
    }, 1000);
  }

  var running = true;

  const returnTensors = false;

  const detect = async (model) => {
    if(
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null && webcamRef.current.video.readyState === 4
    ){
      //Get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      //Set video height and width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const prediction = await model.estimateFaces(video, returnTensors)
      if(prediction.length > 0){
        setAttendance("Attending");
        setFaceDetected(true)
      }
      else{
        setAttendance("Not attending")
          setFaceDetected(false)
          
      }
      
      const ctx = canvasRef.current.getContext("2d");
      draw(prediction, ctx)
    }
  }


 
 const [attending, setAttendance] = useState("calculating...")

 // Messages States
 const [message, setMessage] = useState("");
 const [picture, setPicture] = useState("")
 const [firstName, setFirstName] = useState("")
 const [messageList, setMessageList] = useState([]);
 const [gotTrack, SetGotTrack] = useState([]);
 const [clientState, setClientState] = useState()

  var time = useRef()

  const sendMessage = () => {
    const messageData = { message: message, picture: picture, firstName: firstName, time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(), room: location.state.room}
    socket.emit("send_message", messageData );
    setMessageList((list) => [...list, messageData])
  };


  let navigate = useNavigate()
  const subVideo = useRef();
  

  window.onload = () => {
    runFaceDetection();
    connectToSFU();
  }

  if(isRunning && !faceDetected){
    pause();
  }
  if(!isRunning && faceDetected){
    start();
  }

  useEffect(() => {
    userAuthenticated();
    connectToSFU();
    runFaceDetection();



    socket.on("user_joined_room", (room) => {
      if(room == location.state.room){
        connectToSFU()
      }
    })

    socket.emit("join_room", location.state.room)
    


      socket.on("receive_message", (data) => {
        setMessageList((list) => [...list, data])
      });
      socket.on("close_meeting", () => {
        alert("Meeting Over!")
        navigate('/permissions')
      });
    }, [navigate, socket]);
   

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
    signal.onopen = () => client.join(location.state.room);
    setClientState(client)
    client.ontrack = (track, stream) => {
        console.log("got track: ", track.id, "for stream: ", stream.id);
        SetGotTrack(true)
        track.onunmute = () => {
          subVideo.current.srcObject = stream;
          subVideo.current.autoplay = true;
          subVideo.current.muted = false;

          stream.onremovetrack = () => {
            subVideo.current.srcObject = null;
  }
}}}




function end_call(){
  socket.emit("leave_room", location.state.room);
  clientState.close();
  navigate('/permissions')
}



  return (
      <>
      <div className="grid grid-cols-3">
      <div className="col-span-2 mt-32 mx-5">
        <div><video autoPlay={true} id="videoElement" controls ref={subVideo} className='rounded-lg shadow-lg min-w-[100%]'></video>
        <div className="max-w-[80%] mx-auto">
        <div className="container mt-5 flex flex-row mx-auto">
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"><AiOutlineAudioMuted size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-red-400 rounded-full mx-auto cursor-pointer hover:opacity-50" onClick={end_call}><FiPhone size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-gray-300 rounded-full text-green-400 mx-auto"><AiOutlineUserAdd size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"><BsThreeDots size={40} className="mx-auto text-center mt-5 p-2"/></div>


        </div>
        </div>
        </div>
        </div>
        <div className="rounded-lg min-w-max shadow-lg max-h-[90vh] min-h-[90vh]">
        <div className="chat min-h-[80vh] max-h-[80vh] bg-white dark:bg-dark-mode-secondary relative noScrollBar">
            <div className="grid grid-cols-3 items-center">
            <div className=" col-span-2 mt-10"><h1 className="font-bold text-xl text-gray-400 ml-10">{location.state.title}</h1></div>
            <div className="text-secondary mx-auto mt-10"><BsFillPlusCircleFill size={50}/></div>

            </div>
            <div className="items-center mt-2">
                <h2 className="mx-auto text-center font-bold text-secondary mb-2">CHAT</h2>
                <div className="w-full border-t border-4 border-secondary"></div>
            </div>
            <ScrollToBottom className="message-container">
            <div className="max-h-[60vh] min-h-[60vh] overflow-auto noScrollBar message-container">
            <div className="flex flex-col divide-y ">
              
            {messageList.map((messageContent) => {
                return(
                  <ChatMessage key={messageContent} dp={messageContent.picture} name={messageContent.firstName} message={messageContent.message} time={messageContent.time} />
                )
              })}
              
            </div>
            
            </div>
            </ScrollToBottom>



        </div>
        <div className="flex flex-col">
          <div className="col-span-1 relative">
          <div className="w-56">
              <Webcam size={10} id="localVideo" ref={webcamRef} style={{
                            position: "absolute",
                            marginLeft: "auto",
                            marginRight: "auto",
                            left: 200,
                            top:0,
                            right:0,
                            zIndex:9,
                            width:100,
              }
                
              } />
            <canvas ref={canvasRef}           style={{
           position: "absolute",
           marginLeft: "auto",
           marginRight: "auto",
           top:0,
           left: 200,
           right:0,
           zIndex:9,
           width:100,
        }}></canvas>
            </div>

          </div>
        
        <div className="col-span-2">
        <div className="flex flex-col bg-gray-100 px-10 dark:bg-dark-mode-secondary">
        <div className="font-bold text-secondary">Attendance Statistics</div>
        <div className="flex flex-row">
          <div className="font-light mr-2 dark:text-white">Status: </div><div  className={attending === "Attending" ? "text-secondary font-bold" : "text-red-400 font-bold"}>{attending}</div></div>
        <div className="flex flex-row">
        <div className="font-light mr-2 dark:text-white">Attendance time: </div> <div className={attending === "Attending" ? "text-secondary font-bold" : "text-red-400 font-bold"}> <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span></div>
        </div>

        </div>
        </div>

        </div>

        
        <div className="justify-center flex  w-[100%] mx-auto bg-white dark:bg-dark-mode-secondary">
          
                <input type="text" className="mx-auto min-w-[80%] bg-secondary text-white p-4 rounded-lg m-2" placeholder="Message..." onKeyPress={(event) => {event.key === "Enter" && sendMessage()}} onChange={(event) =>{
                  setMessage(event.target.value)
                }}></input>
                <button onClick={sendMessage} className="p-2 dark:text-white"><BiSend size={38}/></button>
                </div>


        </div>

        </div>


    </>
  );
}
export default Viewer;