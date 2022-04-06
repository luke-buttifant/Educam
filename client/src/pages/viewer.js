import {React, useState, useEffect, useRef} from "react"
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
import { Client } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import Webcam from 'react-webcam'
import draw from "../utilities";
import * as tf from '@tensorflow/tfjs'
import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001");


const Viewer = () =>{
  var timerStart = Date.now();
  const blazeface = require('@tensorflow-models/blazeface');
  const webcamRef = useRef(null);
  const canvasRef = useRef(null)
  const [isRunning, setIsRunning]= useState(true)

  const runFaceDetection = async () =>{

    const model = await blazeface.load()
    console.log("Blazeface loaded...")

    setInterval(() => {
      detect(model)
    }, 1000);
  }


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
        // console.log(prediction)
        setAttendance("Attending");
        if(!isRunning){
          timeStart();
        }
      }
      else{
        setAttendance("Not attending")
        pauseTime();
        setIsRunning(false)
      }
      
      const ctx = canvasRef.current.getContext("2d");
      draw(prediction, ctx)
    }
  }

  runFaceDetection();
 //Room State
 const [room, setRoom] = useState("");
 const [attending, setAttendance] = useState("")

 // Messages States
 const [message, setMessage] = useState("");
 const [messageReceived, setMessageReceived] = useState("");

  var time = useRef()

  // const joinRoom = () => {
  //   if (room !== "") {
  //     socket.emit("join_room", localStorage.getItem("room"));
  //   }
  // };

  const sendMessage = () => {
    socket.emit("send_message", { message });
  };


  let navigate = useNavigate()
  const subVideo = useRef();
  

  window.onload = () => {
    timeStart();
  }

  useEffect(() => {
      userAuthenticated();
      connectToSFU();
      // joinRoom();
      socket.on("receive_message", (data) => {
        setMessageReceived(data.message);
      });
      socket.on("close_meeting", () => {
        alert("Meeting Over!")
      });
    }, [navigate, socket]);
   

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
    signal.onopen = () => client.join("test room");
    
    client.ontrack = (track, stream) => {
        console.log("got track: ", track.id, "for stream: ", stream.id);
        track.onunmute = () => {
          subVideo.current.srcObject = stream;
          subVideo.current.autoplay = true;
          subVideo.current.muted = false;

          stream.onremovetrack = () => {
            subVideo.current.srcObject = null;
  }
}}}


const [millisecound, setMilliSecond] = useState(0)
let timer;


function timeStart(){
  time.current.style.color = "#0f62fe";
  timer = setInterval(() => {
    setMilliSecond(millisecound + 10);

    let dateTimer = new Date(millisecound);

    time.current.innerHTML = 
    ('0'+dateTimer.getUTCHours()).slice(-2) + ':' +
    ('0'+dateTimer.getUTCMinutes()).slice(-2) + ':' +
    ('0'+dateTimer.getUTCSeconds()).slice(-2) + ':' +
    ('0'+dateTimer.getUTCMilliseconds()).slice(-3,-1);
  }, 10);
}

function pauseTime() {
  time.current.style.color = "red";
  clearInterval(timer);
}

  return (
      <>
      <div className="grid grid-cols-3">
      <div className="col-span-2 mt-32 mx-5">
        <div><video autoPlay={true} id="videoElement" controls ref={subVideo} className='rounded-lg shadow-lg min-w-[100%]'></video>
        <div className="max-w-[80%] mx-auto">
        <div className="container mt-5 flex flex-row mx-auto">
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"><AiOutlineAudioMuted size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-red-400 rounded-full mx-auto"><FiPhone size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-gray-300 rounded-full text-green-400 mx-auto"><AiOutlineUserAdd size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"><BsThreeDots size={40} className="mx-auto text-center mt-5 p-2"/></div>


        </div>
        </div>
        </div>
        </div>
        <div className="rounded-lg min-w-max shadow-lg max-h-[90vh] min-h-[90vh]">
        <div className="chat min-h-[80vh] bg-white dark:bg-dark-mode-secondary relative noScrollBar">
            <div className="grid grid-cols-3 items-center">
            <div className=" col-span-2 mt-10"><h1 className="font-bold text-xl text-gray-400 ml-10 text-center">Dissertation - COM616</h1></div>
            <div className="text-secondary mx-auto mt-10"><BsFillPlusCircleFill size={50}/></div>

            </div>
            <div className="items-center mt-2">
                <h2 className="mx-auto text-center font-bold text-secondary mb-2">CHAT</h2>
                <div className="w-full border-t border-4 border-secondary"></div>
            </div>
            <div className="max-h-[60%] overflow-auto noScrollBar">
            <div className="flex flex-col divide-y">
            <ChatMessage dp={dp} name="Luke" message={messageReceived} time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            </div>
            </div>



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
        <div className="flex flex-col bg-gray-100 px-10">
        <div className="font-bold text-secondary">Attendance Statistics</div>
        <div className="font-light">You are currently: {attending}</div>
        <div className="font-light">Attendance time: <div ref={time}></div></div>
        </div>
        </div>

        </div>

        
        <div className="justify-center flex  w-[100%] mx-auto bg-white dark:bg-dark-mode-secondary">
          
                <input type="text" className="mx-auto min-w-[80%] bg-secondary text-white p-4 rounded-lg m-2" placeholder="Message..." onChange={(event) =>{
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