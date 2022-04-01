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
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';


const Viewer = () =>{
  let navigate = useNavigate()
  const subVideo = useRef();
  const localVideo = useRef();

  useEffect(() => {
      userAuthenticated();
      connectToSFU();
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


var constraints = { audio: true, video: { width: 1280, height: 720 } };

navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream) {
  localVideo.current.srcObject = mediaStream;
  localVideo.current.onloadedmetadata = function(e) {
    localVideo.current.play();
  };
})
.catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.


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
            <video autoPlay={true} id="localVideo" ref={localVideo} className='rounded-lg shadow-lg  h-24'></video>

        </div>
        </div>
        </div>
        </div>
        <div className="rounded-lg min-w-max shadow-lg max-h-[90vh] min-h-[90vh]">
        <div className="chat h-[100%] bg-white dark:bg-dark-mode-secondary relative noScrollBar">
            <div className="grid grid-cols-3 items-center">
            <div className=" col-span-2 mt-10"><h1 className="font-bold text-xl text-gray-400 ml-10 text-center">Dissertation - COM616</h1></div>
            <div className="text-secondary mx-auto mt-10"><BsFillPlusCircleFill size={50}/></div>

            </div>
            <div className="items-center mt-2">
                <h2 className="mx-auto text-center font-bold text-secondary mb-2">CHAT</h2>
                <div className="w-full border-t border-4 border-secondary"></div>
            </div>
            <div className="max-h-[80%] overflow-auto noScrollBar">
            <div className="flex flex-col divide-y">
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            
            
            </div>
            </div>



        </div>
        <div className="justify-center flex  w-[100%] mx-auto bg-white dark:bg-dark-mode-secondary">
                <input type="text" className="mx-auto min-w-[80%] bg-secondary text-white p-4 rounded-lg m-2" placeholder="Message..."></input>
                <button className="p-2 dark:text-white"><BiSend size={38}/></button>
                </div>


        </div>

        </div>


    </>
  );
}
export default Viewer;