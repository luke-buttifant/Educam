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
const socket = io.connect("http://localhost:3001");


const Stream = () =>{
  const location = useLocation();
  let navigate = useNavigate()
  const pubVideo = useRef();
  const chatRoom = useRef();
  const input = useRef();
  const [clientState, setClientState] = useState()
  const [local, setLocal] = useState()
  const [connections, setConnections] = useState(0)
  const [once, setOnce] = useState(false)

  const [room, setRoom] = useState("");
   // Messages States
 const [message, setMessage] = useState("");
 const [picture, setPicture] = useState()
 const [firstName, setFirstName] = useState()
 const [messageList, setMessageList] = useState([]);

   console.log(location.state);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", location.state);
    }
  };

  const sendMessage = async () => {
    const messageData = { message: message, picture: picture, firstName: firstName, time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()}
    socket.emit("send_message", messageData );
    setMessageList((list) => [...list, messageData])
    input.current.value = '';
  };

  window.onload = () => {
    userAuthenticated();
  }

  useEffect(() => {
    connectToSFU();
    setOnce(true)
      // joinRoom();
      socket.on("receive_message", (data) => {
        setMessageList((list) => [...list, data])

      });
      socket.on("user_connected", () => {
        
      });
      socket.on("user_disconnected", () => {
        console.log(`User Disconnected`)
      })
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
    setClientState(client);

    signal.onopen = () => client.join(location.state);
    
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
    navigate('/permissions')
  }



  return (
      <>
      <h1>Users Connected: {connections}</h1>
      <div>Room: {location.state}</div>
      <div className="grid grid-cols-3">
      <div className="col-span-2 mt-32 mx-5">
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
            <div id="chat-room" ref={chatRoom} className="flex flex-col divide-y">
              {messageList.map((messageContent) => {
                return(
                  <ChatMessage dp={messageContent.picture} name={messageContent.firstName} message={messageContent.message} time={messageContent.time} />
                )
              })}
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