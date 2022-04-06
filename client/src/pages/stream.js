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
import io from 'socket.io-client';
const socket = io.connect("http://localhost:3001");


const Stream = () =>{
  let navigate = useNavigate()
  const pubVideo = useRef();
  const [clientState, setClientState] = useState()
  const [local, setLocal] = useState()

  const [room, setRoom] = useState("");
   // Messages States
 const [message, setMessage] = useState("");
 const [messageReceived, setMessageReceived] = useState("");

  // const joinRoom = () => {
  //   if (room !== "") {
  //     socket.emit("join_room", localStorage.getItem("room"));
  //   }
  // };

  const sendMessage = () => {
    socket.emit("send_message", { message });
  };

  useEffect(() => {
      userAuthenticated();
      connectToSFU();
      // joinRoom();
      socket.on("receive_message", (data) => {
        setMessageReceived(data.message);
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
    setClientState(client);

    signal.onopen = () => client.join("test room");
    
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
    socket.emit("end_call");
  }



  return (
      <>
      <div className="grid grid-cols-3">
      <div className="col-span-2 mt-32 mx-5">
        <div><video autoPlay={true} id="videoElement" ref={pubVideo} className='rounded-lg shadow-lg min-w-[100%]'></video>
        <div className="max-w-[80%] mx-auto">
        <div className="container mt-5 flex flex-row mx-auto">
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto" ><AiOutlineAudioMuted size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-red-400 rounded-full mx-auto" onClick={endCall}><FiPhone size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-gray-300 rounded-full text-green-400 mx-auto"><AiOutlineUserAdd size={40} className="mx-auto text-center mt-5 p-2"/></div>
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"><BsThreeDots size={40} className="mx-auto text-center mt-5 p-2"/></div>

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
            <ChatMessage dp={dp} name="Luke" message={messageReceived} time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            <ChatMessage dp={dp} name="Luke" message="message..." time="09.24pm" />
            
            
            </div>
            </div>



        </div>
        <div className="justify-center flex  w-[100%] mx-auto bg-white dark:bg-dark-mode-secondary">
                <input type="text" className="mx-auto min-w-[80%] bg-secondary text-white p-4 rounded-lg m-2" placeholder="Message..." onChange={(event) =>{
                  setMessage(event.target.value)}} ></input>
                <button onClick={sendMessage} className="p-2 dark:text-white"><BiSend size={38}/></button>
                </div>


        </div>

        </div>


    </>
  );
}
export default Stream;